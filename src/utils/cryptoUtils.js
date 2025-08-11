// utils/cryptoUtils.js
import CryptoJS from "crypto-js";

export const encryptData = (payload, authKey) => {
  const key = CryptoJS.enc.Utf8.parse(authKey.padEnd(32, "0"));
  const iv = CryptoJS.enc.Utf8.parse(authKey.substring(0, 16));
  const keyValueString = `{${Object.entries(payload)
    .map(([key, value]) => `"${key}":"${value}"`)
    .join(",")}}`;

  const encrypted = CryptoJS.AES.encrypt(keyValueString, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
};

export const decryptData = (encryptedData, authKey) => {
  const key = CryptoJS.enc.Utf8.parse(authKey.padEnd(32, "0"));
  const iv = CryptoJS.enc.Utf8.parse(authKey.substring(0, 16));
  const bytes = CryptoJS.AES.decrypt(encryptedData, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  if (!decryptedText) throw new Error("Decryption failed");
  return JSON.parse(decryptedText);
};
