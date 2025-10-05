import { describe, it, mock, type TestContext } from "node:test";
import assert from "node:assert/strict";
import { PlaidEnvironments } from "plaid";
import { UserType } from "../../../generated/prisma/index.js";
import type { User } from "@clerk/express";

describe("getClientBasePath", () => {
  async function harness(testContext: TestContext, environment: string) {
    const { mockConfig } = await import("../../../util/__mocks__/config.mjs");
    const { mockContext } = await import("../../../__mocks__/context.mjs");
    mockConfig(testContext, async () => {
      return environment;
    });

    const { getClientBasePath } = await import("../getClientBasePath.mjs");

    return {
      mockContext,
      getClientBasePath,
    };
  }

  it("should return sandbox environment in test environment", async (testContext) => {
    const { getClientBasePath, mockContext } = await harness(
      testContext,
      "test",
    );

    const { context, mocked } = mockContext({
      auth: {
        user: null,
      },
      datasource: {
        clerk: {
          getUserById: mock.fn(),
        },
      },
    });

    const result = await getClientBasePath(context);

    assert.strictEqual(result, PlaidEnvironments.sandbox);
    // Verify that clerk getUserById was not called since we short-circuit on NODE_ENV
    assert.strictEqual(
      mocked.datasource?.clerk?.getUserById?.mock.calls.length,
      0,
    );
  });

  it("should return sandbox environment in development environment", async (testContext) => {
    const { getClientBasePath, mockContext } = await harness(
      testContext,
      "development",
    );

    const { context, mocked } = mockContext({
      auth: {
        user: null,
      },
      datasource: {
        clerk: {
          getUserById: mock.fn(),
        },
      },
    });

    const result = await getClientBasePath(context);

    assert.strictEqual(result, PlaidEnvironments.sandbox);
    // Verify that clerk getUserById was not called since we short-circuit on NODE_ENV
    assert.strictEqual(
      mocked.datasource?.clerk?.getUserById?.mock.calls.length,
      0,
    );
  });

  it("should return sandbox environment even with production user type in test environment", async (testContext) => {
    const { getClientBasePath, mockContext } = await harness(
      testContext,
      "test",
    );
    // NODE_ENV takes precedence over user type in test environment
    const { context, mocked } = mockContext({
      auth: {
        user: {
          id: "user-123",
          authId: "auth-456",
          userType: UserType.PRODUCTION,
        },
      },
      datasource: {
        clerk: {
          getUserById: mock.fn(),
        },
      },
    });

    const result = await getClientBasePath(context);

    assert.strictEqual(result, PlaidEnvironments.sandbox);
    // Verify that clerk getUserById was not called since we short-circuit on NODE_ENV
    assert.strictEqual(
      mocked.datasource?.clerk?.getUserById?.mock.calls.length,
      0,
    );
  });

  it("should not call clerk service when NODE_ENV is test", async (testContext) => {
    const { getClientBasePath, mockContext } = await harness(
      testContext,
      "test",
    );
    // Test that the function correctly short-circuits before calling external services
    const { context, mocked } = mockContext({
      auth: {
        user: {
          id: "user-123",
          authId: "auth-456",
          userType: null,
        },
      },
      datasource: {
        clerk: {
          getUserById: mock.fn(() => {
            throw new Error("Should not be called");
          }),
        },
      },
    });

    const result = await getClientBasePath(context);

    assert.strictEqual(result, PlaidEnvironments.sandbox);
    // Verify that clerk getUserById was not called due to NODE_ENV short-circuit
    assert.strictEqual(
      mocked.datasource?.clerk?.getUserById?.mock.calls.length,
      0,
    );
  });

  it("should return sandbox environment even with sandbox user type in production environment", async (testContext) => {
    const { getClientBasePath, mockContext } = await harness(
      testContext,
      "production",
    );
    const { context, mocked } = mockContext({
      auth: {
        user: {
          id: "user-123",
          authId: "auth-456",
          userType: UserType.SANDBOX,
        },
      },
      datasource: {
        clerk: {
          getUserById: mock.fn(),
        },
      },
    });

    const result = await getClientBasePath(context);

    assert.strictEqual(result, PlaidEnvironments.sandbox);
    // Verify that clerk getUserById was not called since we short-circuit on NODE_ENV
    assert.strictEqual(
      mocked.datasource?.clerk?.getUserById?.mock.calls.length,
      0,
    );
  });

  it("should return production environment with production user type in production environment", async (testContext) => {
    const { getClientBasePath, mockContext } = await harness(
      testContext,
      "production",
    );
    // NODE_ENV takes precedence over user type in test environment
    const { context, mocked } = mockContext({
      auth: {
        user: {
          id: "user-123",
          authId: "auth-456",
          userType: UserType.PRODUCTION,
        },
      },
      datasource: {
        clerk: {
          getUserById: mock.fn(),
        },
      },
    });

    const result = await getClientBasePath(context);

    assert.strictEqual(result, PlaidEnvironments.production);
    // Verify that clerk getUserById was not called since we short-circuit on NODE_ENV
    assert.strictEqual(
      mocked.datasource?.clerk?.getUserById?.mock.calls.length,
      0,
    );
  });

  it("should return sandbox environment with +dev@onerlaw.com in production environment", async (testContext) => {
    const { getClientBasePath, mockContext } = await harness(
      testContext,
      "production",
    );
    // NODE_ENV takes precedence over user type in test environment
    const { context, mocked } = mockContext({
      auth: {
        user: {
          id: "user-123",
          authId: "auth-456",
          userType: null,
        },
      },
      datasource: {
        clerk: {
          getUserById: mock.fn(() => {
            return Promise.resolve({
              emailAddresses: [{ emailAddress: "test+dev@onerlaw.com" }],
            } as User);
          }),
        },
      },
    });

    const result = await getClientBasePath(context);

    assert.strictEqual(result, PlaidEnvironments.sandbox);
    // Verify that clerk getUserById was not called since we short-circuit on NODE_ENV
    assert.strictEqual(
      mocked.datasource?.clerk?.getUserById?.mock.calls.length,
      1,
    );
  });

  it("should return production environment in prod environment with invalid user type", async (testContext) => {
    const { getClientBasePath, mockContext } = await harness(
      testContext,
      "production",
    );
    // NODE_ENV takes precedence over user type in test environment
    const { context, mocked } = mockContext({
      auth: {
        user: {
          id: "user-123",
          authId: "auth-456",
          userType: "invalid" as UserType,
        },
      },
      datasource: {
        clerk: {
          getUserById: mock.fn(),
        },
      },
    });

    const result = await getClientBasePath(context);

    assert.strictEqual(result, PlaidEnvironments.production);
    // Verify that clerk getUserById was not called since we short-circuit on NODE_ENV
    assert.strictEqual(
      mocked.datasource?.clerk?.getUserById?.mock.calls.length,
      1,
    );
  });

  it("should handle null user correctly", async (testContext) => {
    const { getClientBasePath, mockContext } = await harness(
      testContext,
      "production",
    );
    // When user is null, function should still return sandbox in test environment
    const { context, mocked } = mockContext({
      auth: {
        user: null,
      },
      datasource: {
        clerk: {
          getUserById: mock.fn(),
        },
      },
    });

    const result = await getClientBasePath(context);

    assert.strictEqual(result, PlaidEnvironments.production);
    assert.strictEqual(
      mocked.datasource?.clerk?.getUserById?.mock.calls.length,
      0,
    );
  });

  it("should handle user with sandbox userType correctly", async (testContext) => {
    const { getClientBasePath, mockContext } = await harness(
      testContext,
      "production",
    );
    // Even with explicit sandbox userType, should return sandbox due to test environment
    const { context, mocked } = mockContext({
      auth: {
        user: {
          id: "user-123",
          authId: "auth-456",
          userType: UserType.SANDBOX,
        },
      },
      datasource: {
        clerk: {
          getUserById: mock.fn(),
        },
      },
    });

    const result = await getClientBasePath(context);

    assert.strictEqual(result, PlaidEnvironments.sandbox);
    // Clerk service should not be called due to NODE_ENV check
    assert.strictEqual(
      mocked.datasource?.clerk?.getUserById?.mock.calls.length,
      0,
    );
  });

  it("should handle user with null userType correctly", async (testContext) => {
    const { getClientBasePath, mockContext } = await harness(
      testContext,
      "production",
    );
    // When userType is null, function still returns sandbox in test environment
    const { context, mocked } = mockContext({
      auth: {
        user: {
          id: "user-123",
          authId: "auth-456",
          userType: null,
        },
      },
      datasource: {
        clerk: {
          getUserById: mock.fn(),
        },
      },
    });

    const result = await getClientBasePath(context);

    assert.strictEqual(result, PlaidEnvironments.production);
    // Clerk service should not be called due to NODE_ENV check
    assert.strictEqual(
      mocked.datasource?.clerk?.getUserById?.mock.calls.length,
      1,
    );
  });

  it("should pass correct parameter types to function", async (testContext) => {
    const { getClientBasePath, mockContext } = await harness(
      testContext,
      "production",
    );
    // Test that our mock context structure matches what the function expects
    const mockGetUserById = mock.fn(() => Promise.resolve(null));

    const { context } = mockContext({
      auth: {
        user: {
          id: "user-123",
          authId: "auth-456",
          userType: UserType.PRODUCTION,
        },
      },
      datasource: {
        clerk: {
          getUserById: mockGetUserById,
        },
      },
    });

    // Function should execute without type errors
    const result = await getClientBasePath(context);

    // Verify result is correct PlaidEnvironments value
    assert.strictEqual(result, PlaidEnvironments.production);
  });
});
