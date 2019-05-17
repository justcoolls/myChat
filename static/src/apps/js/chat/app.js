import React from 'react';
import 'babel-polyfill'
import io from 'socket.io-client';
import './style.less';
import './../../../../public/icon/iconfont';
import Modal from'./../component/modal';
import rcAlert from 'rc-alert';
import GroupInfor from'./../groupInfor';
import Emoji from '../emoji/index';
import emojiTrans from '../emoji/emojiTrans';

const socket = io(window.location.host, {
    query: 'token=' + getCookie(),
});
import Service from '../../../service/chat/index'

function getCookie() {
    let arr, reg = new RegExp("(^| )" + 'token' + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            name:"",
            groupList: [],
            mesGroup: "talk",
            messageList: [],
            inputValue: "",
            groupNameValue: "",
            myAvatar: "",
            chatWay:"crowd",
            groupCreateModal:false,
            groupAddModal:false,
            groupInforShow:false,
            groupHandle:false,
            memberChatModal:false,
            memberChatItem:{}
        };
    }

    componentDidMount() {
        this.getInformation();
    };

    getInformation = () => {
        Service.getInformation()
            .then((res) => {
                this.setState({
                    name: res.name,
                    myAvatar: res.avatar
                },()=>{
                    this.getGroupList("initialize");
                })
            })
    };
    getGroupList = (e) => {
        const groupList=this.state.groupList;
        Service.groupList()
            .then((res) => {
                if(res.status !== 1){
                    rcAlert.error("拉取分组列表失败");
                    return false;
                }
                const groups=res.groups;
                const len =groups.length;
                if(len<1){
                    this.setState({
                        groupList: [],
                        mesGroup: '',
                        messageList: []
                    });
                    return false
                }
                if(e ==="join"){
                    const groupListlen=groupList.length;
                    for(let i=0;i<groupListlen;i++){
                        groupList[i].select=false;
                    }
                    groups[len-1].select=true;
                    const newGroups=groupList.concat(groups[len-1]);
                    this.setState({
                        groupList: newGroups,
                    }, () => {
                        this.groupOn(newGroups)
                    })
                } else{
                    groups[0].select=true;
                    this.setState({
                        groupList: groups,
                        mesGroup: groups[0].name,
                    }, () => {
                        this.groupOn(groups)
                    })
                }
                this.getMessageList();
            });
    };
    groupOn = (groups) => {
        let len = groups.length;
        const user=this.state.name;
        if (len > 0) {
            for (let i = 0; i < len; i++) {
                if(groups[i].type=== "group"){
                    socket.on(groups[i].name, msg => {
                        if (this.state.mesGroup === groups[i].name) {
                            groups[i].meslast = msg.name + ":" + msg.Mes;
                            groups[i].badge = 0;
                            let keys = this.state.messageList.length;
                            let messageData = {
                                id: msg.name + keys,
                                name: msg.name,
                                myMes: msg.Mes,
                                type: "other",
                                avatar: msg.avatar,
                                createTime: msg.createTime,
                            };
                            this.setState({
                                groupList: groups,
                                messageList: this.state.messageList.concat(messageData),
                            },() => {
                                const  height=this.messageBody.scrollHeight-this.messageBody.offsetHeight;
                                const  altitude= height-this.messageBody.scrollTop;
                                if(altitude<300){
                                    this.messageBody.scrollTo({
                                        top: height,
                                        behavior: "smooth"
                                    });
                                }
                            });
                        } else {
                            groups[i].meslast = msg.name + ":" + msg.Mes;
                            if(!groups[i].badge){
                                groups[i].badge=0;
                            }
                            groups[i].badge +=1;
                            this.setState({
                                groupList: groups,
                            });
                        }
                    });
                }
            }
        }
        socket.on("PRI"+user, msg => {
            for(let i=0;i<len;i++){
                if(groups[i].type==='private' && msg.name === groups[i].name){
                    groups[i].meslast = msg.name + ":" + msg.Mes;
                    let keys = this.state.messageList.length;
                    let messageData = {
                        id: msg.name + keys,
                        name: msg.name,
                        myMes: msg.Mes,
                        type: "other",
                        avatar: msg.avatar,
                        createTime: msg.createTime,
                    };
                    const messageList= this.state.messageList.concat(messageData);
                    if(this.state.mesGroup === groups[i].name){
                        this.setState({
                            messageList: messageList,
                        },() => {
                            const  height=this.messageBody.scrollHeight-this.messageBody.offsetHeight;
                            const  altitude= height-this.messageBody.scrollTop;
                            if(altitude<300){
                                this.messageBody.scrollTo({
                                    top: height,
                                    behavior: "smooth"
                                });
                            }
                        });
                    }else {
                        if(!groups[i].badge){
                            groups[i].badge=0;
                        }
                        groups[i].badge +=1;
                        this.setState({
                            groupList: groups,
                        });
                    }
                }

            }
        });
    };
    groupClick = (item) => {
        const {groupList, mesGroup} = this.state;
        if (mesGroup !== item.name) {
            groupList.map((group, index) => {
                if (item.name+item.type === group.name+group.type) {
                    groupList[index].select = true;
                    groupList[index].badge = 0;
                } else {
                    groupList[index].select = false;
                }
            });
            this.setState({
                groupList,
                mesGroup: item.name,
            },()=>{
                if(item.type ==='group'){
                    this.setState({
                        chatWay:'crowd',
                    },()=>{
                        this.getMessageList()
                    });

                }else {
                    this.setState({
                        messageList: [],
                        chatWay:'private',
                    },()=>{
                        this.getLocalMessageList(item.name)
                    });

                }
            })
        }
    };
    getLocalMessageList=(name)=>{

    };
    getMessageList = () => {
        let data = {
            number: 20,
            group: this.state.mesGroup
        };
        Service.getMessageList(data).then((res) => {
            if(res.status === 0){
                rcAlert.error(res.mes);
                return false;
            }
            if (res.status === 1) {
                this.setState({
                    messageList: res.data || []
                }, () => {
                    this.messageBody.scrollTop=this.messageBody.scrollHeight-this.messageBody.offsetHeight;
                })

            } else if(res.status === 0){
                rcAlert.error(res.mes);
                this.setState({
                    messageList: []
                });
                return false;
            }else {
                // rcAlert.info(res.mes);
                this.setState({
                    messageList: []
                });
            }
        });
    };

    inputChange = (e) => {
        this.setState({
            inputValue: e.target.value.trim()
        })
    };
    inputKeyDown = (event) => {
        if (event.keyCode || event.which === 13) {
            const {myAvatar, mesGroup, messageList,groupList,inputValue,name} = this.state;
            if (inputValue === "") {
                return false;
            }
            let len = messageList.length;
            let message = {
                avatar: myAvatar,
                createTime: new Date,
                group: mesGroup,
                id: len,
                myMes: inputValue,
                type: "me",
            };
            const  groupLen = groupList.length;
            for (let i=0;i<groupLen;i++){
                if(mesGroup === groupList[i].name){
                    groupList[i].meslast =name + ":" + inputValue;
                    break;
                }
            }

            this.setState({
                groupList,
                messageList: messageList.concat(message),
                inputValue:''
            }, () => {
                this.messageBody.scrollTo({
                    top: this.messageBody.scrollHeight - this.messageBody.offsetHeight,
                    behavior: "smooth"
                });
            });

            this.sendMessage(inputValue);
        }
    };
    sendMessage = (myMes) => {
        if (this.state.chatWay === "crowd") {
            socket.emit('chats', {mes: myMes, group: this.state.mesGroup});
        } else {
            socket.emit('privateChat', {mes: myMes, acceptuser: this.state.mesGroup});
        }
    };
    //groupHandle
    groupHandle=(event)=>{
        const {groupHandle}=this.state;
        if(groupHandle){
            this.setState({
                groupHandle:false
            })
        }else {
            this.setState({
                groupHandle:true
            })
        }
        this.stopBubble(event);
        document.addEventListener('click',this.groupHandleHide,false);
    };
    groupHandleHide=()=>{
        this.setState({
            groupHandle:false
        });
        document.removeEventListener('click',this.hide,false)
    };
    groupOperation=(event)=>{
        this.stopBubble(event);
    };
    stopBubble=(event)=>{
        if(event && event.stopPropagation){
            event.preventDefault();
            event.stopPropagation();
            event.nativeEvent.stopImmediatePropagation();
        }else{
            window.event.cancelBubble=true; //IE
        }
    };
    //groupCreate
    showGroupCreateModal=()=>{
        this.setState({
            groupCreateModal:true,
            groupHandle:false
        })
    };
    hideGroupCreateModal=()=>{
        this.setState({
            groupNameValue: "",
            groupCreateModal:false
        })
    };
    groupCreate=()=>{
        const {groupNameValue}=this.state;
        if(!groupNameValue){
            alert("请输入name");
            return false;
        }
        const data={
            name:groupNameValue
        };
        Service.createGroup(data).then((res)=>{
            if(res.status===1){
                this.setState({
                    groupCreateModal:false,
                    mesGroup: groupNameValue,
                },()=>{
                    this.getGroupList("join");
                });
            }else {
                rcAlert.error(res.mes)
            }
        });
    };
    groupNameCreateKeyDown=(event)=>{
        if (event.keyCode || event.which === 13) {
            this.groupCreate();
        }
    };
    groupNameChange=(e)=>{
       this.setState({
           groupNameValue:e.target.value.trim()
       })
    };
    //groupAdd
    showGroupAddModal=()=>{
        this.setState({
            groupAddModal:true,
            groupHandle:false
        })
    };
    hideGroupAddModal=()=>{
        this.setState({
            groupNameValue: "",
            groupAddModal:false
        })
    };
    groupAdd=()=>{
        const {groupNameValue}=this.state;
        if(!groupNameValue){
            alert("请输入name");
            return false;
        }
        const data={
            name:groupNameValue
        };
        Service.addGroup(data).then((res)=>{
            if(res.status===1){
                this.setState({
                    groupAddModal:false,
                    mesGroup: groupNameValue,
                },()=>{
                    this.getGroupList("join");
                });
            }else {
                rcAlert.error(res.mes)
            }
        });
    };
    groupNameAddKeyDown=(event)=>{
        if (event.keyCode || event.which === 13) {
            this.groupAdd();
        }
    };
    //group-information
    groupSettingShow=()=>{
        this.setState({
            groupInforShow:true
        })
    };
    groupSettingHide=()=>{
        this.setState({
            groupInforShow:false
        })
    };

    emojiChoose=(title)=>{
        if(!title){
            return false;
        }
        const value = this.state.inputValue;
        const inputValue =value+"["+title+"]";
        this.setState({
            inputValue
        });
        document.getElementById("message-in").focus();
    };
    replace_emoji=(item)=>{
        return emojiTrans.emojishow(item);
    };
    memberClick=(item)=>{
        // this.setState({
        //     memberChatItem:item,
        //     memberChatModal:true
        // })
    };
    memberChatSubmit=()=>{
        const item=this.state.memberChatItem;
        const groupList=this.state.groupList;
        const privateChat={
            avatar: item.avatar,
            meslast: "",
            name: item.name,
            type: "private",
        };
        let objs = {};
        let groupLists=groupList.concat(privateChat);
        groupLists = groupLists.reduce((cur,next) => {
            objs[next.name] ? "" : objs[next.name] = true && cur.push(next);
            return cur;
        },[]);
        this.setState({
            groupList:groupLists,
            mesGroup:item.name,
            chatWay:'private',
            messageList: [],
            memberChatModal:false
        });
    } ;
    memberChatCancel=()=>{
        this.setState({
            memberChatModal:false
        })
    };

    render() {
        const {chatWay,groupList, messageList, inputValue,myAvatar,mesGroup,groupCreateModal,groupAddModal,groupNameValue,groupInforShow,groupHandle,memberChatModal} = this.state;
        return (
            <div className="chat-index">
                <div className="backBlur"/>
                <div className="chat-window">
                    <div className="chat-sider">
                        <img className="avatar" src={myAvatar}/>
                        <div  className="group-add" onClick={this.groupHandle}>
                            <svg className="icon" aria-hidden="true">
                                <use xlinkHref="#icon-add"/>
                            </svg>
                        </div>
                        <div className="group-operation" onClick={this.groupOperation} style={{width:groupHandle?115:0}}>
                            <div className="group-body">
                                <div className="operation-before"/>
                                <div className="operation-content">
                                    <div style={{marginBottom:5}}>
                                        <button onClick={this.showGroupCreateModal} type="button" className="btn btn-primary">
                                            <span>创建群组</span>
                                        </button>
                                    </div>
                                    <biv>
                                        <button onClick={this.showGroupAddModal} type="button" className="btn btn-primary">
                                            <span>加入群组</span>
                                        </button>
                                    </biv>
                                </div>
                            </div>
                        </div>
                        <div onClick={this.groupOperation}>
                            <Modal
                                title="新建分组"
                                visible={groupCreateModal}
                                onOk={this.groupCreate}
                                onCancel={this.hideGroupCreateModal}
                            >
                                <div>
                                    <input value={groupNameValue}
                                           onKeyPress={this.groupNameCreateKeyDown}
                                           onChange={this.groupNameChange}
                                           placeholder="请输入分组名称..."/>
                                </div>
                            </Modal>
                            <Modal
                                title="加入分组"
                                visible={groupAddModal}
                                onOk={this.groupAdd}
                                onCancel={this.hideGroupAddModal}
                            >
                                <div>
                                    <input value={groupNameValue}
                                           onKeyPress={this.groupNameAddKeyDown}
                                           onChange={this.groupNameChange}
                                           placeholder="请输入分组名称..."/>
                                </div>
                            </Modal>
                        </div>

                    </div>
                    <div className="chat-group">
                        {
                            groupList.map((item, index) => {
                                if (item) {
                                    if (item.type === "group") {
                                        return (
                                            <div key={index} className="chat-groupList"
                                                 onClick={() => this.groupClick(item, index)}
                                                 style={{backgroundColor: item.select? "#d6d6d6" : ""}}>
                                                <div className="group-img">
                                                    <img src={item.avatar}/>
                                                    {item.badge?<sup className="group-badge">{item.badge}</sup>:""}
                                                </div>
                                                <div>
                                                    <div className="group-name">{item.name}</div>
                                                    <div className='group-mes'>{item.meslast}</div>
                                                </div>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div key={index} className="chat-groupList"
                                                 onClick={() => this.groupClick(item, index)}
                                                 style={{backgroundColor: item.select? "#d6d6d6" : ""}}>
                                                <div className="group-img">
                                                    <img src={item.avatar}/>
                                                    {item.badge?<sup className="group-badge">{item.badge}</sup>:""}
                                                </div>
                                                <div>
                                                    <div className="group-name">{item.name}</div>
                                                    <div className='group-mes'>{item.meslast}</div>
                                                </div>
                                            </div>
                                        )
                                    }
                                }
                            })
                        }
                    </div>
                    <div className="chat-message">
                        <div className="chat-header" >
                            <div className="chat-header-groupName">{mesGroup}</div>
                            <div className=" chat-header-right">
                                {chatWay === 'crowd'?<div onClick={this.groupSettingShow} className="chat-header-set">...</div>:""}
                            </div>
                        </div>
                        <GroupInfor
                            visible={groupInforShow}
                            onCancel={this.groupSettingHide}
                            mesGroup={mesGroup}
                            outGroup={this.getGroupList}
                        />
                        <div ref={messageBody => this.messageBody = messageBody} className="message-body scrollbar">
                            {messageList.map((item) => {
                                if(item){
                                    const createTime = new Date(item.createTime);
                                    if (item.type === "me") {
                                        return (
                                            <div key={item.id} className="message-list-me">
                                                <div className="message-dev">
                                                    <div className="message-info">
                                                        <div className="message-time">{createTime.getHours() + ':' + createTime.getMinutes()}</div>
                                                    </div>
                                                    <div className="message-box">
                                                        <div className="message-content" dangerouslySetInnerHTML={{  __html:this.replace_emoji(item.myMes) }}/>
                                                        <div className="message-after"/>
                                                    </div>
                                                </div>
                                                <div className="message-img">
                                                    <img src={item.avatar}/>
                                                </div>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div key={item.id} className="message-list-other">
                                                <div className="message-img" onClick={()=>this.memberClick(item)}>
                                                    <img src={item.avatar}/>
                                                </div>

                                                <div className="message-dev">
                                                    <div className="message-info">
                                                        <div className="message-name">{item.name}</div>
                                                        <div className="message-time">{createTime.getHours() + ':' + createTime.getMinutes()}</div>
                                                    </div>
                                                    <div className="message-box">
                                                        <div className="message-before"/>
                                                        <div className="message-content" dangerouslySetInnerHTML={{  __html:this.replace_emoji(item.myMes) }}/>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                }

                            })}
                        </div>
                        <div className="message-in">
                            <input id="message-in" value={inputValue} onChange={this.inputChange} onKeyPress={this.inputKeyDown}
                                   placeholder="请输入..."/>
                            <div>
                                <Emoji
                                    onOk={this.emojiChoose}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    // title="发起聊天"
                    visible={memberChatModal}
                    onOk={this.memberChatSubmit}
                    onCancel={this.memberChatCancel}
                >
                    <div>
                        发起聊天
                    </div>
                </Modal>
            </div>
        )
    }
}

export default App;