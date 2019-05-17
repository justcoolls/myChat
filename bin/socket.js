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
            let sendMessage={};
            sendMessage.Mes=ctx.mes;
            sendMessage.group=ctx.group;
            sendMessage.name=name;
            sendMessage.createTime= new Date;
            await surveyDao.messageSave(sendMessage);
            let avatars= await userDao.userAvatar(name);
            sendMessage.avatar=avatars[0]._doc.avatar;
            //给除了自己以外的客户端广播消息
            socket.broadcast.emit(ctx.group,sendMessage);

        });
        await socket.on('privateChat', async (ctx) =>{
            let sendMessage={};
            sendMessage.Mes=ctx.mes;
            sendMessage.user=ctx.senduser;
            sendMessage.name=name;
            sendMessage.createTime= new Date;
            let avatars= await userDao.userAvatar(name);
            sendMessage.avatar=avatars[0]._doc.avatar;
            //给除了自己以外的客户端广播消息
            socket.broadcast.emit("PRI"+ctx.acceptuser,sendMessage);
        });
    }
};