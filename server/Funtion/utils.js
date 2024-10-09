function checkParams(...params) {
    for (let param of params) {
        if (param === undefined || param === null || param === '') {
            return false;
        }
    }
    return true;
}
module.exports = { checkParams }