import { decrypt } from "./crypto";

export async function decryptWithAESKey({ encryptedData, iv, authTag, aesKey }) {
  const keyx = decrypt(aesKey); 
  const keyBuffer = new Uint8Array(keyx.data);

  if (keyBuffer.byteLength !== 32) {
    throw new Error('AES key must be 32 bytes');
  }

  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const encryptedDataBuffer = base64ToArrayBuffer(encryptedData);
  const authTagBuffer = base64ToArrayBuffer(authTag);

  const combinedData = new Uint8Array([
    ...new Uint8Array(encryptedDataBuffer),
    ...new Uint8Array(authTagBuffer),
  ]);

  try {
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: base64ToArrayBuffer(iv),
        tagLength: 128,
      },
      cryptoKey,
      combinedData
    );

    return new TextDecoder().decode(decrypted);
  } catch (err) {
    console.error("Decryption failed:", err);
    throw new Error("Decryption failed: " + err.message);
  }
}

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const length = binaryString.length;
  const arrayBuffer = new ArrayBuffer(length);
  const uintArray = new Uint8Array(arrayBuffer);
  for (let i = 0; i < length; i++) {
    uintArray[i] = binaryString.charCodeAt(i);
  }
  return arrayBuffer;
}
