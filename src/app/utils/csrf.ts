import { randomBytes, createHmac, timingSafeEqual } from "crypto";
import { Buffer } from "buffer";

export function createCSRFSeed(): string {
  return randomBytes(32).toString("base64");;
}

export function createCSRFToken (
  identifier: string,
  seed: string
) {
  const { HASH_SALT, PRIVATE_KEY } = process.env;
  if (!HASH_SALT || !PRIVATE_KEY) {
    throw new Error("Missing HASH_SALT or PRIVATE_KEY in .env file.");
  }

  const secret = `${HASH_SALT}${PRIVATE_KEY}${seed}`;
  const hmac = createHmac("sha256", secret);
  const data = hmac.update(identifier);
  return data.digest("hex");
}

export function validateCSRFToken (
  actual: string,
  identifier: string,
  seed: string
) {
  const expected = createCSRFToken(identifier, seed);
  // console.log("expected", expected);
  // console.log("actual", actual);
  if (!timingSafeEqual(Buffer.from(expected), Buffer.from(actual))) {
    throw new Error("CSRF tokens do not match.");
  }
}
