
const fs = require('fs').promises
async function getValue() {
    try {
        const data = await fs.readFile("value.json", 'utf-8');
        const json = JSON.parse(data);
        const applist = json.applist;
        return applist;
    } catch (error) {
        return false
    }
}
async function updateValue(json) {
    try {
        const data = await fs.readFile("value.json", 'utf-8');
        const existingData = JSON.parse(data);
        const { applist } = existingData;
        // 查找是否有相同 name 的 JSON 对象
        const existingIndex = applist.findIndex(obj => obj.name === json.name);
        if (existingIndex !== -1) {
            // 如果存在相同 name 的 JSON 对象则更新内容
            applist[existingIndex] = json;
            //console.log('JSON object updated in applist successfully!');
            await fs.writeFile("value.json", JSON.stringify(existingData, null, 2));
            return true
        } else {
            // 如果不存在则将 JSON 对象添加到 applist 数组中
            applist.push(json);
            //console.log('JSON object added to applist successfully!');
            await fs.writeFile("value.json", JSON.stringify(existingData, null, 2));
            return true
        }
    } catch (error) {
        return false
    }
}
module.exports = {
    getValue,
    updateValue
}


