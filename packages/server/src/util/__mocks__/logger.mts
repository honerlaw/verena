import { mock } from "node:test";
import type { Logger } from "@onerlaw/framework/backend/logger";

export function mockLogger() {
  const errorMockFn = mock.fn();

  const mockLogger = {
    error: errorMockFn,
    info: mock.fn(),
    warn: mock.fn(),
    debug: mock.fn(),
    trace: mock.fn(),
    child: mock.fn(() => mockLogger),
  };

  return {
    logger: mockLogger as unknown as Logger,
    mock: mockLogger,
  };
}
