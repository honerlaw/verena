import { afterEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import type { Logger } from "@onerlaw/framework/backend/logger";
import type { DBClient } from "../../../util/database.mjs";

describe("Database Conversation Create", () => {
  afterEach(() => {
    mock.restoreAll();
  });

  async function harness() {
    // Mock the create function module to get fresh imports
    const { create } = await import("../create.mjs");

    const mockConversation = {
      id: "conv-123",
      userId: "user-123",
      openaiConversationId: "openai-456",
      createdAt: new Date(),
      updatedAt: new Date(),
      title: null,
    };

    const errorMockFn = mock.fn();
    const createMockFn = mock.fn(({ data }) => {
      return Promise.resolve({
        ...mockConversation,
        ...data,
      });
    });

    const mockLogger = {
      error: errorMockFn,
      info: mock.fn(),
      warn: mock.fn(),
      debug: mock.fn(),
      trace: mock.fn(),
      child: mock.fn(() => mockLogger),
    } as unknown as Logger;

    const mockClient = {
      conversation: {
        create: createMockFn,
      },
    } as unknown as DBClient;

    return {
      create,
      mockLogger,
      mockClient,
      mockConversation,
      createMockFn,
      errorMockFn,
    };
  }

  it("should successfully create a conversation", async () => {
    const { create, mockLogger, mockClient, createMockFn, errorMockFn } =
      await harness();

    const userId = "user-123";
    const openaiConversationId = "openai-456";

    const result = await create(
      mockLogger,
      mockClient,
      userId,
      openaiConversationId,
    );

    // Verify the result
    assert.ok(result);
    assert.strictEqual(result.userId, userId);
    assert.strictEqual(result.openaiConversationId, openaiConversationId);

    // Verify database client was called with correct parameters
    assert.strictEqual(createMockFn.mock.calls.length, 1);
    assert.deepStrictEqual(createMockFn.mock.calls[0]?.arguments[0], {
      data: {
        userId,
        openaiConversationId,
      },
    });

    // Verify logger was not called (no errors)
    assert.strictEqual(errorMockFn.mock.calls.length, 0);
  });

  it("should handle database errors and return null", async () => {
    const { create, mockLogger, mockClient, createMockFn, errorMockFn } =
      await harness();

    const userId = "user-123";
    const openaiConversationId = "openai-456";
    const testError = new Error("Database connection failed");

    // Mock the create method to throw an error
    createMockFn.mock.mockImplementation(() => {
      throw testError;
    });

    const result = await create(
      mockLogger,
      mockClient,
      userId,
      openaiConversationId,
    );

    // Verify the result is null
    assert.strictEqual(result, null);

    // Verify database client was called
    assert.strictEqual(createMockFn.mock.calls.length, 1);

    // Verify logger was called with correct error information
    assert.strictEqual(errorMockFn.mock.calls.length, 1);
    const errorCall = errorMockFn.mock.calls[0];
    assert.ok(errorCall);
    assert.deepStrictEqual(errorCall.arguments[0], {
      error: testError,
      tags: ["database", "conversation", "create"],
    });
    assert.strictEqual(errorCall.arguments[1], "Error creating conversation");
  });

  it("should handle async database errors and return null", async () => {
    const { create, mockLogger, mockClient, createMockFn, errorMockFn } =
      await harness();

    const userId = "user-456";
    const openaiConversationId = "openai-789";
    const testError = new Error("Async database error");

    // Mock the create method to reject with an error
    createMockFn.mock.mockImplementation(() => {
      return Promise.reject(testError);
    });

    const result = await create(
      mockLogger,
      mockClient,
      userId,
      openaiConversationId,
    );

    // Verify the result is null
    assert.strictEqual(result, null);

    // Verify database client was called with correct parameters
    assert.strictEqual(createMockFn.mock.calls.length, 1);
    const createCall = createMockFn.mock.calls[0];
    assert.ok(createCall);
    assert.deepStrictEqual(createCall.arguments[0], {
      data: {
        userId,
        openaiConversationId,
      },
    });

    // Verify logger was called with correct error information
    assert.strictEqual(errorMockFn.mock.calls.length, 1);
    const errorCall = errorMockFn.mock.calls[0];
    assert.ok(errorCall);
    assert.deepStrictEqual(errorCall.arguments[0], {
      error: testError,
      tags: ["database", "conversation", "create"],
    });
    assert.strictEqual(errorCall.arguments[1], "Error creating conversation");
  });

  it("should pass through all parameters correctly", async () => {
    const { create, mockLogger, mockClient, createMockFn } = await harness();

    const userId = "different-user-789";
    const openaiConversationId = "different-openai-abc";

    await create(mockLogger, mockClient, userId, openaiConversationId);

    // Verify all parameters were passed correctly
    assert.strictEqual(createMockFn.mock.calls.length, 1);
    const createCall = createMockFn.mock.calls[0];
    assert.ok(createCall);
    assert.deepStrictEqual(createCall.arguments[0], {
      data: {
        userId,
        openaiConversationId,
      },
    });
  });
});
