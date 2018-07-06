module.exports = async (ctx, next) => {
  let apiMap = {
    "/api/list": [
      { 1: "1-1" },
      { 2: "2-2" }
    ],
    "/api/users": [
      { "name": "one" },
      { "name": "two" }
    ]
  }

  for (var key in apiMap) {
    if (ctx.path == key) {
      ctx.body = apiMap[key];
      break;
    }
  }
  return next();
}