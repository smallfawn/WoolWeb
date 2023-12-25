import axios from 'axios'
import { getTimeStamp, getRandomString } from './Utils'
let alphabet = []
for (let i = 97; i <= 122; i++) {
    alphabet.push(String.fromCharCode(i));
}
function httpRequest(options) {
    let t = getTimeStamp()
    let n = getRandomString(10)
    options.headers["t"] = t
    options.headers["n"] = n
    options.headers["s"] = window[alphabet[6] + alphabet[4] + alphabet[19] + alphabet[18].toUpperCase() + alphabet[8] + alphabet[6] + alphabet[13]](options)
    return new Promise((resolve, reject) => {
        axios(options).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export default httpRequest 