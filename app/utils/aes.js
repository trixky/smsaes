import aesjs from "aes-js";

// https://www.npmjs.com/package/aes-js

function stringToKey(str) {
  const key = [];

  while (str.length < 16) str += str;

  str = str.slice(0, 16);

  for (let i = 0; i < str.length; i++) {
    key.push(str.charCodeAt(i) % 256);
  }

  return key;
}

export function encryptMessage(text, key) {
  const _key = stringToKey(key);

  var textBytes = aesjs.utils.utf8.toBytes(text);

  var aesCtr = new aesjs.ModeOfOperation.ctr(_key, new aesjs.Counter(5));
  var encryptedBytes = aesCtr.encrypt(textBytes);

  var encryptedHex = Buffer.from(encryptedBytes).toString("base64");

  return encryptedHex;
}

export function decryptMessage(encrypted_text, key) {
  const _key = stringToKey(key);

  var encryptedBytes = Buffer.from(encrypted_text, "base64");

  var aesCtr = new aesjs.ModeOfOperation.ctr(_key, new aesjs.Counter(5));
  var decryptedBytes = aesCtr.decrypt(encryptedBytes);

  var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

  return decryptedText;
}
