
# mindtomark


## main.js


```ts
const fs = require('fs')
const path = require('path')
const transform = require('./core')

let input = fs.readFileSync(path.resolve(__dirname, './input.md'), 'utf-8');
console.log('input',JSON.stringify(input))

const output = transform(input)
console.log('outputData',JSON.stringify(output))

fs.writeFileSync(path.resolve(__dirname, './output.md'), output);
```


读取 `input` 数据

转换后输出


## core.js

1、 transform


```ts
function transform(source) {
  if (typeof source !== 'string' && source.indexOf('\n\t') === -1){
    throw new Error('format error')
  }

  output = ''
  textContent = ''
  source = genTitle(source,0)
  parseTitleContent(source,1)
  return output
}
```


`level 0` 代表一级标题，多个一级标题无规律可循，，因此只能解析一个一级标题

2、 parseTitleContent

参数

`source`

去掉一级标题后的内容

`level`

当前节点的 `level`，从 `1` 开始


```ts
const levelReg = createLevelReg(level,true)
  const nextLevelReg = createLevelReg(level+1)

  const list = source.replace(levelReg, ($0,$1) => levelFlag+$1).split(levelFlag)
```


分割单前 `level`，保留，标题内容及子级节点


```ts
for (let i=0;i<list.length;i++){
    let item = list[i]
```


`item` 为标题内容及子级节点


```ts
if (!item.trim().length){
      continue
    }
```


过滤空内容


```ts
if (level === 1) {
      //maybe content or title
      if (nextLevelReg.test(item) || !hasNewLine.test(item)){// title
        genContent()
        item = genTitle(item,level)
      }else {// content
        item = genNode(item,level, true)
      }
    }
```


`1` 级节点，可能是标题或者内容

若存在子级节点，当做标题处理，若不存在，当做内容处理


```ts
else {
      // level >= 2 as content
      item = genNode(item,level, level === 2)
    }
```


2级节点，当内容处理，若为 `2` 级，需要加 `flag` 进一步格式化


```ts
if (nextLevelReg.test(item)){
      parseTitleContent(item, level + 1)
    }
```


递归处理下一级节点


```ts
if (level <= 2 && i === list.length - 1){
      genContent()
    }
```


遍历1、`2` 级最后一个节点时，生成文本内容

`}`

3、 createLevelReg


```ts
function createLevelReg(level=1, isGlobal = false){
  return new RegExp('\\n'+'\\t'.repeat(level)+'([^\\t])', isGlobal?'g':'')
}
```


`// \n\t{level}[^\t]`

创建 `level` 正则

4、 genTitle


```ts
function genTitle(text, level){
  const match = new RegExp(`([\\s\\S]*?)(?:\\n\\t{${level+1}})|([\\s\\S]*?)$`).exec(text)
  if (match){
    const title = match[1] || match[2] || ''
    output += title.length ? '#'.repeat(level+1)+' '+title+'\n\n': ''
    return text.slice(title.length)
  }
  return text
}
```


生成标题

5、 genNode


```ts
function genNode(text, level, addFlag = false){
  const match = new RegExp(`([\\s\\S]*?)(?:\\n\\t{${level+1}})|([\\s\\S]*?)$`).exec(text)
  if (match){
    const node = match[1] || match[2] || ''
    textContent += addFlag ? contentFlag  + formatNode(node):  '\n' + formatNode(node) + '\n'

    return text.slice(node.length)
  }
  return text
}
```


添加 `flag` 并格式化节点

6、 genContent


```ts
function genContent(){
  if (textContent.length){
    output += formatContent(textContent)
  }
  textContent = ''
}
```


生成文本内容


## transform

1、 formatNode


```ts
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
```


若为中文，格式化内容的英文、数字

若为英文，格式化为代码块，或者高亮

2、 formatCodeBlock


```ts
const formatCodeBlock = (text) => {
    let res = text.trim()
    if (res.length){
        res = '```ts\n'+res+'\n```\n'
    }
    return res121
}
```


格式化为代码块

3、 formatHighlight


```ts
const formatHighlight = (text) => {
    let res = text.trim()
    if (res.length){
        res = '`'+res+'`'
    }
    return res
}
```


格式化为高亮 `112312321231231231`

4、 formatContent


```ts
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
```


格式文本内容

检查文本块，是否包含 `2` 个及以上的单行文本

若是，序号列表格式，单行，加序号

若不是，无格式，单行文本加粗重点显示

