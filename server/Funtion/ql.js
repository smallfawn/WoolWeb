const axios = require("axios");
module.exports = {
    getToken,
    getdata,
    setdata,
    update,
}

/**
 * 获取青龙临时token
 * @returns Authorization
 */
async function getToken(options) {
    try {
        let { data: result } = await axios.get(`${options.url}/open/auth/token`, {
            params: {
                client_id: options.id,
                client_secret: options.secret
            }
        })
        if ('code' in result) {
            if (result.code == 200) {
                return result.data.token_type + ' ' + result.data.token
            }
        }
    } catch (error) {
        console.log(`getTOKEN失败`);

    }
}

/**
 * 上传/更新变量
 * @param {string} VariableName 变量名 
 * @param {string} Variable 变量
 * @returns 自定义响应体
 */
async function update(url, token, VariableName, Variable, envStrSplitor = "@") {
    try {
        let originalRes = await getdata(url, token, VariableName)
        //console.log(`原数组输出  ` + JSON.stringify(originalRes));
        let originalVariable
        if (originalRes.data.length == 0) {
            //console.log(`没有变量开始创建`);
            let createVariableRes = await setdata(url, token, VariableName, Variable)
            if (createVariableRes.code == 200) {
                //console.log(`创建变量成功`);
                return { status: true, message: "创建变量成功", data: Variable }
            } else {
                //console.log(`创建变量失败`);
                //console.log(createVariableRes);
                return { status: false, message: "创建变量失败", data: Variable }
            }
        } else {
            originalVariable = originalRes.data[0].value
            console.log(originalVariable);
            //
            originalVariable += `${envStrSplitor}${Variable}`
            //
            let originalId = originalRes.data[0].id
            let options = {
                method: "PUT",
                url: `${url}/open/envs`,
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": token
                },
                data: { value: originalVariable, name: VariableName, remarks: null, id: originalId }
            }
            let { data: res } = await axios.request(options)
            if ('code' in res) {
                if (res.code == 200) {
                    return { status: true, message: "添加变量成功", data: Variable }
                } else {
                    console.log(res);
                    return { status: false, message: "添加变量失败", data: Variable }
                }
            } else {
                console.log(res);
                return { status: false, message: "添加变量失败", data: Variable }
            }
        }
    } catch (error) {
        console.log(error)
        console.log(`update失败`);
        return { status: false, message: "青龙连通失效", data: Variable }
    }
}
/**
 * 创建新变量
 * @param {string} VariableName 变量名
 * @param {string} Variable 变量
 * @returns 
 */
async function setdata(url, token, VariableName, Variable, remarks = null) {
    let options = {
        method: "POST",
        url: `${url}/open/envs`,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": token
        },
        data: [{ value: Variable, name: VariableName, remarks: remarks }]
    }
    let { data: result } = await axios.request(options)
    return result
}

/**
 * 获取原变量
 * @param {string} VariableName 变量名
 * @returns 响应体
 */
async function getdata(url, token, VariableName) {
    let options = {
        method: "GET",
        url: `${url}/open/envs?searchValue=${VariableName}`,
        headers: {
            "Authorization": token
        }
    }
    let { data: res } = await axios.request(options)
    if ('code' in res) {
        if (res.code == 200) {
            return res
        }
    }
}