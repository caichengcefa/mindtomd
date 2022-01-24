
const {
    levelFlag,
    contentFlag,
    listFlag,
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
        res = res
          //改为全角，
          .replace(',','，')
          //单换行+, 改为，
        .replace(/，\n，|\n，|，\n/,'，')
          //单换行，前后文，链接
        .replace(/[^\n]\n[^\n]/g,($0) => $0.replace('\n','，'))
        //单词高亮
        .replace(wordChar, ($0,$1,$2,$3) => {
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

function formatContent(text, useList = true) {
    let res = text
    if (res.length){
        res = res.split(contentFlag).filter(item => item.trim().length)

        if (useList){
            let num = 0
            const listFlagReg = new RegExp(`${listFlag}([\\s\\S]*?)${listFlag}`)
            res = res.map((item) => {
                if (item.indexOf(listFlag) !== -1){
                    return item.replace(listFlagReg,($0,$1) => `${++num}、 `+$1)
                }
                return item
            }).join('')
        }else {
            res = res.map((item) => {
                if (item.indexOf(listFlag) !== -1){
                    return item.replace(listFlag,'**')
                }
                return item
            }).join('')
        }
    }
    return res
}


module.exports = {
    formatNode,
    formatContent
}
