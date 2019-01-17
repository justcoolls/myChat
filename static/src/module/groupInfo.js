import React from 'react';
import {Input, Icon, Row, Col, message, Avatar, Popover, Tooltip, Badge, Tabs, Button, Popconfirm} from 'antd';
const TabPane = Tabs.TabPane;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groupIntroRight: -310,
            groupIntro: 'none',
            masState: "blank",
            groupMembers: [],
            opacity: 0,
            userInfLi:[]
        };
    }

    componentDidMount() {

    }
    groupHeader = () => {
        this.setState({
            groupIntroRight: 5,
            groupIntro: 'block'
        });
        this.groupMember(this.props.masGroup);
    };
    groupMember = (e) => {
        let _data = {
            name: e.trim(),
        };
        fetch("/group/groupmember", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(_data),
            credentials: 'include',
        }).then(res => {
            return res.json();
        }).then(data => {
            this.setState({
                groupMembers: data.infors||[]
            });
        }).catch(err => console.log(err));
    };
    groupBackMark = () => {
        this.setState({
            groupIntroRight: -310,
            groupIntro: 'none'
        })
    };
    groupQuit = (e) => {
        let _data = {
            name: e.trim(),
        };

        fetch("/group/outGroup", {
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
                this.updateGroupList();
                message.info('退出成功');
            } else if (data.status === "noexist") {
                message.info('群组不存在');
            } else if (data.status === "exist") {
                message.info('已退出群组');
            } else if (data.status === "err") {
                message.info('退出失败');
            }
        }).catch(err => console.log(err));
        this.setState({
            groupIntroRight: -310,
            groupIntro: 'none',
            masState: "blank"
        })
    };
    userChat = (item) => {
        let _data = {
            user: item.user
        };
        fetch("/userInforo", {
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
                this.setState({
                    userInfor: 'block',
                    opacity: 1,
                    scales: 'scale(1,1)',
                    visiStatus: 'visible',
                    userAvatar: item.avatar,
                    userName: item.name,
                    userInfLi: data.infor ||[]
                });
            } else if (data.status === "err") {
                console.log("无法获取用户信息");
            }
        }).catch(err => console.log(err));

    };
    userinfhide = () => {
        this.setState({
            userInfor: 'none',
            opacity: 0,
            scales: 'scale(0.5,0.5)',
            visiStatus: 'hidden'
        })
    };
    privateChat = () => {
        this.userinfhide();
        this.props.privateChat();
    };

    render() {
        return (
            <div>
                <div className="message-border-header">
                    <div className="groupName">{this.props.masGroup}</div>
                    {this.props.chatWay === "crowd" ?
                        <Icon className="Icon-right" onClick={this.groupHeader} type="right"/>
                        :
                        <div className="textRight">私聊</div>
                    }
                    <div className="groupIntro" style={{right: this.state.groupIntroRight}}>
                        <Tabs defaultActiveKey="1">
                            <TabPane style={{height: 616}}
                                     tab={<span><Icon type="user"/>成员</span>} key="1">
                                {
                                    this.state.groupMembers.map((item) => {
                                        return (
                                            <div className="groupmember" key={item.key} onClick={()=>this.userChat(item)}>
                                                <Avatar src={item.avatar} size="large" icon="user"/>
                                                <div className="membername">{item.user}</div>
                                            </div>
                                        )
                                    })
                                }
                                <Popconfirm placement="top" title='确认退出本群?'
                                            onConfirm={()=>this.groupQuit(this.props.masGroup)}
                                            okText="Yes" cancelText="No">
                                    <Button className="groupQuit" type="danger">退出群组</Button>
                                </Popconfirm>
                            </TabPane>
                            <TabPane style={{height: 616}}
                                     tab={<span><Icon type="notification"/>通知</span>}
                                     key="2">
                                欢迎加入本群！
                            </TabPane>
                        </Tabs>
                    </div>
                    <div className="backmark" onClick={this.groupBackMark} style={{display: this.state.groupIntro}}/>
                </div>
                <div>
                    <div className="userinf" style={{
                        opacity: this.state.opacity,
                        transform: this.state.scales,
                        visibility: this.state.visiStatus
                    }}>
                        <img className="userheader" src={this.state.userAvatar}/>
                        <div className="userName" id="userName">{this.state.userName}</div>
                        <div>
                            <div className="userInfLi">
                                {
                                    this.state.userInfLi.map((item) => {
                                        return (
                                            <Row style={{margin: 5, padding: 5}} type="flex" justify="end"
                                                 key={item.name}>
                                                <Col className="userpro">{item.name}</Col><Col offset={1}
                                                                                               span={13}>{item.value}</Col>
                                            </Row>
                                        )
                                    })
                                }
                            </div>
                            <Button onClick={this.privateChat} type="primary" style={{position: 'absolute', bottom: 10, left: 108}}>私聊</Button>
                        </div>
                    </div>
                    <div className="backmark" onClick={this.userinfhide} style={{display: this.state.userInfor}}/>
                </div>
            </div>
        )
    }
}

export default App;