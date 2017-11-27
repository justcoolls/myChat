const router = require('koa-router')()

// router.prefix('/index')

router.all('/',async (ctx, next)=>{
    // await ctx.redirect('/');
    await next();
})
router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'myChat'
  })
})

router.post('/', async (ctx, next) => {

})

var sendRet = function(res,json){
    res.contentType('json').send(JSON.stringify(json)).end();
}
module.exports = router
