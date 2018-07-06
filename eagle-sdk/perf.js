
// --------------------------------------页面性能监控功能---------------------------------------
export default {
  init: (cb) => {
    
    let performance = window.performance;// w3c 提出的，用于精确计算网页性能数据的特性，有浏览器兼容性问题，需要进行适配
    console.log(JSON.stringify(performance));

    let isDOMReady = false; //dom是否加载完成
    let isOnload = false; // 页面是否加载完成
    let cycleTime = 100;// 循环检测间隔时间

    let Util = {
      getPerfData: (p) => {
        let data = {
          // 网络建连
          prevPage: p.fetchStart - p.navigationStart,//上一个页面所需时间（从卸载到新页面开始请求）
          redirect: p.redirectEnd - p.redirectStart,//重定向时间
          dns: p.domainLookupEnd - p.domainLookupStart,// DNS查找时间
          connect: p.connectEnd - p.connectStart,//TCP 建连时间
          network: p.connectEnd - p.navigationStart,// 网络总耗时

          // 网络接收
          send: p.responseStart - p.requestStart,// 前端发送到接收时间
          receive: p.responseEnd - p.responseStart,//接收数据耗时
          request: p.responseEnd - p.requestStart,// 请求页面总耗时

          // 前端渲染
          dom: p.domComplete - p.domLoading,//dom解析时间
          loadEvent: p.loadEventEnd - p.loadEventStart,//loadEvent时间
          frontend: p.loadEventEnd - p.domLoading,//前端总时间

          // 关键阶段
          load: p.loadEventEnd - p.navigationStart,//页面完全加载时间
          domReady: p.domContentLoadedEventStart - p.navigationStart,//dom准备时间
          interactive: p.domInteractive - p.navigationStart,//可操作时间
          ttfb: p.responseStart - p.navigationStart,// 首字节接收时间（如果接收不到，服务端出问题）

        };
        return data;
      },


      // dom解析完成
      domready: (callback) => {
        if (isDOMReady === true) {
          return void 0;
        }
        let timer = null;

        // 方法： DOMContentLoaded 是否完成
        let runCheck = () => {
          if (performance.timing.domComplete) {
            // 1. 停止循环检测 2.运行callback
            clearTimeout(timer);
            callback();
            isDOMReady = true;
          } else {
            // 继续检测
            timer = setTimeout(runCheck, cycleTime);;
          }
        }

        if (document.readyState === "interactive") {
          callback();
          return void 0;
        }

        document.addEventListener("DOMContentLoaded", () => {
          // 开始循环检测 是否 DOMContentLoaded 已经完成
          runCheck();
        });
      },

      //页面加载完成
      onload: (callback) => {
        if (isOnload === true) {
          return void 0;
        }
        let timer = null;

        // 方法： 循环检测load 是否完成
        let runCheck = () => {
          if (performance.timing.loadEventEnd) {
            // 1. 停止循环检测 2.运行callback
            clearTimeout(timer);
            callback();
            isOnload = true;
          } else {
            // 继续检测
            timer = setTimeout(runCheck, cycleTime);;
          }
        }

        if (document.readyState === "interactive") {
          callback();
          return void 0;
        }

        window.addEventListener("load", () => {
          // 开始循环检测 是否 load 已经完成
          runCheck();
          // callback();// 如果此处直接callback(),没有进行循环检测，返回值data 的load\loadEvent 属性就会出现负值（也就是loadEventEnd没有完成的时候就执行了，所以进行循环检测，当loadEventEnd完成时在进行回调）
        });
      }
    };


    // DOM解析完成
    Util.domready(() => {
      // 获取到的数据应该给SDK上层去传递这个数据 perfData
      let perfData = Util.getPerfData(performance.timing);
      perfData.type = "domready";
      cb(perfData);
      // debugger;
    });

    //页面加载完成
    Util.onload(() => {
      let perfData = Util.getPerfData(performance.timing);
      perfData.type = "onload";
      cb(perfData);
      // debugger;
    });

    // performance 所有属性
    //    {
    //     "timeOrigin":1530770516420.056,
    //     "timing":{

    //-------------------------页面请求之前
    //       "navigationStart":1530770516420,-----前一个网页的卸载时间                                        默认值：fetchStart                          备注
    //       "unloadEventStart":1530770516458,----前一个网页的unload事件开始时间                              默认值：0
    //       "unloadEventEnd":1530770516458,------前一个网页的unload事件结束时间                              默认值：0
    //       "redirectStart":0,-------------------重定向开始时间                                                     0                                  需要同域
    //       "redirectEnd":0,---------------------重定向结束时间                                                     0                                  需要同域

    //--------------------------页面请求开始（重点在服务端优化）
    //       "fetchStart":1530770516421,--------开始请求页面                                                       当前时间戳
    //       "domainLookupStart":1530770516421,-DNS查询开始时间                                                    fetchStart（如果不需要查询的情况-有缓存）
    //       "domainLookupEnd":1530770516421,  -DNS查询结束时间                                                    fetchStart（如果不需要查询的情况-有缓存）
    //       "connectStart":1530770516421,------向服务器建立握手开始                                                fetchStart（如果不需要握手的情况）
    //       "connectEnd":1530770516421,--------向服务器建立握手结束                                                fetchStart（如果不需要握手的情况）
    //       "secureConnectionStart":0,---------安全握手开始                                                        0                                     非https的没有
    //       "requestStart":1530770516423,------向服务器发送请求开始时间
    //       "responseStart":1530770516453,-----服务器返回数据开始
    //       "responseEnd":1530770516458,-------服务器返回数据结束

    // domContentLoaded 与onLoad的区别：onLoad 是等页面所有东西加载完成（包含图片...）  domContentLoaded 是等页面dom元素加载完成

    // ---------------------前端渲染
    //       "domLoading":1530770516463,-------解析dom开始                                                                                                 document.readState为loading
    //       "domInteractive":0,---------------解析dom结束                                                                                                 document.readState为interactive
    //       "domContentLoadedEventStart":0,---domContentLoad所有的函数回调开始运行
    //       "domContentLoadedEventEnd":0,-----domContentLoad所有的函数回调结束运行
    //       "domComplete":0,------------------文档解析完成
    //       "loadEventStart":0,---------------load事件发送前
    //       "loadEventEnd":0------------------load事件发送后
    //       },
    //     "navigation":{
    //       "type":1,
    //       "redirectCount":0
    //       }
    // }
  }
}