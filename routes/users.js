const router = require('koa-router')();
const userDao = require('../dao/userDao');
const groupDao = require('../dao/groupDao');
const surveyDao= require('../dao/surveyDao');
const jwt = require('jsonwebtoken');

function getCookie(cookies)
{
    let arr,reg=new RegExp("(^| )"+'token'+"=([^;]*)(;|$)");
    if(arr=cookies.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
// router.prefix('/login');
router.get('/', async (ctx, next)=> {
    await ctx.render('login');
});
ages=(str)=>{
    let   r   =   str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if(r==null)return   false;
    let   d=   new   Date(r[1],   r[3]-1,   r[4]);
    if   (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4])
    {
        let   Y   =   new   Date().getFullYear();
        return((Y-r[1]));
    }
};
router.post("/login",async (ctx)=>{
    let formData = ctx.request.body;
    let resultData= await userDao.login(formData);
    let res= new Object();
    let profile = {
        name: formData.username,
    };
    if(resultData!=null){
        let token = jwt.sign(profile, 'jwtSecret', {expiresIn: '10d'});
        res.status="success";
        res.token=token;
    }else {
        res.status="err";
    }
        return ctx.body=JSON.stringify(res);
});
router.post("/register",async (ctx)=>{
    let formData = ctx.request.body;
    let res= new Object();
    let userlen=formData.username.length;
    if(userlen<3){
        res.status="lengtherr";
    }else {
        let verifyUser= await userDao.verifyUser(formData);

        if(verifyUser==null){
            let resultData= await userDao.register(formData);
            let profile = {
                name: formData.username,
            };
            if(resultData == 'suc'){
                let Groupdata= new Object();
                Groupdata.user=formData.username;
                Groupdata.name="talk";
                await groupDao.addGroup(Groupdata);
                let token = jwt.sign(profile, 'jwtSecret', {expiresIn: '10d'});
                res.token=token;
                res.status="success";
            }else {
                res.status="err";
            }
        }else {
            res.status="err";
        }
    }

    return ctx.body=JSON.stringify(res);
});
router.get("/moLogin",async (ctx)=>{
    let token;
    let cookies=ctx.header.cookie;
    token=getCookie(cookies);
    let user=jwt.verify(token, 'jwtSecret').name;
    let res= new Object();
    if(user){
        res.status="success";
    }else{
        res.status="err";
    }
    return ctx.body=JSON.stringify(res);
});

router.post("/informavatar",async (ctx)=>{
    let user = ctx.request.body.name;
    let resultData= await userDao.informa(user);
    let res= new Object();
    if(resultData.length>0){
        res.status="success";
        res.avatar=resultData[0]._doc.avatar;
    }else{
        res.status="err";
    }
    return ctx.body=JSON.stringify(res);
});
router.get("/userinform",async (ctx)=>{
    let token;
    let cookies=ctx.header.cookie;
    token=getCookie(cookies);
    let user=jwt.verify(token, 'jwtSecret').name;
    let resultData= await userDao.userinform(user);
    let res= new Object();
    if(resultData.length>0){
        res.status="success";
        res.avatar=resultData[0]._doc.avatar;
        res.name=resultData[0]._doc.name;
        if(resultData[0]._doc.sex){
            res.sex=resultData[0]._doc.sex;
        }else {
            res.sex="未知";
        }
        if(resultData[0]._doc.location){
            res.location=resultData[0]._doc.location;
        }else {
            res.location="火星";
        }
        if(resultData[0]._doc.age){
            res.age=resultData[0]._doc.age;
        }else {
            res.age="2018-01-01";
        }
        if(resultData[0]._doc.email){
            res.email=resultData[0]._doc.email;
        }else {
            res.email="email";
        }
        if(resultData[0]._doc.gitHub){
            res.gitHub=resultData[0]._doc.gitHub;
        }else {
            res.gitHub="gitHub";
        }
        if(resultData[0]._doc.personalWeb){
            res.personalWeb=resultData[0]._doc.personalWeb;
        }else {
            res.personalWeb="personalWeb";
        }
    }else{
        res.status="err";
    }
    return ctx.body=JSON.stringify(res);
});
router.post("/userinforo",async (ctx)=>{
    let user = ctx.request.body.user;
    let resultData= await userDao.userinform(user);
    let res= new Object();
    if(resultData.length>0){
        let data=[];
        res.status="success";

        if(resultData[0]._doc.sex){
            let content= new Object();
            content.name="性别";
            content.value=resultData[0]._doc.sex;
            data.push(content);
        }else {
            let content= new Object();
            content.name="性别";
            content.value="未知";
            data.push(content);
        }
        if(resultData[0]._doc.location){
            let content= new Object();
            content.name="位置";
            content.value=resultData[0]._doc.location;
            data.push(content);
        }else {
            let content= new Object();
            content.name="位置";
            content.value="火星";
            data.push(content);
        }
        if(resultData[0]._doc.age){
            let age=ages(resultData[0]._doc.age);
            let content= new Object();
            content.name="年龄";
            content.value=age;
            data.push(content);
        }else {
            let content= new Object();
            content.name="年龄";
            content.value="0";
            data.push(content);
        }
        if(resultData[0]._doc.email){
            let content= new Object();
            content.name="邮件";
            content.value=resultData[0]._doc.email;
            data.push(content);
        }
        if(resultData[0]._doc.gitHub){
            let content= new Object();
            content.name="GitHub";
            content.value=resultData[0]._doc.gitHub;
            data.push(content);
        }
        if(resultData[0]._doc.personalWeb){
            let content= new Object();
            content.name="个人网站";
            content.value=resultData[0]._doc.personalWeb;
            data.push(content);
        }
        res.infor=data;
    }else{
        res.status="err";
    }
    return ctx.body=JSON.stringify(res);
});


router.post("/upuser",async (ctx)=>{
    let formData = ctx.request.body;
    let token;
    let cookies=ctx.header.cookie;
    token=getCookie(cookies);
    let user=jwt.verify(token, 'jwtSecret').name;
    formData.user=user;
    let resultData= await userDao.updateform(formData);
    let res= new Object();
    if(resultData.length>0){
        res.status="success";
    }else{
        res.status="err";
    }
    return ctx.body=JSON.stringify(res);
});

router.get("/ugroupfind",async (ctx)=>{
    let token;
    let cookies=ctx.header.cookie;
    token=getCookie(cookies);
    let user=jwt.verify(token, 'jwtSecret').name;
    let resultData= await userDao.ugroupfind(user);
    let res= new Object();
    let groups= [];
    if(resultData){
        let len=resultData.groups.length;
        for(let i=0;i<len;i++){
            let groupO= new Object();
            let groupname=resultData.groups[i];
            groupO.group=groupname;
            groupO.Badge=0;
            groupO.type="crowd";
            groupO.key=i;
            let grouptAvatar= await groupDao.groupfind(groupname);
            if(grouptAvatar!=null){
                groupO.avatar=grouptAvatar.avatar;
            }
            let messagelast= await surveyDao.messagelast(groupname);
            if(messagelast!=null){
                groupO.meslast=messagelast.name+":"+messagelast.myMes;
            }
            groups[i]=groupO;
        }
          res.groups=groups;
          res.status="success";
    }else{
          res.status="err";
    }
    return ctx.body=JSON.stringify(res);
});
module.exports = router;
