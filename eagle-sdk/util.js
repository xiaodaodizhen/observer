
// 使用加载完毕后load方法，
export default {
  onload: (cb) => {
    if (window.readyState === "complete") {
       return void 0;
    }
    window.addEventListener("load",()=>{
      cb();
    });
  }
};