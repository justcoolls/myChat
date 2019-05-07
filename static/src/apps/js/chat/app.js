import React from 'react';
import 'babel-polyfill'
import io from 'socket.io-client';
import './style.less';
import './../../../../public/icon/iconfont';
import Modal from'./../component/modal';
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
            groupAddModal:false,
            GroupInforShow:false,
        };
    }

    componentDidMount() {
        this.getInformation();
        this.getGroupList("initialize");
    };

    getInformation = () => {
        Service.getInformation()
            .then((res) => {
                this.setState({
                    name: res.name,
                    myAvatar: res.avatar
                })
            })
    };
    getGroupList = (e) => {
        Service.groupList()
            .then((res) => {
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
                if(e ==="add"){
                    groups[len-1].select=true;
                    this.setState({
                        groupList: groups,
                    }, () => {
                        this.groupOn(res.groups)
                    })
                } else{
                    groups[0].select=true;
                    this.setState({
                        groupList: groups,
                        mesGroup: groups[0].name,
                    }, () => {
                        this.groupOn(res.groups)
                    })
                }
                this.getMessageList();
            });
    };
    groupOn = (groups) => {
        let len = groups.length;
        if (len > 0) {
            for (let i = 0; i < len; i++) {
                socket.on(groups[i].name, msg => {
                    if (this.state.mesGroup === groups[i].name) {
                        groups[i].meslast = msg.name + ":" + msg.Mes;
                        let keys = this.state.messageList.length;
                        let messageData = {
                            _id: msg.name + keys,
                            name: msg.name,
                            myMes: msg.Mes,
                            type: "other",
                            avatar: msg.avatar
                        };
                        this.setState({
                            groupList: groups,
                            messageList: this.state.messageList.concat(messageData),
                        },() => {
                            this.messageBody.scrollTo({
                                top: this.messageBody.scrollHeight - this.messageBody.offsetHeight,
                                behavior: "smooth"
                            });
                        });
                    } else {
                        groups[i].meslast = msg.name + ":" + msg.Mes;
                        this.setState({
                            groupList: groups,
                        });
                    }
                });
            }

        }
    };
    groupClick = (item) => {
        const {groupList, mesGroup} = this.state;
        if (mesGroup !== item.name) {
            groupList.map((group, index) => {
                if (item.name === group.name) {
                    groupList[index].select = true;
                } else {
                    groupList[index].select = false;
                }
            });
            this.setState({
                groupList,
                mesGroup: item.name,
            },()=>{
                this.getMessageList()
            })
        }
    };
    getMessageList = () => {
        let data = {
            number: 20,
            group: this.state.mesGroup
        };
        Service.getMessageList(data).then((res) => {
            if (res.status === "success") {
                this.setState({
                    messageList: res.data || []
                }, () => {
                    this.messageBody.scrollTop=this.messageBody.scrollHeight-this.messageBody.offsetHeight;
                })

            } else if (res.status === "null") {
                this.setState({
                    messageList: []
                })
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
    showGroupAddModal=()=>{
        this.setState({
            groupAddModal:true
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
        const data={
            name:groupNameValue
        };
        Service.createGroup(data).then((res)=>{
            if(res.status===1){
                this.setState({
                    groupAddModal:false,
                    mesGroup: groupNameValue,
                },()=>{
                    this.getGroupList("add");
                });

            }
        });
    };
    groupNameKeyDown=(event)=>{
        if (event.keyCode || event.which === 13) {
            this.groupAdd();
        }
    };
    groupNameChange=(e)=>{
       this.setState({
           groupNameValue:e.target.value.trim()
       })
    };
    groupSettingShow=()=>{
        this.setState({
            GroupInforShow:true
        })
    };
    groupSettingHide=()=>{
        this.setState({
            GroupInforShow:false
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
    render() {
        const {groupList, messageList, inputValue,myAvatar,mesGroup,groupAddModal,groupNameValue,GroupInforShow} = this.state;
        return (
            <div className="chat-index">
                <div className="backBlur"/>
                <div className="chat-window">
                    <div className="chat-sider">
                        <img className="avatar" src={myAvatar}/>
                        <div  className="group-add" onClick={this.showGroupAddModal}>
                            <svg className="icon" aria-hidden="true">
                                <use xlinkHref="#icon-add"/>
                            </svg>
                        </div>
                        <Modal
                            title="新建分组"
                            visible={groupAddModal}
                            onOk={this.groupAdd}
                            onCancel={this.hideGroupAddModal}
                        >
                            <div>
                                <input value={groupNameValue}
                                       onKeyPress={this.groupNameKeyDown}
                                       onChange={this.groupNameChange}
                                       placeholder="请输入分组名称..."/>
                            </div>
                        </Modal>
                    </div>
                    <div className="chat-group">
                        {
                            groupList.map((item, index) => {
                                if (item) {
                                    if (item.type === "group") {
                                        return (
                                            <div key={item.key} className="chat-groupList"
                                                 onClick={() => this.groupClick(item, index)}
                                                 style={{backgroundColor: item.select? "#d6d6d6" : ""}}>
                                                <div className="group-img">
                                                    <img src={item.avatar}/>
                                                </div>
                                                <div>
                                                    <div className="group-name">{item.name}</div>
                                                    <div className='group-mes'>{item.meslast}</div>
                                                </div>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div key={item.key} className="chat-groupList">
                                                <div className="group-img">
                                                    <img src={item.avatar}/>
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
                                <div onClick={this.groupSettingShow} className="chat-header-set">...</div>
                            </div>
                        </div>
                        <GroupInfor
                            visible={GroupInforShow}
                            onCancel={this.groupSettingHide}
                            mesGroup={mesGroup}
                            outGroup={this.getGroupList}
                        />
                        <div ref={messageBody => this.messageBody = messageBody} className="message-body scrollbar">
                            {messageList.map((item) => {
                                let createTime = new Date(item.createTime);
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
                                            <div className="message-img">
                                                <img src={item.avatar}/>
                                            </div>

                                            <div className="message-dev">
                                                <div className="message-info">
                                                    <div className="message-name">{item.name}</div>
                                                    <div>{createTime.getHours() + ':' + createTime.getMinutes()}</div>
                                                </div>
                                                <div className="message-box">
                                                    <div className="message-before"/>
                                                    <div className="message-content" dangerouslySetInnerHTML={{  __html:this.replace_emoji(item.myMes) }}/>
                                                </div>
                                            </div>
                                        </div>
                                    )
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
            </div>
        )
    }
}

export default App;