const router = require('koa-router')();
const jwt = require('jsonwebtoken');
const surveyDao= require('../dao/surveyDao');
const userDao = require('../dao/userDao');
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
router.prefix('/myChat');
router.post('/mesSave', async (ctx, next) => {
    let res= {};
    let formData = ctx.request.body;
    let token;
    let cookies=ctx.header.cookie;
    token=getCookie(cookies);
    formData.name=jwt.verify(token, 'jwtSecret').name;
    let resultData= await surveyDao.messageSave(formData);
    if(resultData==="suc"){
        res.status="success";
    }else {
        res.status="err";
    }
    return ctx.body=JSON.stringify(res);
});
router.post('/mesFind', async (ctx, next) => {
    let formData= ctx.request.body;
    let res= {};
    let resultData= await surveyDao.messageFind(formData);
    let reslen=resultData.length;
    let result= [];
    if(reslen>0){
        const cookies=ctx.header.cookie;
        const token=getCookie(cookies);
        const myuser=jwt.verify(token, 'jwtSecret').name;
        const myavatars= await userDao.informa(myuser);
        const myavatar=myavatars[0]._doc.avatar;
        for(let i=0;i<reslen;i++){
            try {
                if(resultData[i].name===myuser){
                    resultData[i]._doc.avatar=myavatar;
                    resultData[i]._doc.mtype="me";
                    result[reslen-i-1]=resultData[i];
                }else {
                    let  name=resultData[i]._doc.name;
                    let resultavatar= await userDao.informa(name);
                    resultData[i]._doc.avatar=resultavatar[0]._doc.avatar;
                    resultData[i]._doc.mtype="other";
                    result[reslen-i-1]=resultData[i];
                }
            }catch (e){
                console.log(e)
            }
        }
        res.data=result;
        res.status="success";
    }else if(reslen===0){
        res.status="null";
    }else{
        res.status="err";
    }
    return ctx.body=JSON.stringify(res);
});

module.exports = router;
