let Koa = require("koa");
let Server = require("koa-static");
let api = require("./middleware/api");
const app = new Koa();
const port = 3003;
app.use(api);
app.use(Server(__dirname + "/client"));

app.listen(port, () => {
  console.log(`${port}`);
});