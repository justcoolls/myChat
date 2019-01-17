import React from 'react';
import {Input, Icon, Row, Col, message, Avatar, Popover, Tooltip, Badge, Tabs, Button, Popconfirm} from 'antd';
import io from 'socket.io-client';
import UserInfor from './userInformation';
import GroupInfo from './groupInfo';

import './style.css'
const emoji = require('./emoji');
const socket = io('http://127.0.0.1:3001', {
    query: 'token=' + getCookie(),
});
const Search = Input.Search;

function getCookie() {
    let arr, reg = new RegExp("(^| )" + 'token' + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

class App extends React.Component {
    state = {
        avatar: '',
        groupList: [],
        mess: [],
        masState: "chatwindow",
        masGroup: "",
        visible: false,
        groupSelMark: 'none',
        groupSearch: 'none',
        groupSearchName: '',
        groupCreate: 'none',
        groupAdd: 'none',

        chatWay: "crowd",
        priData: [],

        userAvatar: '',
        userName: '',
    };

    componentDidMount() {
        this.getGroupList();

    };
    getGroupList = () => {
        fetch("/ugroupfind", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
        }).then(res => {
            return res.json();
        }).then(data => {
            this.setState({
                groupList: data.groups
            }, () => {
                this.groupOn(data.groups)
            });
        }).catch(err => console.log(err));
    };
    groupOn = (data) => {
        let len = data.length;
        if (len > 0) {
            for (let i = 0; i < len; i++) {
                socket.on(data[i].group, msg => {
                    if (this.state.masGroup === data[i].group) {
                        let keys = this.state.mess.length;
                        let mydata = {
                            _id: msg.name + keys,
                            name: msg.name,
                            myMes: msg.Mes,
                            mtype: "other",
                            avatar: msg.avatar
                        };
                        data[i].meslast = msg.name + ":" + msg.Mes;
                        this.setState({
                            groupList: data,
                            mess: this.state.mess.concat(mydata),
                        }, () => {
                            let nowheight = this.dom.scrollHeight - this.dom.offsetHeight;
                            let altitude = nowheight - this.dom.scrollTop;
                            if (altitude < 100) {
                                this.dom.scrollTop = nowheight;
                            }

                        });
                    } else {
                        data[i].Badge++;
                        data[i].meslast = msg.name + ":" + msg.Mes;
                        this.setState({
                            groupList: data,
                        });
                    }
                });
            }

        }
        let user = document.getElementById("userName").innerHTML;
        socket.on("pri" + user, msg => {
            let privateMes = this.state.priData;
            let keys = privateMes.length;
            let priData = {
                _id: msg.name + keys,
                name: msg.name,
                myMes: msg.Mes,
                mtype: "other",
                avatar: msg.avatar
            };
            privateMes.push(priData);
            this.setState({
                priData: privateMes
            });

            let pricontain = this.pricontain(msg.name);
            if (pricontain === "none") {
                let pCgroupname = msg.name;
                let pCgroupava = msg.avatar;
                let groupLists = this.state.groupList;
                let grouplilen = groupLists.length;
                let pChatgroup = {
                    group: pCgroupname,
                    Badge: 1,
                    key: grouplilen,
                    avatar: pCgroupava,
                    type: "privatechat",
                    meslast: msg.Mes
                };
                groupLists.push(pChatgroup);
                this.setState({
                    groupList: groupLists,
                })
            } else {
                if (this.state.masGroup === msg.name && this.state.chatWay === "privatechat") {
                    let mydata = [{
                        _id: msg.name + keys,
                        name: msg.name,
                        myMes: msg.Mes,
                        mtype: "other",
                        avatar: msg.avatar
                    }];
                    //last消息显示在组
                    let groupname = this.state.masGroup;
                    let groupdata = this.state.groupList;
                    let len = groupdata.length;
                    for (let i = 0; i < len; i++) {
                        if (groupdata[i].group === groupname && groupdata[i].type === this.state.chatWay) {
                            groupdata[i].meslast = msg.Mes;
                        }
                    }
                    //
                    this.setState({
                        mess: this.state.mess.concat(mydata),
                    }, () => {
                        let nowheight = this.dom.scrollHeight - this.dom.offsetHeight;
                        let altitude = nowheight - this.dom.scrollTop;
                        if (altitude < 100) {
                            this.dom.scrollTop = nowheight;
                        }

                    });

                } else {
                    let groupnames = msg.name;
                    let groupdatas = this.state.groupList;
                    let len = groupdatas.length;
                    for (let i = 0; i < len; i++) {
                        if (groupdatas[i].group === groupnames && groupdatas[i].type === "privatechat") {
                            groupdatas[i].meslast = msg.Mes;
                            groupdatas[i].Badge++;
                        }
                    }
                    this.setState({
                        groupList: groupdatas
                    })
                }
            }

        });
    };

    pricontain = (name) => {
        let groupl = this.state.groupList;
        let len = groupl.length;
        for (let i = 0; i < len; i++) {
            if (groupl[i].group === name && groupl[i].type === "privatechat") {
                return "contain"
            }
        }
        return "none"
    };

    groupClick = (item) => {
        if (this.state.masGroup !== item.group || item.type !== this.state.chatWay) {
            let groupList = this.state.groupList;
            let len = groupList.length;
            for (let i = 0; i < len; i++) {
                if (groupList[i].key === item.key) {
                    groupList[i].Badge = 0;
                }
            }
            if (item.type === "crowd") {
                this.setState({
                    chatWay: "crowd",
                    masState: 'chatwindow',
                    masGroup: item.group,
                    mess: []
                }, () => {
                    this.selGroup(item.group)
                })
            } else {
                this.setState({
                    chatWay: "privatechat",
                    masState: 'chatwindow',
                    masGroup: item.group,
                    mess: []
                }, () => {
                    this.getprimes(item.group);
                })
            }

        }


    };
    getprimes = (item) => {
        let priData = this.state.priData;
        let prilen = priData.length;
        let mess = [];
        for (let i = 0; i < prilen; i++) {
            if (priData[i].name === item) {
                mess.push(priData[i])
            }
        }

        let het = this.dom.scrollHeight;
        this.setState({
            mess: mess
        }, () => {
            if (mess.length < 21) {
                this.dom.scrollTop = this.dom.scrollHeight - this.dom.offsetHeight;
            } else {
                this.dom.scrollTop = this.dom.scrollHeight - het - 5;
            }
        })
    };
    selGroup = (item) => {

        this.getmessage(20, item);
        this.dom.onscroll = function () {
            if (this.state.chatWay === "crowd") {
                let scrollTop = this.dom.scrollTop;
                let count = 1;
                if (scrollTop === 0 && this.dom.scrollHeight > this.dom.offsetHeight) {
                    let counts = count * 20 + 20;
                    this.getmessage(counts, item);
                    count++;
                }
            }

        }.bind(this);
    };

    getmessage = (counts, item) => {
        let _data = {
            mess: counts,
            group: item
        };
        fetch("/mychat/mesFind", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(_data),
            credentials: 'include',
        }).then(res => {
            return res.json();
        }).then(data => {
            if (data.status === "success") {
                this.showmessage(data.data);
            } else if (data.status === "null") {
                this.setState({
                    mess: []
                })
            }
            else if (data.status === "err") {
            }
        }).catch(err => console.log(err));
    };


    inputKeyDown = () => {
        let myInput = document.getElementById("myInput");
        let myravatar = document.getElementById("userAvatar").src;
        let myMes = myInput.value;
        let keys = this.state.mess.length;
        let mydata = [{
            _id: "n" + keys,
            myMes: myMes,
            mtype: "me",
            avatar: myravatar
        }];
        if (myMes !== "") {
            myInput.value = "";
            this.setState({
                mess: this.state.mess.concat(mydata),
            }, () => {
                this.dom.scrollTop = this.dom.scrollHeight - this.dom.offsetHeight;
            });

            this.sendMessage(myMes);
            //本地消息显示在组
            let user = document.getElementById("userName").innerHTML;
            let groupname = this.state.masGroup;
            let groupdata = this.state.groupList;
            let len = groupdata.length;
            for (let i = 0; i < len; i++) {
                if (groupdata[i].group === groupname && groupdata[i].type === this.state.chatWay) {
                    groupdata[i].meslast = user + ":" + myMes;
                }
            }
        }

    };


    sendMessage = (myMes) => {
        if (this.state.chatWay === "crowd") {
            socket.emit('chats', {mes: myMes, group: this.state.masGroup});
        } else {
            socket.emit('privatechat', {mes: myMes, acceptuser: this.state.masGroup});
            //本地记录私信
            let privateMes = this.state.priData;
            let keys = privateMes.length;
            let groupname = this.state.masGroup;
            let myravatar = document.getElementById("userAvatar").src;
            let priData = {
                _id: groupname + keys,
                name: groupname,
                myMes: myMes,
                mtype: "me",
                avatar: myravatar
            };
            privateMes.push(priData);
            this.setState({
                // priData:privateMes
            });
        }
    };
    showmessage = (mess) => {
        let het = this.dom.scrollHeight;
        this.setState({
            mess: mess
        }, () => {
            if (mess.length < 21) {
                this.dom.scrollTop = this.dom.scrollHeight - this.dom.offsetHeight;
            } else {
                this.dom.scrollTop = this.dom.scrollHeight - het - 5;
            }
        })
    };
    // emoji
    emojis = (data) => {
        if (data) {
            return data.map((row) => {
                let datas = [];
                row.children.map((item) => {
                    datas.push(<div className="emojisel" onClick={this.emojisel.bind(this, item.title)}
                                    style={{display: 'inline-block', margin: 5}} key={item.title}><Tooltip
                        overlayStyle={{color: '#eee'}} placement="bottom" title={item.title}><img
                        style={{width: 35, height: 35}} src={item.url}/></Tooltip></div>)
                });
                return <div style={{width: 500}} key={row.key}>{datas}</div>
            });
        }
    };

    emojisel = (i) => {
        let myInput = document.getElementById("myInput");
        myInput.value += "[" + i + "]";
        this.setState({
            visible: false,
        });

        myInput.focus();
    };
    handleVisibleChange = (visible) => {
        this.setState({visible});
    };

    replace_emoji = (item) => {
        return emoji.emojishow(item);
    };
    privateChat = () => {

    };

    group_c_add = () => {
        return (
            <div>
                <a className="group-ac" onClick={this.groupCreateshow}>创建组</a>
                <a className="group-ac" onClick={this.groupAddshow}>加入组</a>
            </div>
        )
    };
    groupCreateshow = () => {
        this.setState({
            groupSearch: 'block',
            groupCreate: 'block',
            groupAdd: 'none',
            groupSearchName: '创建群',
            groupSelMark: 'block'
        })
    };
    groupAddshow = () => {
        this.setState({
            groupSearch: 'block',
            groupCreate: 'none',
            groupAdd: 'block',
            groupSearchName: '加入群',
            groupSelMark: 'block'
        })
    };
    groupCreate = (e) => {
        let _data = {
            name: e.trim(),
        };

        fetch("/group/createGroup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(_data),
            credentials: 'include',
        }).then(res => {
            return res.json();
        }).then(data => {
            if (data.status === "success") {
                this.getGroupList();
                message.info('创建成功');
            } else if (data.status === "exist") {
                message.info('群组已存在');
            }
            else if (data.status === "err") {
                message.info('创建失败');
            } else if (data.status === "limit") {
                message.info('每个用户最多只能创建2个群');
            }
        }).catch(err => console.log(err));
    };
    groupAdd = (e) => {
        let _data = {
            name: e.trim(),
        };

        fetch("/group/addGroup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(_data),
            credentials: 'include',
        }).then(res => {
            return res.json();
        }).then(data => {
            if (data.status === "success") {
                this.getGroupList();
                message.info('加入成功');
            } else if (data.status === "noexist") {
                message.info('群组不存在');
            } else if (data.status === "exist") {
                message.info('已加入群组');
            } else if (data.status === "err") {
                message.info('加入失败');
            }
        }).catch(err => console.log(err));
    };
    groupSreachClose = () => {
        this.setState({
            groupSearch: 'none',
            groupSelMark: 'none'
        })
    };

    render() {
        return (
            <div className="chat-index">
                <div className="chat-border">
                    <div className="chat-window">
                        <div className="chat-head">
                            <UserInfor />
                        </div>
                        <div className="chat-body">
                            <div className="message-groups">
                                {this.state.groupList.map((item) => {
                                    return item ?
                                        item.type === "crowd" ?
                                            <div className="messageGroup" onClick={()=>this.groupClick(item)} key={item.key}>
                                                <Row className="group-cn">
                                                    <Col span={6}>
                                                        <Badge count={item.Badge}><Avatar src={item.avatar} size="large" icon="user"/></Badge>
                                                    </Col>
                                                    <Col>
                                                        <Col className="group-name">{item.group}</Col>
                                                        <Col className='group-cont'>{item.meslast}</Col>
                                                    </Col>
                                                </Row>
                                            </div>
                                            :
                                            <div className="messageGroup" onClick={()=>this.groupClick(item)} key={item.key}>
                                                <Row className="group-cn">
                                                    <Col span={6}>
                                                        <Badge count={item.Badge}><Avatar src={item.avatar} size="large" icon="user"/></Badge>
                                                    </Col>
                                                    <Col>
                                                        <Col className="group-name">{item.group}
                                                            <div className="grouptag">私聊</div>
                                                        </Col>
                                                        <Col className='group-cont'>{item.meslast}</Col>
                                                    </Col>
                                                </Row>
                                            </div>
                                        : null

                                })}
                                <div className="group-add">
                                    <Popover placement="leftBottom" content={this.group_c_add()} trigger="click">
                                        <Icon type="plus-circle"/>
                                    </Popover>
                                </div>
                                <div className="backmark" onClick={this.groupSreachClose} style={{display: this.state.groupSelMark}}/>
                                <div className="group-add-div" style={{display: this.state.groupSearch}}>
                                    <div className="group-header">
                                        <b>{this.state.groupSearchName}</b>
                                        <Icon className="group-icon-close" type="close" onClick={this.groupSreachClose}/>
                                    </div>
                                    <div className="group-search">
                                        <Search
                                            placeholder="请输入群组号"
                                            onSearch={this.groupCreate}
                                            style={{width: 300, display: this.state.groupCreate}}
                                        />
                                        <Search
                                            placeholder="请输入群组号"
                                            onSearch={this.groupAdd}
                                            style={{width: 300, display: this.state.groupAdd}}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="message-body">
                                {this.state.masState === 'blank' ?
                                    <div className="message-blank">
                                        <canvas id="myCanvas" width="300" height="300"></canvas>
                                    </div>
                                    :
                                    <div>
                                        <div className="message-list-border">
                                            <GroupInfo privateChat={this.privateChat} masGroup={this.state.masGroup} chatWay={this.state.chatWay} />

                                            <div ref={dom => this.dom = dom} className="message-list">
                                                {
                                                    this.state.mess.map((item) => {
                                                        if (item) {
                                                            let mesTime;
                                                            if (item.createTime) {
                                                                mesTime = new Date(+new Date(item.createTime) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
                                                            }
                                                            if (item.mtype === "me") {
                                                                return (
                                                                    <Row className='message-li' type="flex" justify="end" align="middle" style={{minHeight: 35}}
                                                                         key={item._id}>
                                                                        <Col span={21}>
                                                                            <Col className='message-me'
                                                                                 dangerouslySetInnerHTML={{__html: this.replace_emoji(item.myMes)}}/>
                                                                        </Col>
                                                                        <Col className='avatar-me' style={{marginLeft: 15}}><Avatar src={item.avatar}
                                                                                                                                    icon="user"/></Col>

                                                                    </Row>
                                                                )
                                                            } else {
                                                                return (
                                                                    <Row className='message-li' type="flex" align="middle" style={{minHeight: 35}}
                                                                         key={item._id}>
                                                                        <Col span={2}><Avatar icon="user" src={item.avatar}/></Col>
                                                                        <Col span={21}>
                                                                            <Col style={{marginLeft: 5}}>{item.name}</Col>
                                                                            <Col className='message-other'
                                                                                 dangerouslySetInnerHTML={{__html: this.replace_emoji(item.myMes)}}/>
                                                                            <Col style={{marginLeft: 5}}>{mesTime}</Col>
                                                                        </Col>
                                                                    </Row>
                                                                )
                                                            }
                                                        }
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className="message-in">
                                            <Row type="flex" align="middle" style={{height: 35}}>
                                                <Col span={22} className="inputText"><Input id="myInput"
                                                                                            onPressEnter={this.inputKeyDown}
                                                                                            placeholder="输入消息"/></Col>
                                                <Col span={1} className="Icons">
                                                    <div>
                                                        <Popover
                                                            visible={this.state.visible}
                                                            onVisibleChange={this.handleVisibleChange}
                                                            placement="topRight"
                                                            content={this.emojis(emoji.emojilist)}
                                                            trigger="click"
                                                        >
                                                            <Icon className='icons' type="smile-o"/>
                                                        </Popover>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;