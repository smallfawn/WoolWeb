const fs = require('fs').promises;
//const path = require('path');
// 读取JSON数据
async function readParams() {
    try {
        const data = await fs.readFile('data.json', 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData;

    } catch (err) {
        //throw err;
        return false
    }
}
// 写入JSON数据
async function writeParams(data) {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        await fs.writeFile('data.json', jsonData, 'utf8');
        return true
    } catch (err) {
        //throw err;
        return false
    }
}
// 增加或更新数据
async function updateParams(key, value) {
    try {
        const data = await readParams();
        data[key] = value;
        await writeParams(data);
        return true
    } catch (err) {
        return false
    }
}
// 删除数据
async function deleteParams(key) {
    try {
        const data = await readParams();
        delete data[key];
        await writeParams(data);
        return true
    } catch (err) {
        //throw err;
        return false
    }
}
// 查询数据
async function getParams(key) {
    try {
        const data = await readParams();
        const value = data[key];
        return value;
    } catch (err) {
        //throw err;
        return false
    }
}

module.exports = {
    updateParams,
    getParams,
    deleteParams
}
