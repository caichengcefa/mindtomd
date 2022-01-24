
const levelFlag = `__level_flag__`
const contentFlag = `__content_flag__`
const listFlag = `__list_flag__`

const hasCNChar = /[\u4e00-\u9fa5]/
const hasNewLine = /\n/
const wordReg = /([\u4e00-\u9fa5])?([-A-Za-z0-9+&@#/%?=~_|!:,.;* ]+)([\u4e00-\u9fa5])?/g
const urlReg = /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/

module.exports = {
    levelFlag,
    contentFlag,
    listFlag,
    hasCNChar,
    hasNewLine,
    wordReg,
    urlReg
}
