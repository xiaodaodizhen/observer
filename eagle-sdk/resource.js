// --------------------------------------------静态资源性能功能-----------------------------------
import Util from "./util";

let resolvePerformanceResource = (resourceData) => {
  let r = resourceData;
  let data = {
    initiatorType: r.initiatorType,
    name: r.name,
    duration: parseInt(r.duration),// 持续时长

    // 连接过程 
    redirect: r.redirectEnd - r.redirectStart,// 重定向
    dns: r.domainLookupEnd - r.domainLookupStart,// DNS查找
    connect: r.connectEnd - r.connectStart,// TCP建连
    network: r.connectEnd - r.startTime,// 网络总耗时

    // 接收过程
    send: r.responseStart - r.requestStart,// 发送开始到接收开始的总时长
    recevie: r.responseEnd - r.responseStart,// 接收的总时长
    request: r.responseEnd - r.requestStart,// 接收总耗时

    // 核心指标
    ttfb: r.responseStart - r.requestStart,// 首字节接收耗时
  };
  return data;
}

// 帮助我们循环获得每一个资源的性能数据
let resolveEnties = (entries) => entries.map((v) => resolvePerformanceResource(v));


export default {
  init: (cb) => {


    if (window.PerformanceObserver) {
      debugger;
      // 动态获取每一个资源信息
      let observer = new window.PerformanceObserver((list) => {
        try {
          let entries = list.getEntries();
          let entiesData = resolveEnties(entries);
          cb(entiesData);
        } catch (error) {
          console.error(error);
        }
      });
      observer.observe({ entryTypes: ["resource"] });// 给observer添加监听，监听性能条目类型
    } else {// 在onload之后获取所有的资源信息
      Util.onload(() => {
        let entries = performance.getEntriesByType("resource");
        let entiesData = resolveEnties(entries);
        cb(entiesData);
      });
    }
    // debugger;
  },
};