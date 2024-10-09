const axios = require('axios');

function httpRequest(options) {
    return new Promise((resolve, reject) => {
        axios(options).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
module.exports = { httpRequest }