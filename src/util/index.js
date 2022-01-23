
const levelFlag = `__level_flag__`
const contentFlag = `__content_flag__`

const hasCNChar = /[\u4e00-\u9fa5]/
const hasNewLine = /\n/
const wordChar = /([\u4e00-\u9fa5])?(\w[\w ]+)([\u4e00-\u9fa5])?/g

module.exports = {
    levelFlag,
    contentFlag,
    hasCNChar,
    hasNewLine,
    wordChar,
}
