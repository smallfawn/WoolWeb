const fs = require('fs').promises;
async function setKey() {
    let KeyStr = creatKey()
    try {
        await fs.writeFile('jwt.key', KeyStr, 'utf8');
        //console.log('文件写入成功');
        return true
    } catch (err) {
        //console.error('写入文件时出错：', err);
        return false
    }
}
function creatKey() {
    const a = "qwertyuiop[]\\asdfghjkl;'zxcvbnm,./~!@#$%^&*()_+-=1234567890";
    let b = "";
    for (let i = 0; i < 32; i++) {
        const c = Math.floor(Math.random() * a.length);
        b += a.charAt(c);
    }
    function e(input) {
        const crypto = require('crypto');
        return crypto.createHash('md5').update(input).digest('hex');
    }
    return e(b) + e(new Date().getTime().toString())
}
async function getKey() {
    try {
        const data = await fs.readFile('jwt.key', 'utf8');
        return data
    } catch (err) {
        console.error('读取文件时出错：', err);
        return false
    }
}
module.exports = {
    setKey,
    creatKey,
    getKey
}