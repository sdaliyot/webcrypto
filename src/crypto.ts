import crypto from "crypto";
import * as core from "webcrypto-core";
import { SubtleCrypto } from "./subtle";

// Export all key types so we can persist them properly (with typeson)
export * from "./keys";
export * from "./mechs";

export class Crypto extends core.Crypto {

  public subtle = new SubtleCrypto();

  public getRandomValues<T extends ArrayBufferView>(array: T): T {
    const buffer = Buffer.from(array.buffer);
    crypto.randomFillSync(buffer);
    return array;
  }

}
