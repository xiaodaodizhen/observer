(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

  // --------------------------------------------静态资源性能功能-----------------------------------

  //---------------------------------------------------------------------------------api接口请求功能性能

  // 备注：所有的电脑都会支持xhr ，不是所有的电脑都支持fetch(所以得进行判断是否支持 window.fetch)

  //------------------------------------------------用户行为监控
  // 获取本元素是兄弟元素中的第几个，返回 如：li[2]
  let getIndex = (ele) => {
    // 获取同级兄弟元素（包含自己）
    let children = [].slice.call(ele.parentNode.children);

    let myindex = null;
    // 过滤兄弟元素数组，过滤出跟自己标签名一致的兄弟元素
    children = children.filter(node => node.tagName == ele.tagName);
    // 获取ele元素的在兄弟元素中的index
    for (var i = 0; i < children.length; i++) {
      if (ele == children[i]) {
        myindex = i;
      }
    }
    // for 的i是从0开始的，所以得加1
    myindex = `[${myindex + 1}]`;

    // 获取大写标签名
    let tagName = ele.tagName.toLocaleLowerCase();

    let myLabel = tagName + myindex;
    return myLabel;
  };
  // 获取标签如  ul[2]/li[1]
  let getXpath = (ele) => {
    let xpath = "";
    let currentEle = ele;
    while (currentEle != document.body) {
      let lastPath = xpath ? `/${xpath}` : "";
      xpath = getIndex(currentEle) + lastPath;
      currentEle = currentEle.parentNode;

    }
    return xpath;
  };

  var beh = {
    init: (cb) => {
      document.addEventListener("click", e => {
        let target = e.target;
        let xpath = getXpath(target);
        cb(xpath);
      });
    }
  };

  // perf.init((obj) => {
  //   console.log(obj);
  // });


  // resource.init((obj) => {
  //   console.log(obj);
  // });

  // xhr.init((obj) => {
  //   console.log(obj);
  // });

  // errorCatch.init((obj) => {
  //   console.log(obj);
  // });

  beh.init(obj => {
    console.log(obj);
    // 实现错误上报功能
    new Image("http://ddddddd.gif?type=error&data=`${obj}`");
  });

})));
//# sourceMappingURL=bundle.umd.js.map
