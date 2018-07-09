
//------------------------------错误捕获功能

//----格式化error对象
let formatError = function (errorObj) {
  // columnNumber lineNumber  Firefox浏览器
  // column line  safari 浏览器
  let col = errorObj.column || errorObj.columnNumber;
  let row = errorObj.line || errorObj.lineNumber;
  let errorType = errorObj.name;
  let message = errorObj.message;
  let { stack } = errorObj;
  if (stack) {
    // debugger;
    // urlFirstStack 由有报错url和报错位置组成
    let matchUrl = stack.match(/https?:\/\/[^\n]+/);
    let urlFirstStack = matchUrl.length ? matchUrl[0] : "";//  urlFirstStack的结果为 "http://localhost:3003/js/main.js:25:3)"

    // 获取真正的url
    let resourceUrl = "";
    let regUrlCheck = /https?:\/\/(\S)*\.js/;
    if (regUrlCheck.test(urlFirstStack)) { // 检测urlFirstStack是否包含url
      resourceUrl = urlFirstStack.match(regUrlCheck)[0];  //resourceUrl结果为 "http://localhost:3003/js/main.js"
    }

    // 获取真正的行列信息(针对谷歌浏览器)
    let stackCol = null;
    let stackRow = null;
    let posStack = urlFirstStack.match(/:(\d+):(\d+)/);
    if (posStack && posStack.length >= 3) {
      [, stackCol, stackRow] = posStack;
    }

    return {
      content: stack,
      col: Number(col || stackCol),
      row: Number(row || stackRow),
      errorType, message, resourceUrl
    };
  }
}

export default {
  init: (cb) => {
    let _origin_error = window.onerror;
    window.onerror = function (message, source, lineno, colno, error) {
      let errorInfo = formatError(error);
      errorInfo._message = message;
      errorInfo._source = source;
      errorInfo._lineno = lineno;
      errorInfo._colno = colno;
      errorInfo.type = "error";

      cb(errorInfo); // 上报数据
      _origin_error && _origin_error.apply(window, arguments);
    }
  }
}