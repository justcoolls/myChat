const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const jwt = require('koa-jwt');
const mongoose = require('mongoose');
const index = require('./routes/index');
const users = require('./routes/users');
const group = require('./routes/group');

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/build'));

app.use(views(__dirname + '/build/views', {
  extension: 'ejs'
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
});
// session
// mongoose.connect(DB_URL,{useMongoClient:true});
// app.use(session({
//     store: new MongooseStore()
// }));

app.use(jwt({ secret: 'jwtSecret', passthrough:true }));
// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(group.routes(), group.allowedMethods());

module.exports = app;
