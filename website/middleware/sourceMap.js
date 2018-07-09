// ---------------------------------------通过 “source-map” 库反解（打包后的文件） 错误代码（通过行、列找展示报错文件和报错行）
const fs = require("fs");
const path = require("path");
let sourceMap = require("source-map");
// 获取映射的打包文件
let sourcemapFilePath = path.join(__dirname, "../client/js/eagle-monitor/bundle.umd.js.map");


let fixPath = (filePath) => {
  return filePath.replace(/\.[\.\/]/, "");
}

let sourceFileMap = {};
module.exports = async (ctx, next) => {
  if (ctx.path === "/sourcemap") {
    // 读取打包后的文件
    let sourceMapContent = fs.readFileSync(sourcemapFilePath, "utf-8");
    let fileObj = JSON.parse(sourceMapContent);
    // 解构出 sources对象
    let { sources } = fileObj;

    // 对象sourceFileMap   key 是修复过的path   value 是没有修复过的path

    // sources.map((item) => {
    //   sourceFileMap[fixPath(item)] = item; // 测试用例中未实现
    // });

    sources.map((item) => {
      sourceFileMap[item] = item;
    });

    // 例如 ：错误代码
    let line = 28;
    let column = 3;
    const consumer = await new sourceMap.SourceMapConsumer(sourceMapContent);
    let result = consumer.originalPositionFor({ line, column });

    // 获取打包后错误文件的源文件的文件地址 如："originSource": "../../../../eagle-sdk/errorCatch.js",
    let originSource = sourceFileMap[result.source];
    // 获取打包后错误文件在sourcesContent数组中的代码块
    let sourceContent = fileObj.sourcesContent[sources.indexOf(originSource)];
    // 将错误文件的代码块根据 \n 换行符转为数组，（一行一行的显示）
    let sourceContentArr = sourceContent.split("\n");
    ctx.body = { sourceContentArr, originSource, result };
  }
  return next();
}