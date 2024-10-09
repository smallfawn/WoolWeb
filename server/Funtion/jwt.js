const JWT = require('jsonwebtoken');//cookie
/**
 * 生成token
 * @param {Object} payload 需要签名的信息 必须是json格式
 * @returns 
 */
function setToken(payload, key) {
    return JWT.sign(payload, key, {
    });
}


/**
 * 检查token是否正确
 * @param {*} token 
 * @returns 加密信息
 */
function checkToken(token, key) {
    return new Promise((resolve, reject) => {
        JWT.verify(token, key, (err, decoded) => {
            if (err) {
                //reject(false);
                resolve(false)
            } else {
                resolve(decoded);
            }
        });
    });
}

module.exports = {
    setToken,
    checkToken
}