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
router.post('/messageList', async (ctx, next) => {
    let formData= ctx.request.body;
    let res= {};
    let resultData= await surveyDao.messageFind(formData);
    let reslen=resultData.length;
    let result= [];
    if(reslen>0){
        const cookies=ctx.header.cookie;
        const token=getCookie(cookies);
        const user=jwt.verify(token, 'jwtSecret').name;
        const myAvatars= await userDao.userAvatar(user);
        const myAvatar=myAvatars[0].avatar;
        for(let i=0;i<reslen;i++){
            if(resultData[i].name===user){
                let messageItem={};
                messageItem.avatar=myAvatar;
                messageItem.type="me";
                messageItem.createTime=resultData[i].createTime;
                messageItem.group=resultData[i].group;
                messageItem.myMes=resultData[i].myMes;
                messageItem.name=resultData[i].name;
                messageItem.id=resultData[i]._id;
                result[reslen-i-1]=messageItem;
            }else {
                try {
                    let  name=resultData[i]._doc.name;
                    let resultAvatar= await userDao.userAvatar(name);
                    let messageItem={};
                    messageItem.avatar=resultAvatar[0]._doc.avatar;
                    resultData[i]._doc.type="other";
                    messageItem.createTime=resultData[i].createTime;
                    messageItem.group=resultData[i].group;
                    messageItem.myMes=resultData[i].myMes;
                    messageItem.name=resultData[i].name;
                    messageItem.id=resultData[i]._id;
                    result[reslen-i-1]=messageItem;
                }catch (e){
                    console.log(e)
                }
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
