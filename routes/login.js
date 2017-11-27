const router = require('koa-router')();
const userDao=require('../dao/userDao');

router.prefix('/login');
router.get('/', async (ctx, next)=> {
    await ctx.render('login')
})

router.post('/login',async (ctx)=>{
    let formData = ctx.request.body
    let resultData= await userDao.login(formData)
    if(resultData.length>0){
        let res= new Object();
        res.status="success";
        ctx.body=JSON.stringify(res);
    }else {
        let res= new Object();
        res.status="err";
        ctx.body=JSON.stringify(res);
    }
})

module.exports = router
