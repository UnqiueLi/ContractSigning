import CryptoJS from 'crypto-js';

const KEY ="B2C4BA0275C582C0";

export function aesDecryptECB(hexCipherText) {
    const encrypted = CryptoJS.enc.Hex.parse(hexCipherText);

    const keyWA = CryptoJS.enc.Utf8.parse(KEY);

    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: encrypted},
        keyWA,
        {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
}

