
const levelFlag = `__level_flag__`
const contentFlag = `__content_flag__`
const listFlag = `__list_flag__`

const hasCNChar = /[\u4e00-\u9fa5]/
const hasNewLine = /\n/
const wordChar = /([\u4e00-\u9fa5])?(\w[\w ]+)([\u4e00-\u9fa5])?/g

module.exports = {
    levelFlag,
    contentFlag,
    listFlag,
    hasCNChar,
    hasNewLine,
    wordChar,
}
