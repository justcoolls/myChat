
const chats={

    mesFind:   ()=>{
          fetch("/mychat/mesFind",{
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
            }).then(res=>{
                return res.json();
            }).then(data=>{
                if(data.status=="success"){                    // message.info('获取成功');
                    return (data.data);
                }else if(data.status=="null"){

                }
                else if(data.status=="err"){
                    // message.error('获取失败');
                }
            }).catch(err=>console.log(err));
    }
};

module.exports = chats;