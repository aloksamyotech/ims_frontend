import CryptoJS from 'crypto-js';

const secretKey = 'my-secret-key-123';


export const encrypt = (plainText) => {
    const encrypted = CryptoJS.AES.encrypt(plainText, secretKey).toString();
    return encrypted
}

export const decrypt = (encrypted) => {
    const decryptedBytes = CryptoJS.AES.decrypt(encrypted, secretKey);
    let decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    decryptedText = JSON.parse(decryptedText)
    return decryptedText
}
