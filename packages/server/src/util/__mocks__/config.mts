import { mock, type TestContext } from "node:test";
import type { Config } from "../config.mjs";

type Callback<Key extends keyof Config> = (key: Key) => Promise<Config[Key]>;

export function mockConfig<Key extends keyof Config>(
  ctx: TestContext,
  callback: Callback<Key>,
) {
  ctx.mock.module("../config.mjs", {
    namedExports: {
      getConfig: mock.fn(async (key: Key) => {
        return callback(key);
      }),
    },
  });
}
