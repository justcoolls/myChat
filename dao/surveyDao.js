const Koa = require('koa');
const app = new Koa();
const monk =  require('monk');
const url = 'mongodb://localhost:27017/mychat';
const db =new monk(url);
const site = db.get('site');

app.use(async(ctx, next) => {
    console.log("123");
    let data = await users.find({}, {sort: {name: 1}});
    console.log(data);
    ctx.body = data;
});