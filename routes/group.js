const router = require('koa-router')();
const jwt = require('jsonwebtoken');
const groupDao= require('../dao/groupDao');
const userDao= require('../dao/userDao');
router.prefix('/group');
// router.get('/', async (ctx, next) => {
//     await ctx.render('group', {
//         title: 'group'
//     })
// });
function getCookie(cookies)
{
    if(cookies){
        let arr,reg=new RegExp("(^| )"+'token'+"=([^;]*)(;|$)");
        if(arr=cookies.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }else {
        return null;
    }

}

router.post('/createGroup',async (ctx, next) => {
    let cookies=ctx.header.cookie;
    token=getCookie(cookies);
    let user=jwt.verify(token, 'jwtSecret').name;
    let res= new Object();
    let formData = ctx.request.body;
    formData.user=user;
    let grouplimit= await groupDao.grouplimit(user);
    let groupnum=grouplimit.length;
    if(groupnum<2){
        let groupfind= await groupDao.groupfind(formData.name);
        if(groupfind==null){
            let resultData= await groupDao.groupGreat(formData);
            let useraddGroup = await userDao.addGroup(formData);
            if(resultData=="suc" && useraddGroup=="suc"){
                res.status="success";
            }else {
                res.status="err";
            }
        }else {
            res.status="exist";
        }
    }else{
        res.status="limit";
    }

    return ctx.body=JSON.stringify(res);
});
router.post('/addGroup',async (ctx, next) => {
    let cookies=ctx.header.cookie;
    token=getCookie(cookies);
    let user=jwt.verify(token, 'jwtSecret').name;
    let res= new Object();
    let formData = ctx.request.body;
    formData.user=user;
    let resultData= await groupDao.addGroup(formData);
    if(resultData.nModified==1 && resultData.n==1){
        await userDao.addGroup(formData);
        res.status="success";
        res.avatar=resultData.avatar;
    }else if(resultData.nModified==0 && resultData.n==1){
        await userDao.addGroup(formData);
        res.status="exist";
    }
    else if(resultData.nModified==0 && resultData.n==0){
        res.status="noexist";
    }else{
        res.status="err";
    }
    return ctx.body=JSON.stringify(res);

});

router.post('/outGroup',async (ctx, next) => {
    let cookies=ctx.header.cookie;
    token=getCookie(cookies);
    let user=jwt.verify(token, 'jwtSecret').name;
    let res= new Object();
    let formData = ctx.request.body;
    formData.user=user;
    let resultData= await groupDao.outGroup(formData);
    let userpullGroup= await userDao.outGroup(formData);
    if(userpullGroup.nModified==1 && userpullGroup.n==1){
        res.status="success";
    }else if(userpullGroup.nModified==0 && userpullGroup.n==1){
        res.status="exist";
    }
    else if(userpullGroup.nModified==0 && userpullGroup.n==0){
        res.status="noexist";
    }else{
        res.status="err";
    }
    return ctx.body=JSON.stringify(res);

});
router.post('/groupmember',async (ctx, next) => {
    let res= new Object();
    let formData = ctx.request.body;
    let resultData= await groupDao.groupfind(formData.name);
    if(resultData){
        let avatars= [];
        let users=resultData.users;
        let len=users.length;
        for(let i=0;i<len;i++){
            let infor= new Object();
            let username =users[i];
            let myavatars= await userDao.userinform(username);
            infor.user=myavatars[0].name;
            infor.avatar=myavatars[0].avatar;
            infor.key=i;
            avatars.push(infor);
        }
        res.status="success";
        res.infors=avatars;
    }else{
        res.status="err";
    }
    return ctx.body=JSON.stringify(res);

});

module.exports = router;
