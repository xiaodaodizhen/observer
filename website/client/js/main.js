
//------------------------------------------------------测试api接口性能
// 方法一：使用xhr 方法请求api
// $.ajax({
//   url: "http://localhost:3003/api/users",
//   method: "POST",
//   data: JSON.stringify({
//     a: "a",
//     b: "b"
//   })
// }).then(res => {
//   // debugger;
//   console.log(1);
// }).catch(err => {
//   // debugger;
//   console.log(2);
// });


// 方法二：使用fetch 方法请求api（fetch 的api基于Promise 设计）
// fetch("http://localhost:3003/api/users").then(res => {
//   // console.log(res);
// });


// -----------------------------------------------------测试报错捕获功能
// function a() {
//   y = z + x;
// }
// a();