const router = require('koa-router')();
const jwt = require('jsonwebtoken');
const groupDao= require('../dao/groupDao');
const userDao= require('../dao/userDao');
router.prefix('/group');
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

router.post('/createGroup',async (ctx) => {
    let cookies=ctx.header.cookie;
    let token=getCookie(cookies);
    let user=jwt.verify(token, 'jwtSecret').name;
    let res= {};
    let formData = ctx.request.body;
    formData.user=user;
    let groupLimit= await groupDao.groupLimit(user);
    let groupNum=groupLimit.length;
    if(groupNum<2){
        let groupFind= await groupDao.groupFind(formData.name);
        if(groupFind==null){
            let resultData= await groupDao.groupGreat(formData);
            let userAddGroup = await userDao.addGroup(formData);
            if(resultData ==="suc" && userAddGroup ==="suc"){
                res.status=1;
                res.mes="success";
            }else {
                res.status=0;
                res.mes="创建失败！";
            }
        }else {
            res.status=2;
            res.mes="名称已存在！";
        }
    }else{
        res.status=3;
        res.mes="最多创建两个分组！";
    }

    return ctx.body=JSON.stringify(res);
});
router.post('/addGroup',async (ctx, next) => {
    let cookies=ctx.header.cookie;
    let token=getCookie(cookies);
    let user=jwt.verify(token, 'jwtSecret').name;
    let res= {};
    let formData = ctx.request.body;
    formData.user=user;
    let resultData= await groupDao.addGroup(formData);
    if(resultData.nModified === 1 && resultData.n === 1){
        await userDao.addGroup(formData);
        res.status="success";
        res.avatar=resultData.avatar;
    }else if(resultData.nModified === 0 && resultData.n === 1){
        await userDao.addGroup(formData);
        res.status="exist";
    }
    else if(resultData.nModified === 0 && resultData.n === 0){
        res.status="noexist";
    }else{
        res.status="err";
    }
    return ctx.body=JSON.stringify(res);

});

router.post('/outGroup',async (ctx, next) => {
    let cookies=ctx.header.cookie;
    let token=getCookie(cookies);
    let user=jwt.verify(token, 'jwtSecret').name;
    let res= {};
    let formData = ctx.request.body;
    formData.user=user;
    let resultData= await groupDao.outGroup(formData);
    let userpullGroup= await userDao.outGroup(formData);
    if(userpullGroup.nModified === 1 && userpullGroup.n === 1){
        res.status="success";
    }else if(userpullGroup.nModified === 0 && userpullGroup.n === 1){
        res.status="exist";
    }
    else if(userpullGroup.nModified === 0 && userpullGroup.n === 0){
        res.status="noexist";
    }else{
        res.status="err";
    }
    return ctx.body=JSON.stringify(res);

});
router.post('/groupMember',async (ctx, next) => {
    let res= {};
    let formData = ctx.request.body;
    let resultData= await groupDao.groupFind(formData.name);
    if(resultData){
        let avatars= [];
        let users=resultData.users;
        let len=users.length;
        for(let i=0;i<len;i++){
            let infor= {};
            let userName =users[i];
            let myavatars= await userDao.userInform(userName);
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
