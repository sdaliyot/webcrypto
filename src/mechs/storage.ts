import * as core from "webcrypto-core";
import { CryptoKey as InternalCryptoKey } from "../keys";

const keyStorage = new WeakMap<core.CryptoKey, InternalCryptoKey>();

export function getCryptoKey(key: core.CryptoKey) {
  let res = keyStorage.get(key);
  // The key may not be found in the imported keys (after process restart) so we reconstruct (and import) it from the 
  // source __value we stored on the (persisted) key
  if (!res && (key as any).__value) {
    keyStorage.set(key, (key as any).__value);
    res = keyStorage.get(key);
  }
  // In some cases the algorithm is missing from the value but exists on the key so we take it from there
  if (res && !res.algorithm && key.algorithm) {
    res.algorithm = key.algorithm;
  }
  if (!res) {
    throw new core.OperationError("Cannot get CryptoKey from secure storage");
  }
  return res;
}

export function setCryptoKey(value: InternalCryptoKey) {
  const key = core.CryptoKey.create(value.algorithm, value.type, value.extractable, value.usages);
  // Store the source value on the key (which is persisted) so we can reconstruct the original imported key after process restart.
  (key as any).__value = value;
  Object.freeze(key);
  keyStorage.set(key, value);
  return key;
}
