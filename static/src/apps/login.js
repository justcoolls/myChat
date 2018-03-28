import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Icon,message} from 'antd';
import Register from '../module/Register';
import Login from '../module/Login';
require('babel-polyfill');


class NormalLoginForm extends React.Component {
    state={
        signtop:0,
        headerrow:0,
        arrowleft:'none',
        arrowright:'block',
        revisibility:'hidden',
        lovisibility:'visible'
    };
    toregister=()=>{
        this.setState({
            signtop:-275,
            headerrow:-500,
            arrowleft:'block',
            arrowright:'none',
            revisibility:'visible',
            lovisibility:'hidden'
        })
    };
    tologin=()=>{
        this.setState({
            signtop:0,
            headerrow:0,
            arrowleft:'none',
            arrowright:'block',
            revisibility:'hidden',
            lovisibility:'visible'
        })
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="chat-sign">
                <div className="chat-sign-form">
                    <div className="sign-form">
                        <div className="sign-header">
                            <div className="sign-left" onClick={this.tologin} style={{display:this.state.arrowleft}}>
                                <a>
                                    登录
                                    <Icon type="arrow-left" />
                                </a>

                            </div>
                            <div className="sign-header-row" style={{marginLeft:this.state.headerrow}}>
                                <div className="sign-header-name" >登录</div>
                                <div className="sign-header-name" >注册</div>
                            </div>

                            <div className="sign-right" onClick={this.toregister} style={{display:this.state.arrowright}}>
                                <a>
                                    <Icon type="arrow-right" />
                                    注册
                                </a>
                            </div>

                        </div>
                        <div style={{height:33}}/>
                        <div style={{height:236,overflow:'hidden'}}>
                            <div className="sign-body" style={{marginTop:this.state.signtop}}>
                                <div className="sign-con" style={{height:175,visibility:this.state.lovisibility}}>
                                    <Login/>
                                </div>
                                <div className="sign-con" style={{height:233,marginTop:100,visibility:this.state.revisibility}}>
                                    <Register/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

ReactDOM.render(<WrappedNormalLoginForm />,document.getElementById('login'));