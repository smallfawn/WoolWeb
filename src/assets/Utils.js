export { testPhoneNumber, testEmail, getUUID, getRandomString, getTimeStamp }
/**
 * 匹配中国大陆的手机号码 格式是以13-19开头的11位数字
 * @param {*} phoneNumber 
 * @returns 
 */
function testPhoneNumber(phoneNumber) {
    var regExp = /^1[3-9][0-9]\d{8}$/;
    return regExp.test(phoneNumber);
}
/**
 * 校验邮箱格式
 * @param {*} email 
 * @returns 
 */
function testEmail(email) {
    var regExp = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    return regExp.test(email);
}
/**
 * 获取uuid 格式8-4-4-4-12
 * @returns 
 */
function getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
/**
 * 获取固定长度的随机字母小写+数字
 * @param {*} length 
 * @returns 
 */
function getRandomString(length) {
    var result = '';
    var characters = '0123456789abcdefghijklmnopqrstuvwxyz';
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
function getTimeStamp() {
    return new Date().getTime()
}