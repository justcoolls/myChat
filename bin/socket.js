const surveyDao= require('../dao/surveyDao');
const userDao = require('../dao/userDao');

module.exports={
    conn:async (socket)=>{
        // console.log(io.eio.clientsCount);// 链接数量
        // console.log(socket.adapter.rooms); // 所有房间
        // console.log(socket.nsp.connected); // 所有链接
        let name;
        try {
            name=socket.decoded_token.name;
        }catch (e){
            console.log(e)
        }
        // console.log("客户端建立连接");
        socket.send("你好");
        socket.on("disconnect", function () {
            console.log("客户端断开连接.");
        });
        await socket.on('chats', async (ctx) =>{
            let sendmes=new Object();
            sendmes.Mes=ctx.mes;
            sendmes.group=ctx.group;
            sendmes.name=name;
            await surveyDao.messageSave(sendmes);
            let myavatars= await userDao.informa(name);
            let myavatar=myavatars[0]._doc.avatar;
            sendmes.avatar=myavatar;
            //给除了自己以外的客户端广播消息
            socket.broadcast.emit(ctx.group,sendmes);

        });
        await socket.on('privatechat', async (ctx) =>{
            let sendmes=new Object();
            sendmes.Mes=ctx.mes;
            sendmes.user=ctx.senduser;
            sendmes.name=name;
            let myavatars= await userDao.informa(name);
            let myavatar=myavatars[0]._doc.avatar;
            sendmes.avatar=myavatar;
            //给除了自己以外的客户端广播消息
            socket.broadcast.emit("pri"+ctx.acceptuser,sendmes);
        });
    }
};