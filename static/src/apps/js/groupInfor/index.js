import React from 'react';
import './style.less'
import Service from '../../../service/groupInfor/index'

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            memberList:[]
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
                            memberList:res.infors ||[]
                        })
                    })
                }
                this.setState({
                    visible: true,
                });
            }else {
                this.setState({
                    visible: false,
                });
            }
        }

    }


    render() {
        const {visible,memberList,mesGroup} = this.state;
        return (
            <div className="groupInfor">
                <div className="groupInfor-content scrollbar" style={{right: visible ? 10 : -270}}>
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
                        <button  type="button" className="btn btn-danger">
                            <span>退出群聊</span>
                        </button>
                    </div>
                </div>
                {visible ? <div onClick={this.props.onCancel} className="background-mark"/> : ""}
            </div>
        );
    }

}

export default Modal;