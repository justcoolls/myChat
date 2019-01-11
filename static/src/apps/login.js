import React from 'react';
import ReactDOM from 'react-dom';
class App extends React.Component {
    state={
        signtop:0,
        headerrow:0,
        arrowleft:'none',
        arrowright:'block',
        revisibility:'hidden',
        lovisibility:'visible'
    };
    componentDidMount(){
        // fetch("/moLogin", {
        //     method: "GET",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     credentials: 'include',
        // }).then(res=>{
        //     return res.json();
        // }).then(data=>{
        //     if(data.status=="success"){
        //         message.info('登陆成功');
        //         window.location.href = "/mychat/";
        //     }else if(data.status=="err"){
        //         message.info('请登录');
        //     }
        // }).catch(err=>console.log(err));
    }
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
        return (
            <div className="chat-sign">
                <div className="chat-sign-form">
                    <div className="sign-form">
                        <div className="sign-header">
                            <div className="sign-left" onClick={this.tologin} style={{display:this.state.arrowleft}}>
                                <a>
                                    登录
                                </a>

                            </div>
                            <div className="sign-header-row" style={{marginLeft:this.state.headerrow}}>
                                <div className="sign-header-name" >登录</div>
                                <div className="sign-header-name" >注册</div>
                            </div>

                            <div className="sign-right" onClick={this.toregister} style={{display:this.state.arrowright}}>
                                <a>
                                    注册
                                </a>
                            </div>

                        </div>
                        <div style={{height:33}}/>
                        <div style={{height:236,overflow:'hidden'}}>
                            <div className="sign-body" style={{marginTop:this.state.signtop}}>
                                <div className="sign-con" style={{height:175,visibility:this.state.lovisibility}}>
                                    <input placeholder="用户名"/>
                                    <input placeholder="密码"  type="password"/>
                                    <div className="submit"> 登录</div>
                                </div>
                                <div className="sign-con" style={{height:233,marginTop:100,visibility:this.state.revisibility}}>
                                    <input placeholder="用户名"/>
                                    <input placeholder="密码"  type="password"/>
                                    <input placeholder="确认密码"  type="password"/>
                                    <div className="submit"> 注册</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
ReactDOM.render(<App />,document.getElementById('login'));