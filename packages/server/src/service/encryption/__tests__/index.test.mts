import { afterEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import { getConfig } from "../../../util/config.mjs";

import { encrypt } from "../encrypt.mjs";
import { decrypt } from "../decrypt.mjs";
import { type Context } from "../../../context.mjs";
import { DEKIdentifier, getDEK } from "../getDEK.mjs";

describe("Encryption Service", () => {
  afterEach(() => {
    mock.restoreAll();
  });

  function harness() {
    // store the key in memory to mimic the database
    let storedKey: string | null = null;
    const ctx = {
      auth: {
        user: {
          id: "123",
        },
      },
      database: {
        user: {
          key: {
            upsert: mock.fn((userId, key) => {
              if (storedKey === null) {
                storedKey = key;
              }
              return Promise.resolve({
                userId,
                key: storedKey,
              });
            }),
          },
        },
      },
    } as unknown as Context;

    const mocked = mock.fn(
      getConfig,
      mock.fn(async (key: string) => {
        if (key === "KEY_ENCRYPTION_KEY") {
          return "test";
        }
        throw new Error(`Unexpected config key: ${key}`);
      }),
    );

    return {
      ctx,
      mocked,
    };
  }

  it("should encrypt and decrypt data", async () => {
    const { ctx } = harness();

    const data = JSON.stringify({
      name: "John Doe",
      age: 30,
      email: "john.doe@example.com",
    });

    const encrypted = await encrypt(ctx, DEKIdentifier.TRANSACTIONS, data);
    const decrypted = await decrypt(ctx, DEKIdentifier.TRANSACTIONS, encrypted);

    assert.strictEqual(decrypted, data);
  });

  it("should bulk encrypt using the getDEK function", async () => {
    const { ctx } = harness();

    const data = JSON.stringify({
      name: "John Doe",
      age: 30,
      email: "john.doe@example.com",
    });

    // its like 35ms per opt to encrypt and decrypt a string...
    const dek = await getDEK(ctx, DEKIdentifier.TRANSACTIONS);

    const start = performance.now();
    const totalRuns = 5000;
    for (let i = 0; i < totalRuns; i++) {
      dek.encrypt(data);
    }
    const end = performance.now();
    const average = (end - start) / totalRuns;

    // under 1ms per opt is good enough
    assert.ok(average < 1);
  });
});
