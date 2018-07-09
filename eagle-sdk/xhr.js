//---------------------------------------------------------------------------------api接口请求功能性能

export default {
// TODO 自身的请求无需拦截

  init: (cb) => {
    // xhr hook ------------------------------------开始
    let xhr = window.XMLHttpRequest;
    if (xhr._eagle_monitor_flag === true) {
      return void 0;
    }
    xhr._eagle_monitor_flag = true;

    //更改xhr 原型上的open方法：
    let _originOpen = xhr.prototype.open;
    xhr.prototype.open = function (method, url, async, user, password) {
      debugger;
      // 要上报的数据_eagle_xhr_info
      this._eagle_xhr_info = { method, url, status: null };
      return _originOpen.apply(this, arguments);// 调用本来open的逻辑
    }

    // 更改xhr 原型上的send方法
    let _originSend = xhr.prototype.send;
    xhr.prototype.send = function (value) {
      // debugger;
      let _self = this;// 给this设置变量
      this._eagle_start_time = Date.now();// 记录方法开始执行时间

      // 定义上报方法:定义高阶函数（函数返回函数）
      let ajaxEnd = (eventType) => () => {
        if (_self.response) {
          let responseSize = null;// 定义返回res的长度
          switch (_self.responseType) {// 根据res 的返回类型，获取responseSize
            case "json":// TODO :JSON 有兼容性问题 && stringify报错问题
              responseSize = JSON.stringify(_self.response).length;
              break;
            case "arraybuffer":// byteLength 是获取buffer长度的属性
              responseSize = _self.response.byteLength;
              break;
            default:
              responseSize = _self.responseText.length;
              break;
          }
          _self._eagle_xhr_info.event = eventType;
          _self._eagle_xhr_info.status = _self.status;
          _self._eagle_xhr_info.success = _self.status === 200;
          _self._eagle_xhr_info.duration = Date.now() - this._eagle_start_time;
          _self._eagle_xhr_info.responseSize = responseSize;
          _self._eagle_xhr_info.type = "xhr";
          _self._eagle_xhr_info.requestSize = value ? value.length : 0;// TODO：一定确保value 有length属性，（数字，布尔，null ,undefinde 没有此属性，进行兼容判断）
          cb(_self._eagle_xhr_info);
        }
      }

      // 以下三种状态都代表着请求已经结束了，需要统计一些信息并上报(TODO：addEventListener兼容性问题)
      this.addEventListener("load", ajaxEnd("load"), false);// 加载完成
      this.addEventListener("error", ajaxEnd("error"), false);// 失败
      this.addEventListener("abort", ajaxEnd("abort"), false);//主动取消停止
      return _originSend.apply(this, arguments); //调用本来send的逻辑
    }
    // xhr hook ------------------------------------结束



    // fetch hook ------------------------------------开始
    if (window.fetch) {
      let _originFetch = window.fetch;
      window.fetch = function () {
        let startTime = Date.now();
        let args = [].slice.call(arguments);// 将类数组arguments转为数组，并且从0位开始截取到最后

        let method = "GET";
        let url = null;

        let fetchInput = args[0];
        if (typeof fetchInput == "string") {
          url = fetchInput;
        } else if ("Request" in window && fetchInput instanceof window.Request) {
          url = fetchInput.url;
          if (fetchInput.method) {
            method = fetchInput.method;
          }
        } else {
          url = "" + fetchInput;
        }


        // 要上报的数据
        let eagleFetchData = {
          url, method, status: null
        };
        
        return _originFetch.apply(this, args).then((response) => { // fetch 的api是基于promise 设计的，所以可以使用then
          eagleFetchData.status = response.status;
          eagleFetchData.type = "fetch";
          eagleFetchData.duration = Date.now() - startTime;
          cb(eagleFetchData);
          return response;
        });

      }
    }
    // fetch hook ------------------------------------结束

  }
}

// 备注：所有的电脑都会支持xhr ，不是所有的电脑都支持fetch(所以得进行判断是否支持 window.fetch)