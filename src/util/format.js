
const {
    levelFlag,
    contentFlag,
    hasCNChar,
    hasNewLine,
    wordChar
} = require('./index')

const formatCodeBlock = (text) => {
    let res = text.trim()
    if (res.length){
        res = '\n```ts\n'+res+'\n```\n'
    }
    return res
}

const formatHighlight = (text) => {
    let res = text.trim()
    if (res.length){
        res = '`'+res+'`'
    }
    return res
}

const formatListItem = (text) => {
    let res = text.trim()
    if (res.length){
        res = '- '+res
    }
    return res
}


function formatNode(text) {
    let res = text.trim()
    if (hasCNChar.test(res)){//zh
        res = res.replace(wordChar, ($0,$1,$2,$3) => {
            let res = formatHighlight($2)
            if ($1){
                res = $1+' '+res
            }
            if ($3){
                res = res+' '+$3
            }
            return res
        })
    }else {//en
        if (res.length > 50 || hasNewLine.test(res)){//add code block
            res = formatCodeBlock(res)
        }else {
            res = formatHighlight(res)
        }
    }
    return res
}

function formatContent(text) {
    let res = text.trim()
    if (res.length){
        res = res.split(contentFlag).filter(item => item.trim().length)

        let count = 0
        const useList = res.some(item => {
            if (!hasNewLine.test(item)){
                count += 1
            }
            return count >= 2
        })

        if (useList){
            let num = 0
            res = res.map((item,index) => {
                if (!hasNewLine.test(item)){
                    return `${++num}、 `+item+'\n\n'
                }else {
                    return item+'\n'
                }
            }).join('')
        }else {
            res = res.map((item,index) => {
                if (!hasNewLine.test(item)){
                    return '**'+item+'**\n\n'
                }else {
                    return item+`\n`
                }
            }).join('')
        }
    }
    return res
}


module.exports = {
    formatNode,
    formatContent
}