import React from 'react';
import './style.less'
import Service from '../../../service/groupInfor/index'

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            memberList:[],
            isOwner:0
        }
    }

    componentDidMount() {
        this.setState({
            mesGroup: this.props.mesGroup,
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.visible !==this.props.visible){
            if (nextProps.visible) {
                if(nextProps.mesGroup !==this.state.mesGroup || this.state.memberList.length===0){
                    this.setState({
                        mesGroup: nextProps.mesGroup,
                    });
                    const data={
                        name:nextProps.mesGroup
                    };
                    Service.groupMember(data).then((res)=>{
                        this.setState({
                            memberList:res.infors ||[],
                            isOwner:res.isOwner
                        })
                    })
                }
                this.setState({
                    visible: true,
                },()=>{
                    this.stopBubble();
                    document.addEventListener('click',this.hide,false);
                });
            }else {
                this.setState({
                    visible: false,
                });
            }
        }
    }
    stopBubble=(event)=>{
        if(event && event.stopPropagation){
            event.preventDefault();
            event.stopPropagation();
            event.nativeEvent.stopImmediatePropagation();
        }else{
            window.event.cancelBubble=true; //IE
        }
    };
    hide=()=>{
        this.props.onCancel();
        document.removeEventListener('click',this.hide,false)
    };
    groupInfor=(event)=>{
        this.stopBubble(event);
    };
    outGroup=()=>{
        const data={
            name:this.state.mesGroup
        };
        Service.outGroup(data).then((res)=>{
            console.log(res);
            this.props.outGroup();
        })
    };

    render() {
        const {visible,memberList,mesGroup,isOwner} = this.state;
        return (
            <div className="groupInfor">
                <div onClick={this.groupInfor} className="groupInfor-content scrollbar" style={{right: visible ? 10 : -270}}>
                    <div className="groupInfor-title">群通知</div>
                    <div className="groupInfor-inform">欢迎加入{mesGroup}!</div>
                    <div className="groupInfor-title">群成员</div>
                    <div className="members-content">
                        {memberList.map((item)=>{
                            return (
                                <div key={item.key} className="member">
                                    <img src={item.avatar}/>
                                    <div className="member-name">{item.user}</div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="groupInfor-bottom">
                        {isOwner?"":
                            <button onClick={this.outGroup}  type="button" className="btn btn-danger">
                                <span>退出群聊</span>
                            </button>
                        }
                    </div>
                </div>
            </div>
        );
    }

}

export default Modal;