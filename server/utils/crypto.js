const Crypto = require('crypto');//加解密
const CryptoJS = require('crypto-js');

module.exports = {
    EncryptAES,
    Crypto_MD5,
    Crypto_BASE64_en,
    Crypto_BASE64_de,
    Crypto_HMACSHA256,
    Crypto_SHA256,
    Crypto_SHA1,
    JSEncrypt
}
function Crypto_MD5(text) {
    const hash = Crypto.createHash('md5');
    hash.update(text);
    return hash.digest('hex');
}

function Crypto_BASE64_en(text) {
    const buffer = Buffer.from(text, 'utf8');
    return buffer.toString('base64');
}

function Crypto_BASE64_de(text) {
    const buffer = Buffer.from(text, 'base64');
    buffer.toString('utf8');
}
function Crypto_SHA256(str) {
    const crypto = require("crypto");
    return crypto.createHash("sha256").update(str).digest("hex");

}
function Crypto_HMACSHA256(key, data) {
    const hmac = Crypto.createHmac('sha256', key);
    hmac.update(data);
    return hmac.digest('hex');
}
function EncryptAES(data, key) {
    const dataWordArray = CryptoJS.enc.Utf8.parse(data);
    const keyWordArray = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.AES.encrypt(dataWordArray, keyWordArray, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();

}

function Crypto_SHA1(str) {
    const crypto = require('crypto');
    return crypto.createHash("sha1").update(str).digest('hex')
}
function JSEncrypt(publicKey, plainText) {
    window = {}
    const JSEncrypt = require("jsencrypt")
    const crypt = new JSEncrypt()
    crypt.setPublicKey(publicKey)
    return crypt.encrypt(plainText)
}