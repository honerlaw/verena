import type { Logger } from "@onerlaw/framework/backend/logger";
import type { PlaidApi } from "plaid";
import jsonwebtoken, { type JwtPayload } from "jsonwebtoken/index.js";
const { decode, verify } = jsonwebtoken;
import { createHash, createPublicKey, type JsonWebKey } from "crypto";

export const validate = async function (
  logger: Logger,
  plaidApi: PlaidApi,
  token: string | string[] | undefined,
  body: unknown,
): Promise<boolean> {
  try {
    if (!token || Array.isArray(token)) {
      logger.trace("No token provided");
      return false;
    }
    const decodeRes = decode(token, {
      complete: true,
    });
    if (!decodeRes || typeof decodeRes === "string") {
      logger.trace("Decode failed for token");
      return false;
    }
    const header = decodeRes.header;
    if (header.alg !== "ES256" || !header.kid) {
      logger.trace("header is not expected alg or has no kid");
      return false;
    }

    const result = await plaidApi.webhookVerificationKeyGet({
      key_id: header.kid,
    });
    if (!result.data) {
      return false;
    }

    const resKey = result.data.key as unknown as JsonWebKey;
    const publicKey = createPublicKey({ key: resKey, format: "jwk" });
    const verifyRes = verify(token, publicKey, {
      algorithms: ["ES256"],
      complete: true,
    });

    const expectedHash = (verifyRes.payload as JwtPayload).request_body_sha256;
    const bodyHash = createHash("sha256")
      .update(JSON.stringify(body, null, 2))
      .digest("hex");

    return expectedHash === bodyHash;
  } catch (err) {
    logger.error(
      {
        error: err,
      },
      "Failed to validate webhook verification token",
    );
    return false;
  }
};
