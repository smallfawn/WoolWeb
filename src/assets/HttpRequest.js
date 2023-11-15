import axios from 'axios'

function httpRequest(options) {
    return new Promise((resolve, reject) => {
        axios(options).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
export default  httpRequest 