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
            mesGroup:"",
            messageList:[],
            inputValue:""
        };
    }

    componentDidMount() {
        this.getGroupList()
        this.getMessage()
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
            this.setState({
                groupList:data.groups,
            },()=>{
                this.groupOn(data.groups)
            })


        }).catch(err=>console.log(err));
    };
    groupOn=(groups)=>{
        let len=groups.length;
        if(len>0){
            for (let i=0;i<len;i++){
                socket.on(groups[i].group, msg => {
                    if(this.state.mesGroup === groups[i].group){
                        groups[i].meslast=msg.name+":"+msg.Mes;
                        let keys=this.state.messageList.length;
                        let mydata={
                            _id: msg.name+keys,
                            name:msg.name,
                            myMes:msg.Mes,
                            mtype:"other",
                            avatar:msg.avatar
                        };
                        this.setState({
                            groupList:groups,
                            messageList:this.state.messageList.concat(mydata),
                        },()=> {

                        });
                    }else{
                        groups[i].meslast=msg.name+":"+msg.Mes;
                        this.setState({
                            groupList:groups,
                        });
                    }
                });
            }

        }
    };
    groupClick=(item)=>{
        const {groupList,mesGroup}=this.state;
        if(mesGroup!==item.name){
            groupList.map((group,index)=>{
                if(item.name ===group.name ){
                    groupList[index].status="select";
                }else {
                    groupList[index].status="null";
                }
            });
            this.setState({
                groupList,
                mesGroup:item.group
            })
        }
    };
    getMessage=(name)=>{
        let _data={
            number:20,
            group:"talk"
        };
        fetch("/myChat/messageList",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify(_data),
            credentials: 'include',
        }).then(res=>{
            return res.json();
        }).then(data=>{
            if(data.status==="success"){

                // let het =this.dom.scrollHeight;
                this.setState({
                    messageList: data.data||[]
                },()=> {
                    // if (mess.length<21){
                    //     this.dom.scrollTop=this.dom.scrollHeight-this.dom.offsetHeight;
                    // }else {
                    //     this.dom.scrollTop=this.dom.scrollHeight-het-5;
                    // }
                })

            }else if(data.status === "null"){
                this.setState({
                    messageList:[]
                })
            }
            else if(data.status === "err"){
            }
        }).catch(err=>console.log(err));
    };

    inputChange=(e)=>{
        this.setState({
            inputValue: e.target.value.trim()
        })
    };

    render() {
        const {groupList,messageList,inputValue}=this.state;
        return (
            <div className="chat-index">
                <div className="chat-window">
                    <div className="chat-sider"> </div>
                    <div className="chat-group">
                        {
                            groupList.map((item,index) => {
                                if(item){
                                    if(item.type === "group"){
                                        return(
                                            <div key ={item.key} className="chat-groupList" onClick={()=>this.groupClick(item,index)} style={{backgroundColor:item.status ==="select"?"#cecece":""}}>
                                                <div className="group-img">
                                                    <img style={{width: 50,height: 50,borderRadius: 12}} src={item.avatar} />
                                                </div>
                                                <div>
                                                    <div className="group-name">{item.name}</div>
                                                    <div  className='group-mes'>{item.meslast}</div>
                                                </div>
                                            </div>
                                        )
                                    }else {
                                        return(
                                            <div key ={item.key} className="chat-groupList">
                                                <div className="group-img">
                                                    <img style={{width: 50,height: 50,borderRadius: 12}} src={item.avatar} />
                                                </div>
                                                <div>
                                                    <div className="group-name">{item.name}</div>
                                                    <div  className='group-mes'>{item.meslast}</div>
                                                </div>

                                            </div>
                                        )
                                    }
                                }
                            })
                        }
                    </div>
                    <div className="chat-message">
                        <div className="message-body scrollbar">
                            {messageList.map((item)=>{
                                let createTime=new Date(item.createTime);
                                if(item.type === "me"){
                                    return (
                                        <div key={item.id} className="message-list">
                                            <div className="message-img">
                                                <img style={{width: 38,height: 38,borderRadius: 12}} src={item.avatar} />
                                            </div>

                                            <div className="message-dev">
                                                <div className="message-info">
                                                    <div className="message-name">{item.name}</div>
                                                    <div>{createTime.getHours()+':'+createTime.getMinutes()}</div>
                                                </div>

                                                <div className="message-content">{item.myMes}</div>
                                            </div>
                                        </div>
                                    )
                                }else {
                                    return (
                                        <div key={item.id} className="message-list">
                                            <div className="message-img">
                                                <img style={{width: 38,height: 38,borderRadius: 12}} src={item.avatar} />
                                            </div>

                                            <div className="message-dev">
                                                <div className="message-info">
                                                    <div className="message-name">{item.name}</div>
                                                    <div>{createTime.getHours()+':'+createTime.getMinutes()}</div>
                                                </div>

                                                <div className="message-content">{item.myMes}</div>
                                            </div>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                        <div className="message-in">
                            <input value={inputValue} onChange={this.inputChange} placeholder="请输入..."/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;