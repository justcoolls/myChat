import React from 'react';
import { Input,Icon,Row,Col,message,Avatar,Popover,Tooltip,Badge,Tabs,Button,Popconfirm } from 'antd';
import io from 'socket.io-client';
import UserInfor from './userInformation';
const TabPane = Tabs.TabPane;
const emoji=require('./emoji');
const chats=require('./chat');
// const socket = io('http://120.79.183.31:3001',{
const socket = io('http://127.0.0.1:3001',{
    query: 'token=' + getCookie(),
});
const Search = Input.Search;
function getCookie()
{
    let arr,reg=new RegExp("(^| )"+'token'+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

class App extends React.Component{
    state={
        avatar:'',
        grouplist:[],
        mess:[],
        masState:"blank",
        masgroup:"",
        visible: false,
        groupIntroRight:-310,
        groupIntro:'none',
        groupselmark:'none',
        groupsraech:'none',
        groupsreachname:'',
        groupcreate:'none',
        groupadd:'none',
        groupmembers:[],
        chatway:"crowd",
        pridata:[],
        //  个人信息
        opacity:0,
        scales:'scale(0.5,0.5)',
        visistatus:'hidden',
        userinfor:'none',
        useravatar:'',
        username:'',
        userinfli:[]
    };
    componentDidMount() {
        fetch("/ugroupfind",{
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
        }).then(res=>{
            return res.json();
        }).then(data=>{
            this.setState({
                grouplist:data.groups
            },()=> {
                this.groupOn(data.groups)
            });
        }).catch(err=>console.log(err));
    };
    updategrouplist=()=>{
        fetch("/ugroupfind",{
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
        }).then(res=>{
            return res.json();
        }).then(data=>{
            this.setState({
                grouplist:data.groups
            },()=> {
                this.groupOn(data.groups)
            });
        }).catch(err=>console.log(err));
    };
    groupOn=(data)=>{
        let len=data.length;
        if(len>0){
            for (let i=0;i<len;i++){
                socket.on(data[i].group, msg => {
                        if(this.state.masgroup==data[i].group){
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
                                grouplist:data,
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
                                grouplist:data,
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
            if(pricontain=="none"){
                let pCgroupname=msg.name;
                let pCgroupava=msg.avatar;
                let grouplists=this.state.grouplist;
                let grouplilen=grouplists.length;
                let pChatgroup={group: pCgroupname, Badge: 1, key: grouplilen, avatar: pCgroupava,type:"privatechat", meslast:msg.Mes};
                grouplists.push(pChatgroup);
                this.setState({
                    grouplist:grouplists,
                })
            }else {
                if(this.state.masgroup==msg.name && this.state.chatway=="privatechat"){
                    let mydata=[{
                        _id: msg.name+keys,
                        name:msg.name,
                        myMes:msg.Mes,
                        mtype:"other",
                        avatar:msg.avatar
                    }];
                    //last消息显示在组
                    let groupname=this.state.masgroup;
                    let groupdata=this.state.grouplist;
                    let len=groupdata.length;
                    for(let i=0;i<len;i++){
                        if(groupdata[i].group==groupname && groupdata[i].type==this.state.chatway){
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
                    let groupdatas=this.state.grouplist;
                    let len=groupdatas.length;
                    for(let i=0;i<len;i++){
                        if(groupdatas[i].group==groupnames && groupdatas[i].type=="privatechat"){
                            groupdatas[i].meslast=msg.Mes;
                            groupdatas[i].Badge++;
                        }
                    }
                    this.setState({
                        grouplist:groupdatas
                    })
                }
            }

        });
    };

    pricontain=(name)=>{
        let groupl=this.state.grouplist;
        let len=groupl.length;
        for(let i=0;i<len;i++){
            if(groupl[i].group==name && groupl[i].type=="privatechat"){
                return "contain"
            }
        }
        return "none"
    };

    groupclick=(item)=>{
        if(this.state.masgroup!=item.group || item.type!=this.state.chatway){
            let grouplist=this.state.grouplist;
            let len=grouplist.length;
            for(let i=0;i<len;i++){
                if(grouplist[i].key==item.key){
                    grouplist[i].Badge=0;
                }
            }
            if(item.type=="crowd"){
                this.setState({
                    chatway:"crowd",
                    masState:'chatwindow',
                    masgroup:item.group,
                    mess:[]
                },()=> {
                    this.selGroup(item.group)
                })
            }else {
                this.setState({
                    chatway:"privatechat",
                    masState:'chatwindow',
                    masgroup:item.group,
                    mess:[]
                },()=> {
                    this.getprimes(item.group);
                })
            }

        }


    };
    getprimes=(item)=>{
        let pridata=this.state.pridata;
        let prilen=pridata.length;
        let mess=[];
        for(let i=0;i<prilen;i++){
            if(pridata[i].name==item){
                mess.push(pridata[i])
            }
        }

        let het =this.dom.scrollHeight;
        this.setState({
            mess:mess
        },()=> {
            if (mess.length<21){
                this.dom.scrollTop=this.dom.scrollHeight-this.dom.offsetHeight;
            }else {
                this.dom.scrollTop=this.dom.scrollHeight-het-5;
            }
        })
    };
     selGroup=(item)=> {

         this.getmessage(20,item);
         this.dom.onscroll = function(){
             if(this.state.chatway=="crowd"){
                 let scrollTop= this.dom.scrollTop;
                 let count=1;
                 if( scrollTop ==0 && this.dom.scrollHeight>this.dom.offsetHeight){
                     let counts= count*20+20;
                     this.getmessage(counts,item);
                     count++;
                 }
             }

         }.bind(this);
    };

    getmessage=(counts,item)=>{
        let _data={
            mess:counts,
            group:item
        };
        fetch("/mychat/mesFind",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify(_data),
            credentials: 'include',
        }).then(res=>{
            return res.json();
        }).then(data=>{
            if(data.status=="success"){
                this.showmessage(data.data);
            }else if(data.status=="null"){
                this.setState({
                    mess:[]
                })
            }
            else if(data.status=="err"){
            }
        }).catch(err=>console.log(err));
    };


    inputKeyDown = () => {
            let myInput=document.getElementById("myInput");
            let myravatar=document.getElementById("useravatar").src;
            let myMes=myInput.value;
            let keys=this.state.mess.length;
            let mydata=[{
                _id: "n"+keys,
                myMes:myMes,
                mtype:"me",
                avatar:myravatar
            }];
            if(myMes != ""){
                myInput.value="";
                this.setState({
                    mess:this.state.mess.concat(mydata),
                },()=> {
                    this.dom.scrollTop=this.dom.scrollHeight-this.dom.offsetHeight;
                });

                this.sendMessage(myMes);
                //本地消息显示在组
                let user=document.getElementById("username").innerHTML;
                let groupname=this.state.masgroup;
                let groupdata=this.state.grouplist;
                let len=groupdata.length;
                for(let i=0;i<len;i++){
                    if(groupdata[i].group==groupname && groupdata[i].type==this.state.chatway){
                        groupdata[i].meslast=user+":"+myMes;
                    }
                }
            }

    };


    sendMessage = (myMes) => {
        if(this.state.chatway=="crowd"){
            socket.emit('chats', {mes:myMes,group:this.state.masgroup});
        }else {
            socket.emit('privatechat', {mes:myMes,acceptuser:this.state.masgroup});
            //本地记录私信
            let privateMes=this.state.pridata;
            let keys=privateMes.length;
            let groupname=this.state.masgroup;
            let myravatar=document.getElementById("useravatar").src;
            let pridata={
                _id: groupname+keys,
                name:groupname,
                myMes:myMes,
                mtype:"me",
                avatar:myravatar
            };
            privateMes.push(pridata);
            this.setState({
                // pridata:privateMes
            });
        }
    };
    showmessage=(mess)=>{
       let het =this.dom.scrollHeight;
        this.setState({
            mess:mess
        },()=> {
            if (mess.length<21){
                this.dom.scrollTop=this.dom.scrollHeight-this.dom.offsetHeight;
            }else {
                this.dom.scrollTop=this.dom.scrollHeight-het-5;
            }
        })
    };
    // emoji
    emojis=(data)=>{
        if(data){
            return data.map((row)=>{
                let datas=[];
                row.children.map((item)=>{
                    datas.push (<div className="emojisel" onClick={this.emojisel.bind(this,item.title)} style={{display:'inline-block',margin:5}} key={item.title}><Tooltip overlayStyle={{color:'#eee'}} placement="bottom" title={item.title}><img style={{width:35,height:35}} src={item.url}/></Tooltip></div>)
                });
                return <div style={{width:500}} key={row.key}>{datas}</div>
            });
        }
    };

    emojisel=(i)=>{
        let myInput=document.getElementById("myInput");
        myInput.value+="["+i+"]";
        this.setState({
            visible: false,
        });

        myInput.focus();
    };
    handleVisibleChange = (visible) => {
        this.setState({ visible });
    };

    replace_emoji=(item)=>{
       return emoji.emojishow(item);
    };
    //用户信息
    userchat=(item)=>{
        let _data={
            user:item.name
        };
        fetch("/userinforo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify(_data),
            credentials: 'include',
        }).then(res=>{
            return res.json();
        }).then(data=>{
            if(data.status=="success"){
                this.setState({
                    userinfor:'block',
                    opacity:1,
                    scales:'scale(1,1)',
                    visistatus:'visible',
                    useravatar:item.avatar,
                    username:item.name,
                    userinfli:data.infor
                });
            }else if(data.status=="err"){
                console.log("无法获取用户信息");
            }
        }).catch(err=>console.log(err));

    };
    userinfhide=()=>{
        this.setState({
            userinfor:'none',
            opacity:0,
            scales:'scale(0.5,0.5)',
            visistatus:'hidden'
        })
    };
    groupcontain=()=>{
        let groupl=this.state.grouplist;
        let len=groupl.length;
        for(let i=0;i<len;i++){
            if(groupl[i].group==this.state.username && groupl[i].type=="privatechat"){
                return "contain"
            }
        }
        return "none"
    };
    privatechat=()=>{
        let result=this.groupcontain();
        //本地数据
        let prigroupname=this.state.username;
        let pridata=this.state.pridata;
        let prilen=pridata.length;
        let mess=[];
        for(let i=0;i<prilen;i++){
            if(pridata[i].name==prigroupname){
                mess.push(pridata[i])
            }
        }
            if(result=="none"){
                //组列表
                let pCgroupava=this.state.useravatar;
                let pCgroupname=this.state.username;
                let grouplilen=this.state.grouplist.length;
                let pChatgroup={group: pCgroupname, Badge: 0, key: grouplilen, avatar: pCgroupava,type:"privatechat", meslast: ""};
                let grouplists=this.state.grouplist;
                grouplists.push(pChatgroup);
                this.setState({
                    grouplist:grouplists,
                    masState:'chatwindow',
                    masgroup:this.state.username,
                },()=> {
                    this.setState({
                        userinfor:'none',
                        opacity:0,
                        scales:'scale(0.5,0.5)',
                        visistatus:'hidden',
                        mess:mess
                    })
                })

            }else {
                this.setState({
                    masState:'chatwindow',
                    masgroup:this.state.username,
                },()=> {
                    this.setState({
                        userinfor:'none',
                        opacity:0,
                        scales:'scale(0.5,0.5)',
                        visistatus:'hidden',
                        mess:mess
                    })
                })
            }
        this.setState({
            chatway:"privatechat",
        })

    };
     //聊天列表
     messagesdb = (data) =>{
         if(data){
             return  data.map((item) => {
                 if(item){
                     let mesTime;
                     if(item.createTime){
                         mesTime =new Date(+new Date(item.createTime)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
                     }
                     if(item.mtype == "me"){
                         return (
                             <Row className='message-li' type="flex" justify="end" align="middle" style={{minHeight:35}}  key={item._id}>
                                 <Col span={21}>
                                     <Col className='message-me' dangerouslySetInnerHTML={{  __html:this.replace_emoji(item.myMes) }}  />
                                 </Col>
                                 <Col className='avatar-me' style={{marginLeft:15}}><Avatar src={item.avatar} icon="user" /></Col>

                             </Row>
                         )
                     }else {
                         return (
                             <Row className='message-li' type="flex" align="middle" style={{minHeight:35}}  key={item._id}>
                                 <Col span={2} onClick={this.userchat.bind(this,item)}><Avatar icon="user" src={item.avatar} /></Col>
                                 <Col span={21}>
                                     <Col style={{marginLeft:5}}>{item.name}</Col>
                                     <Col  className='message-other' dangerouslySetInnerHTML={{  __html:this.replace_emoji(item.myMes) }} />
                                     <Col style={{marginLeft:5}}>{mesTime}</Col>
                                 </Col>
                             </Row>
                         )
                     }
                 }
             });
         }

    };

    groupList=(data)=>{
        if(data){
            return data.map((item) => {
                if(item){
                    if(item.type=="crowd"){
                        return(
                            <div className="messageGroup" onClick={this.groupclick.bind(this,item)}  key={item.key}>
                                <Row className="group-cn">
                                    <Col span={6}>
                                        <Badge count={item.Badge}><Avatar src={item.avatar} size="large" icon="user" /></Badge>
                                    </Col>
                                    <Col >
                                        <Col className="group-name">{item.group}</Col>
                                        <Col  className='group-cont'>{item.meslast}</Col>
                                    </Col>
                                </Row>
                            </div>
                        )
                    }else {
                        return(
                            <div className="messageGroup" onClick={this.groupclick.bind(this,item)}  key={item.key}>
                                <Row className="group-cn">
                                    <Col span={6}>
                                        <Badge count={item.Badge}><Avatar src={item.avatar} size="large" icon="user" /></Badge>
                                    </Col>
                                    <Col >
                                        <Col className="group-name">{item.group}<div className="grouptag">私聊</div></Col>
                                        <Col  className='group-cont'>{item.meslast}</Col>
                                    </Col>
                                </Row>
                            </div>
                        )
                    }
                }
            })
        }

    };
    groupHaeder=()=>{
       this.setState({
           groupIntroRight:5,
           groupIntro:'block'
       });
        this.groupmember(this.state.masgroup);
    };
    groupmember=(e)=>{
        let _data={
            name:e.trim(),
        };
        fetch("/group/groupmember",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify(_data),
            credentials: 'include',
        }).then(res=>{
            return res.json();
        }).then(data=>{
            data.infors;
            this.setState({
                groupmembers: data.infors
            });
        }).catch(err=>console.log(err));
    };
    groupmemberlist=(data)=>{
        if(data){
            return data.map((item)=>{
                return(
                    <div className="groupmember" key={item.key}>
                        <Avatar src={item.avatar}  size="large" icon="user"  />
                        <div  className="membername">{item.user}</div>
                    </div>
                );
            });
        }

    };
    groupbackmark=()=>{
      this.setState({
          groupIntroRight:-310,
          groupIntro:'none'
      })
    };
    groupquit=(e)=>{
        let _data={
            name:e.trim(),
        };

        fetch("/group/outGroup",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify(_data),
            credentials: 'include',
        }).then(res=>{
            return res.json();
        }).then(data=>{
            if(data.status=="success"){
                this.updategrouplist();
                message.info('退出成功');
            }else if(data.status=="noexist"){
                message.info('群组不存在');
            }else if(data.status=="exist"){
                message.info('已退出群组');
            }else if(data.status=="err"){
                message.info('退出失败');
            }
        }).catch(err=>console.log(err));
        this.setState({
            groupIntroRight:-310,
            groupIntro:'none',
            masState:"blank"
        })
    };
    iconRight=()=>{
        if(this.state.chatway=="crowd"){
            return <Icon className="Icon-right" onClick={this.groupHaeder} type="right"/>
        }else {
            return <div className="textright">私聊</div>
        }
    };
    messagebody=(data)=>{
        if(data=='blank'){
           return(
               <div className="message-blank">
                   <canvas id="myCanvas" width="300" height="300"></canvas>
               </div>
               )
        }else{
            return (
                <div>
                    <div className="message-list-border">
                        <div className="message-border-header">
                            <div className="groupName">{this.state.masgroup}</div>
                            {this.iconRight()}
                            <div className="groupIntro" style={{right:this.state.groupIntroRight}}>
                                <Tabs defaultActiveKey="1">
                                    <TabPane style={{height:616}} tab={<span><Icon type="user" />成员</span>} key="1">
                                        {this.groupmemberlist(this.state.groupmembers)}

                                        <Popconfirm placement="top" title='确认退出本群?' onConfirm={this.groupquit.bind(this,this.state.masgroup)} okText="Yes" cancelText="No">
                                            <Button className="groupquit" type="danger">退出群组</Button>
                                        </Popconfirm>
                                    </TabPane>
                                    <TabPane style={{height:616}} tab={<span><Icon type="notification" />通知</span>} key="2">
                                        欢迎加入本群！
                                    </TabPane>
                                </Tabs>
                            </div>
                            <div className="backmark" onClick={this.groupbackmark} style={{display:this.state.groupIntro}}/>
                        </div>
                        <div ref={dom => this.dom = dom} className="message-list">
                            {this.messagesdb(this.state.mess)}
                        </div>
                    </div>
                    <div className="message-in">
                        <Row type="flex" align="middle" style={{height:35}}>
                            <Col span={22}   className="inputText"><Input  id="myInput"  onPressEnter={this.inputKeyDown} placeholder="输入消息" /></Col>
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
                            {/*<Col span={1} className="Icons">*/}
                                {/*<Upload {...props}>*/}
                                    {/*<Icon className='icons' type="picture"/>*/}
                                {/*</Upload>*/}
                            {/*</Col>*/}
                        </Row>
                    </div>
                </div>
            )
        }

    };
    group_c_add =()=> {
        return(
                <div>
                    <a className="group-ac" onClick={this.groupCreateshow}>创建组</a>
                    <a className="group-ac" onClick={this.groupAddshow}>加入组</a>
                </div>
            )
    };
    groupCreateshow=()=>{
        this.setState({
            groupsraech:'block',
            groupcreate:'block',
            groupadd:'none',
            groupsreachname:'创建群',
            groupselmark:'block'
        })
    };
    groupAddshow=()=>{
        this.setState({
            groupsraech:'block',
            groupcreate:'none',
            groupadd:'block',
            groupsreachname:'加入群',
            groupselmark:'block'
        })
    };
    groupCreate=(e)=>{
        let _data={
            name:e.trim(),
        };

        fetch("/group/createGroup",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify(_data),
            credentials: 'include',
        }).then(res=>{
            return res.json();
        }).then(data=>{
            if(data.status=="success"){
                this.updategrouplist();
                message.info('创建成功');
            }else if(data.status=="exist"){
                message.info('群组已存在');
            }
            else if(data.status=="err"){
                message.info('创建失败');
            }else if(data.status=="limit"){
                message.info('每个用户最多只能创建2个群');
            }
        }).catch(err=>console.log(err));
    };
    groupAdd=(e)=>{
        let _data={
            name:e.trim(),
        };

        fetch("/group/addGroup",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify(_data),
            credentials: 'include',
        }).then(res=>{
            return res.json();
        }).then(data=>{
            if(data.status=="success"){
                this.updategrouplist();
                message.info('加入成功');
            }else if(data.status=="noexist"){
                message.info('群组不存在');
            }else if(data.status=="exist"){
                message.info('已加入群组');
            }else if(data.status=="err"){
                message.info('加入失败');
            }
        }).catch(err=>console.log(err));
    };
    groupSreachClose=()=>{
        this.setState({
            groupsraech:'none',
            groupselmark:'none'
        })
    };
    userinflist=(data)=>{
        if(data){
            return data.map((item)=>{
                        return(
                            <Row style={{margin:5,padding:5}} type="flex" justify="end" key={item.name}>
                                <Col className="userpro">{item.name}</Col><Col offset={1} span={13}>{item.value}</Col>
                            </Row>
                        )
                    })
        }
    };
    render(){
        return(
            <div className="chat-index">
                <div className="chat-border">
                    <div className="chat-window">
                        <div className="chat-head">
                            <UserInfor/>
                            <div className="userinf" style={{opacity:this.state.opacity,transform:this.state.scales,visibility:this.state.visistatus}}>
                                <img className="userheader"  src={this.state.useravatar}/>
                                <div className="username" id="username">{this.state.username}</div>
                                <div>
                                    <div className="userinfli">
                                        {this.userinflist(this.state.userinfli)}
                                    </div>
                                    <Button onClick={this.privatechat} type="primary" style={{position: 'absolute',bottom:10, left:108}}>私聊</Button>
                                </div>
                            </div>
                            <div className="backmark" onClick={this.userinfhide} style={{display:this.state.userinfor}}/>
                        </div>
                        <div className="chat-body">
                            <div className="message-groups" >
                                {this.groupList(this.state.grouplist)}

                                <div className="group-add">
                                    <Popover placement="leftBottom" content={this.group_c_add()} trigger="click">
                                        <Icon type="plus-circle" />
                                    </Popover>
                                </div>
                                <div className="backmark" onClick={this.groupSreachClose} style={{display:this.state.groupselmark}}/>
                                <div className="group-add-div" style={{display:this.state.groupsraech}}>
                                    <div className="group-header">
                                        <b>{this.state.groupsreachname}</b>
                                        <Icon className="group-icon-close" type="close" onClick={this.groupSreachClose} />
                                    </div>
                                    <div className="group-search">
                                        <Search
                                            placeholder="请输入群组号"
                                            onSearch={this.groupCreate}
                                            style={{ width: 300 ,display:this.state.groupcreate}}
                                        />
                                        <Search
                                            placeholder="请输入群组号"
                                            onSearch={this.groupAdd}
                                            style={{ width: 300 ,display:this.state.groupadd}}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="message-body">
                                {this.messagebody(this.state.masState)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;