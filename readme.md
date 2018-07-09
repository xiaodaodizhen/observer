## 好项目
- 可拓展
- 可维护
- 规范
- 模块化
- 符合mvvm 模式
- 组件通信（尽量避免event）
- 可以使用dispatch(redux 集成管理状态) 不使用内部setState


## 监控
- 技术监控
 - 页面性能监控        —— eagle-sdk/perf.js
 - 静态资源性能监控    —— eagle-sdk/resource.js
 - 错误监控            —— eagle-sdk/errorCatch.js    - middleware/sourceMap.js 错误反解
 - 接口性能监控        —— eagle-sdk/xhr.js


- 行为监控
  - 用户行为监控     —— eagle-sdk/beh.js
  - 打点监控
  - 大量log上报策略
  - 时效策略



  ## website文件夹
  - npm install nodemon -D   用来监视node.js中的应用程序中的任何更改并自动重启服务，



  ## eagle-sdk文件夹
  
  - npm install rollup babel babel-core -D   打包类库（webpack主要打包业务逻辑，rollup 主要打包类库） 


  