const fs = require('fs')
const path = require('path')
const transform = require('./core')

let input = fs.readFileSync(path.resolve(__dirname, './input.md'), 'utf-8');
console.log('input',JSON.stringify(input))

const output = transform(input)
console.log('outputData',JSON.stringify(output))

fs.writeFileSync(path.resolve(__dirname, './output.md'), output);