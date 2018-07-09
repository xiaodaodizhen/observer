let Koa = require("koa");
let Server = require("koa-static");
let api = require("./middleware/api");
let sourceMap = require("./middleware/sourceMap");
const app = new Koa();
const port = 3003;

app.use(api);
app.use(sourceMap);
app.use(Server(__dirname + "/client"));

app.listen(port, () => {
  console.log(`${port}`);
});