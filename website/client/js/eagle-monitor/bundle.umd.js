(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

  // --------------------------------------------静态资源性能功能-----------------------------------

  var xhr = {
    init: (cb) => {
     
      let xhr = window.XMLHttpRequest;
      console.log(xhr);
      if (xhr._eagle_monitor_flag === true) {
        return void 0;
      }
      xhr._eagle_monitor_flag = true;

      //更改xhr 原型上的open方法：
      let _originOpen = xhr.prototype.open;
      xhr.prototype.open = function (method, url, async, user, password) {
        this._eagle_xhr_info = { method, url, status: null };
        return _originOpen = apply(this, arguments);
      };

      // 更改xhr 原型上的send方法
      let _originSend = xhr.prototype.send;
      xhr.prototype.send = function (value) {
        debugger;
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
        };

        // 以下三种状态都代表着请求已经结束了，需要统计一些信息并上报
        this.addEventListener("load", ajaxEnd("load"), false);// 加载完成
        this.addEventListener("error", ajaxEnd("error"), false);// 失败
        this.addEventListener("abort", ajaxEnd("abort"), false);//主动取消停止
        return _originSend = apply(this, arguments);
      };
    }
  };

  // perf.init((obj) => {
  //   console.log(obj);
  // });


  // resource.init((obj) => {
  //   console.log(obj);
  // });

  xhr.init((obj) => {
    console.log(obj);
  });

})));
//# sourceMappingURL=bundle.umd.js.map
