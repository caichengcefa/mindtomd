const os = require('os')
const fs = require('fs')
const path = require('path')
const transform = require('./core')


let inputPath = path.resolve(__dirname, './input.md')
let outputPath = path.resolve(__dirname, './output.md')

// const platform = os.platform()
// if (platform === 'darwin'){
//   const base =
//   inputPath = path.resolve(base, './input.md')
//   outputPath = path.resolve(base, './output.md')
//
// }else if ((platform === 'win32'){
//   const base =
//   inputPath = path.resolve(base, './input.md')
//   outputPath = path.resolve(base, './output.md')
// }
//
// const stats = fs.statsSync(inputPath)
// if (!stats.isFile()){
//   throw new Error('file not found',JSON.stringify(inputPath))
// }

let input = fs.readFileSync(inputPath, 'utf-8');
console.log('input',JSON.stringify(input))
const output = transform(input)
console.log('outputData',JSON.stringify(output))

fs.writeFileSync(outputPath, output);
