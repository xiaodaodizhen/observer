import perf from "./perf.js";
import resource from "./resource.js";
import xhr from "./xhr.js";
import errorCatch from "./errorCatch.js";
import beh from "./beh.js";
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
