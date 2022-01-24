
const fs = require('fs')

const {
  levelFlag,
  contentFlag,
  listFlag,
  hasNewLine,
} = require('../util')
const {formatNode, formatContent} = require('../util/format')


let output = ''
let textContent = ''
let singleLineCount = 0

function transform(source) {
  if (typeof source !== 'string' && source.indexOf('\n\t') === -1){
    throw new Error('format error')
  }

  output = ''
  textContent = ''
  singleLineCount = 0
  source = genTitle(source,0)
  parseTitleContent(source,1)
  return output
}

// \n\t{level}[^\t]
function createLevelReg(level=1, isGlobal = false){
  return new RegExp('\\n'+'\\t'.repeat(level)+'([^\\t])', isGlobal?'g':'')
}

function genTitle(text, level){
  const match = new RegExp(`([\\s\\S]*?)(?:\\n\\t{${level+1}})|([\\s\\S]*?)$`).exec(text)
  if (match){
    const title = match[1] || match[2] || ''
    output += title.length ? '\n'+'#'.repeat(level+1)+' '+title+'\n\n': ''
    return text.slice(title.length)
  }
  return text
}

function genNode(text, level, addFlag = false){
  const match = new RegExp(`([\\s\\S]*?)(?:\\n\\t{${level+1}})|([\\s\\S]*?)$`).exec(text)
  if (match){
    const node = match[1] || match[2] || ''
    if (addFlag){
      if (!hasNewLine.test(node)){
        singleLineCount++
        textContent += contentFlag + listFlag + node + listFlag + '\n\n'
      }else {
        textContent += contentFlag + formatNode(node) + '\n\n'
      }
    }else {
      textContent += formatNode(node) + '\n\n'
    }
    return text.slice(node.length)
  }
  return text
}

function genContent(){
  if (textContent.length){
    console.log('textContent',JSON.stringify(textContent))
    output += formatContent(textContent, singleLineCount >= 2)
  }
  textContent = ''
  singleLineCount = 0
}

function parseTitleContent(source, level = 1) {

  const levelReg = createLevelReg(level,true)
  const nextLevelReg = createLevelReg(level+1)

  const list = source.replace(levelReg, ($0,$1) => levelFlag+$1).split(levelFlag)

  for (let i=0;i<list.length;i++) {
    let item = list[i]

    if (!item.trim().length) {
      continue
    }
    console.log('item',JSON.stringify(item))

    if (level === 1) {
      //maybe content or title
      if (nextLevelReg.test(item) || !hasNewLine.test(item)){// title
        genContent()
        item = genTitle(item,level)
      }else {// content
        item = genNode(item,level, true)
      }
    }else {
      // level >= 2 as content
      item = genNode(item,level, level === 2)
    }

    if (nextLevelReg.test(item)){
      parseTitleContent(item, level + 1)
    }

    if (level <= 2 && i === list.length - 1){
      genContent()
    }
  }
}



module.exports = transform
