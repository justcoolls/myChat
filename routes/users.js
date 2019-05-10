const router = require('koa-router')();
const userDao = require('../dao/userDao');
const groupDao = require('../dao/groupDao');
const surveyDao= require('../dao/surveyDao');
const jwt = require('jsonwebtoken');

function getCookie(cookies)
{
    if(!cookies){
        return null
    }
    let arr,reg=new RegExp("(^| )"+'token'+"=([^;]*)(;|$)");
    if(arr=cookies.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
router.all('/',async (ctx, next)=>{
    let token;
    let cookies=ctx.header.cookie;
    token=getCookie(cookies);
    if(!token){
        await ctx.redirect('/login');
    }else{
        try{
            let user = jwt.verify(token, 'jwtSecret').name;
        }
        catch (e){
            await ctx.redirect('/login');
            return;
        }
        await next();
    }
});
router.get('/', async (ctx)=> {
    await ctx.render('/');
});
router.get('/login', async (ctx)=> {
    await ctx.render('login');
});

ages=(str)=>{
    let   r   =   str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if(r==null)return   false;
    let   d=   new   Date(r[1],   r[3]-1,   r[4]);
    if   (d.getFullYear()===r[1]&&(d.getMonth()+1)===r[3]&&d.getDate()===r[4])
    {
        let   Y   =   new   Date().getFullYear();
        return((Y-r[1]));
    }
};
router.post("/login",async (ctx)=>{
    let formData = ctx.request.body;
    let resultData= await userDao.login(formData);
    let res= {};
    let profile = {
        name: formData.userName,
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
    let res= {};
    let userlen=formData.userName.length;
    if(userlen<3){
        res.status="lengtherr";
    }else {
        // let verifyUser= await userDao.verifyUser(formData);
        let verifyUser= null

        if(verifyUser==null){
            let resultData= await userDao.register(formData);
            let profile = {
                name: formData.userName,
            };
            if(resultData === 'suc'){
                let Groupdata= {};
                Groupdata.user=formData.userName;
                Groupdata.name="talk";
                await groupDao.addGroup(Groupdata);
                res.token=jwt.sign(profile, 'jwtSecret', {expiresIn: '10d'});;
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
router.get("/information",async (ctx)=>{
    let cookies=ctx.header.cookie;
    let token=getCookie(cookies);
    let user=jwt.verify(token, 'jwtSecret').name;
    let resultData= await userDao.userInform(user);
    let res= {};
    if(resultData.length>0){
        res.status="success";
        res.avatar=resultData[0]._doc.avatar;
        res.name=resultData[0]._doc.name;
        res.age=resultData[0]._doc.age;
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
router.get("/userInform",async (ctx)=>{
    let token;
    let cookies=ctx.header.cookie;
    token=getCookie(cookies);
    let user=jwt.verify(token, 'jwtSecret').name;
    let resultData= await userDao.userInform(user);
    let res= {};
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
    let resultData= await userDao.userInform(user);
    let res= {};
    if(resultData.length>0){
        let data=[];
        res.status="success";

        if(resultData[0]._doc.sex){
            let content= {};
            content.name="性别";
            content.value=resultData[0]._doc.sex;
            data.push(content);
        }else {
            let content= {};
            content.name="性别";
            content.value="未知";
            data.push(content);
        }
        if(resultData[0]._doc.location){
            let content= {};
            content.name="位置";
            content.value=resultData[0]._doc.location;
            data.push(content);
        }else {
            let content= {};
            content.name="位置";
            content.value="火星";
            data.push(content);
        }
        if(resultData[0]._doc.age){
            let age=ages(resultData[0]._doc.age);
            let content= {};
            content.name="年龄";
            content.value=age;
            data.push(content);
        }else {
            let content= {};
            content.name="年龄";
            content.value="0";
            data.push(content);
        }
        if(resultData[0]._doc.email){
            let content= {};
            content.name="邮件";
            content.value=resultData[0]._doc.email;
            data.push(content);
        }
        if(resultData[0]._doc.gitHub){
            let content= {};
            content.name="GitHub";
            content.value=resultData[0]._doc.gitHub;
            data.push(content);
        }
        if(resultData[0]._doc.personalWeb){
            let content= {};
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
    formData.user=jwt.verify(token, 'jwtSecret').name;
    let resultData= await userDao.updateform(formData);
    let res= {};
    if(resultData.length>0){
        res.status="success";
    }else{
        res.status="err";
    }
    return ctx.body=JSON.stringify(res);
});

router.get("/groupList",async (ctx)=>{
    let token;
    let cookies=ctx.header.cookie;
    token=getCookie(cookies);
    let user=jwt.verify(token, 'jwtSecret').name;
    let resultData= await userDao.groupList(user);
    let res= {};
    let groups= [];
    if(resultData){
        let len=resultData.groups.length;
        for(let i=0;i<len;i++){
            let groupOwn= {};
            let groupName=resultData.groups[i];
            groupOwn.name=groupName;
            groupOwn.type="group";
            groupOwn.key=i;
            let grouptAvatar= await groupDao.groupFind(groupName);
            if(grouptAvatar === null){
                await userDao.outGroup({name:groupName,user:user});
                break;
            }
            if(grouptAvatar!=null){
                groupOwn.avatar=grouptAvatar.avatar;
            }
            let messagelast= await surveyDao.messagelast(groupName);
            if(messagelast!=null){
                groupOwn.meslast=messagelast.name+":"+messagelast.myMes;
            }
            groups[i]=groupOwn;
        }
          res.groups=groups;
          res.status=1;
          res.mes="success";
    }else{
          res.status=0;
          res.mes="err";
    }
    return ctx.body=JSON.stringify(res);
});
module.exports = router;
