import axios from 'axios'
import { getTimeStamp, getRandomString } from './Utils'
let ab = []
for (let i = 97; i <= 122; i++) {
    ab.push(String.fromCharCode(i));
}
function httpRequest(options) {
    let t = getTimeStamp()
    let n = getRandomString(10)
    options.headers["t"] = t
    options.headers["n"] = n
    options.headers["s"] = window[ab[6] + ab[4] + ab[19] + ab[18].toUpperCase() + ab[8] + ab[6] + ab[13]](options)
    return new Promise((resolve, reject) => {
        axios(options).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export default httpRequest 