import React from 'react';
import 'babel-polyfill'
import io from 'socket.io-client';
import './style.less'
const socket = io(window.location.host,{
    query: 'token=' + getCookie(),
});
function getCookie()
{
    let arr,reg=new RegExp("(^| )"+'token'+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
class App extends React.Component {
    constructor() {
        super();
        this.state = {
            groupList:[],
        };
    }

    componentDidMount() {
        this.getGroupList()
    };
    getGroupList=()=>{
        fetch("/groupList",{
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
        }).then(res=>{
            return res.json();
        }).then(data=>{

            this.groupOn(data.groups)

        }).catch(err=>console.log(err));
    };
    groupOn=(data)=>{
        let len=data.length;
        if(len>0){
            for (let i=0;i<len;i++){
                socket.on(data[i].group, msg => {
                    if(this.state.masgroup === data[i].group){
                        let keys=this.state.mess.length;
                        let mydata={
                            _id: msg.name+keys,
                            name:msg.name,
                            myMes:msg.Mes,
                            mtype:"other",
                            avatar:msg.avatar
                        };
                        data[i].meslast=msg.name+":"+msg.Mes;
                        this.setState({
                            groupList:data,
                            mess:this.state.mess.concat(mydata),
                        },()=> {
                            let  nowheight=this.dom.scrollHeight-this.dom.offsetHeight;
                            let  altitude= nowheight-this.dom.scrollTop;
                            if(altitude<100){
                                this.dom.scrollTop=nowheight;
                            }

                        });
                    }else{
                        data[i].Badge++;
                        data[i].meslast=msg.name+":"+msg.Mes;
                        this.setState({
                            groupList:data,
                        });
                    }
                });
            }

        }
        let user=document.getElementById("username").innerHTML;
        socket.on("pri"+user, msg => {
            let privateMes=this.state.pridata;
            let keys=privateMes.length;
            let pridata={
                _id: msg.name+keys,
                name:msg.name,
                myMes:msg.Mes,
                mtype:"other",
                avatar:msg.avatar
            };
            privateMes.push(pridata);
            this.setState({
                pridata:privateMes
            });

            let pricontain=this.pricontain(msg.name);
            if(pricontain==="none"){
                let pCgroupname=msg.name;
                let pCgroupava=msg.avatar;
                let groupLists=this.state.groupList;
                let grouplilen=groupLists.length;
                let pChatgroup={group: pCgroupname, Badge: 1, key: grouplilen, avatar: pCgroupava,type:"privatechat", meslast:msg.Mes};
                groupLists.push(pChatgroup);
                this.setState({
                    groupList:groupLists,
                })
            }else {
                if(this.state.masgroup===msg.name && this.state.chatway==="privatechat"){
                    let mydata=[{
                        _id: msg.name+keys,
                        name:msg.name,
                        myMes:msg.Mes,
                        mtype:"other",
                        avatar:msg.avatar
                    }];
                    //last消息显示在组
                    let groupname=this.state.masgroup;
                    let groupdata=this.state.groupList;
                    let len=groupdata.length;
                    for(let i=0;i<len;i++){
                        if(groupdata[i].group===groupname && groupdata[i].type===this.state.chatway){
                            groupdata[i].meslast=msg.Mes;
                        }
                    }
                    //
                    this.setState({
                        mess:this.state.mess.concat(mydata),
                    },()=> {
                        let  nowheight=this.dom.scrollHeight-this.dom.offsetHeight;
                        let  altitude= nowheight-this.dom.scrollTop;
                        if(altitude<100){
                            this.dom.scrollTop=nowheight;
                        }

                    });

                }else{
                    let groupnames=msg.name;
                    let groupdatas=this.state.groupList;
                    let len=groupdatas.length;
                    for(let i=0;i<len;i++){
                        if(groupdatas[i].group===groupnames && groupdatas[i].type==="privatechat"){
                            groupdatas[i].meslast=msg.Mes;
                            groupdatas[i].Badge++;
                        }
                    }
                    this.setState({
                        groupList:groupdatas
                    })
                }
            }

        });
    };


    render() {
        return (
            <div className="chat-index">
                <div className="chat-window">
                    <div className="chat-sider"> </div>
                    <div className="chat-group">
                        <div className="mes-group"> 111</div>
                        <div className="mes-group"> 222</div>
                        <div className="mes-group"> 333</div>
                    </div>
                    <div className="mes-body"> </div>
                </div>
            </div>
        )
    }
}

export default App;