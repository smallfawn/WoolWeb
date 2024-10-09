module.exports = {
    getUUID,
    getSdkTicket,
    getAccessToken
}
const { httpRequest } = require('../utils/httpRequest')
const fs = require('fs').promises
async function getUUID() {
    let config = await readFile("data_gac.json")
    let appid = config.gacmotor.appId
    let sdkticket = config.gacmotor.sdkTicket
    const { randomString } = require('../utils/utils')
    const { Crypto_SHA1 } = require("../utils/crypto")
    let noncestr = randomString()
    let timestamp = Date.now();
    const signaturePrams = `appid=${appid}&noncestr=${noncestr}&sdk_ticket=${sdkticket}&timestamp=${timestamp}`;
    const signature = Crypto_SHA1(signaturePrams)
    let options = {
        url: `https://open.weixin.qq.com/connect/sdk/qrconnect?appid=wx55d651b24ca783fa&noncestr=${noncestr}&timestamp=${timestamp}&scope=snsapi_userinfo&signature=${signature}`
    }
    let { data: uuidResult } = await httpRequest(options)
    if (uuidResult.errcode == 0) {
        return uuidResult.uuid
    } else {
        return false
    }
}
async function getSdkTicket() {
    let config = await readFile("data_gac.json")
    let accessToken = config.gacmotor.accessToken
    let options = {
        url: `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=2`
    }
    let { data: skdTicketresult } = await httpRequest(options)
    if (skdTicketresult.errcode == 42001) {
        return false
    } else if (skdTicketresult.errcode == 0) {
        await updateAppId("gacmotor", "sdkTicket", skdTicketresult.ticket)
        return skdTicketresult.ticket
    }
}
async function getAccessToken() {
    let config = await readFile("data_gac.json")
    let appid = config.gacmotor.appId
    let appsecret = config.gacmotor.appSecert
    //accessToken过期
    let { data: accessTokenResult } = await httpRequest({ url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}` })
    let accessToken = accessTokenResult.access_token
    await updateAppId("gacmotor", "accessToken", accessToken)
}

// 读取文件内容
async function readFile(fileName) {
    try {
        const data = await fs.readFile(fileName, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        throw err;
    }
};

// 写入文件内容
async function writeFile(fileName, content) {
    try {
        await fs.writeFile(fileName, JSON.stringify(content, null, 4), 'utf8');
    } catch (err) {
        throw err;
    }
};

// 异步读取并修改gacmotor中的appId
async function updateAppId(app, name, value) {
    try {
        const data = await readFile('data_gac.json');
        const appname = data[app];
        // 修改appId
        appname[name] = value;
        // 写入文件
        await writeFile('data_gac.json', data);
        //console.log('appId has been updated successfully');
    } catch (err) {
        console.error(err);
    }
};