import React from 'react';
import rcAlert from 'rc-alert';
import './style.less'
class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            signTop: 0,
            headerRow: 0,
            arrowLeft: 'none',
            arrowRight: 'block',
            reVisibility: 'hidden',
            loVisibility: 'visible',
            user: '',
            password: '',
            regUser: '',
            regPassword: '',
            confirmPassword: ''
        };
    }

    componentDidMount() {
        this.snow()
    }
    snow=()=>{
        let width, height, largeHeader, canvas, ctx, circles, animateHeader = true;

        // Main
        initHeader();
        addListeners();

        function initHeader() {
            width = window.innerWidth;
            height = window.innerHeight;

            largeHeader = document.getElementById('large-body');
            largeHeader.style.height = height+'px';

            canvas = document.getElementById('back-canvas');
            canvas.width = width;
            canvas.height = height;
            ctx = canvas.getContext('2d');

            // create particles
            circles = [];
            for(let x = 0; x < width*0.5; x++) {
                let c = new Circle();
                circles.push(c);
            }
            animate();
        }

        // Event handling
        function addListeners() {
            window.addEventListener('scroll', scrollCheck);
            window.addEventListener('resize', resize);
        }

        function scrollCheck() {
            if(document.body.scrollTop > height) animateHeader = false;
            else animateHeader = true;
        }

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            largeHeader.style.height = height+'px';
            canvas.width = width;
            canvas.height = height;
        }

        function animate() {
            if(animateHeader) {
                ctx.clearRect(0,0,width,height);
                for(let i in circles) {
                    circles[i].draw();
                }
            }
            requestAnimationFrame(animate);
        }

        // Canvas manipulation
        function Circle() {
            let _this = this;

            // constructor
            (function() {
                _this.pos = {};
                init();
            })();

            function init() {
                _this.pos.x = Math.random()*width;
                _this.pos.y = Math.random()*500-500;
                _this.alpha = 0.1+Math.random();//透明
                _this.scale = 0.1+Math.random()*0.3;//大小
                _this.velocity = Math.random(); //速度
            }

            this.draw = function() {
                if(_this.alpha <= 0) {
                    init();
                }
                _this.pos.y += _this.velocity;
                _this.alpha -= 0.0005;
                ctx.beginPath();
                ctx.arc(_this.pos.x, _this.pos.y, _this.scale*10, 0, 2 * Math.PI, false);
                ctx.fillStyle = 'rgba(255,255,255,'+ _this.alpha+')';
                ctx.fill();
            };
        }
    };
    toRegister = () => {
        this.setState({
            signTop: -275,
            headerRow: -500,
            arrowLeft: 'block',
            arrowRight: 'none',
            reVisibility: 'visible',
            loVisibility: 'hidden'
        })
    };
    toLogin = () => {
        this.setState({
            signTop: 0,
            headerRow: 0,
            arrowLeft: 'none',
            arrowRight: 'block',
            reVisibility: 'hidden',
            loVisibility: 'visible'
        })
    };
    loginSubmit = () => {
        const {user, password} = this.state;
        const data = {
            userName: user,
            pwd: password
        };
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: 'include',
        }).then(res => {
            return res.json();
        }).then(data => {
            if (data.status === 1) {
                document.cookie = "token=" + data.token;
                window.location.href = "/";
            } else{
                rcAlert.error(data.mes);
            }
        }).catch(err => console.log(err));

    };
    registerSubmit = () => {
        const {regUser, regPassword,confirmPassword} = this.state;
        if(regUser.length<3){
            console.info('用户名不能少于三位数');
            return false
        }
        if(regPassword !== confirmPassword){
            console.info('两次密码不同');
            return false
        }
        const data = {
            userName: regUser,
            pwd: regPassword
        };
        fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: 'include',
        }).then(res => {
            return res.json();
        }).then(data => {
            if (data.status === 1) {
                document.cookie = "token=" + data.token;
                window.location.href = "/";
            } else  {
                rcAlert.error(data.mes);
            }

        }).catch(err => console.log(err));
    };
    userChange = (e) => {
        this.setState({
            user: e.target.value.trim()
        })
    };
    passwordChange = (e) => {
        this.setState({
            password: e.target.value.trim()
        })
    };
    regUserChange = (e) => {
        this.setState({
            regUser: e.target.value.trim()
        })
    };
    regPasswordChange = (e) => {
        this.setState({
            regPassword: e.target.value.trim()
        })
    };
    confirmPasswordChange = (e) => {
        this.setState({
            confirmPassword: e.target.value.trim()
        })
    };

    render() {
        const {user, password, regUser, regPassword, confirmPassword} = this.state;
        return (
            <div className="chat-sign">
                <div className="chat-sign-form">
                    <div className="sign-form">
                        <div className="sign-header">
                            <div className="sign-left" onClick={this.toLogin} style={{display: this.state.arrowLeft}}>
                                <a>
                                    登录
                                </a>
                            </div>
                            <div className="sign-header-row" style={{marginLeft: this.state.headerRow}}>
                                <div className="sign-header-name">登录</div>
                                <div className="sign-header-name">注册</div>
                            </div>

                            <div className="sign-right" onClick={this.toRegister}
                                 style={{display: this.state.arrowRight}}>
                                <a>
                                    注册
                                </a>
                            </div>

                        </div>
                        <div style={{height: 33}}/>
                        <div style={{height: 236, overflow: 'hidden'}}>
                            <div className="sign-body" style={{marginTop: this.state.signTop}}>
                                <div className="sign-con" style={{height: 175, visibility: this.state.loVisibility}}>
                                    <form>
                                        <input value={user} onChange={this.userChange} placeholder="用户名"/>
                                        <input value={password} onChange={this.passwordChange} placeholder="密码"
                                               type="password"/>
                                        <div className="submit" onClick={this.loginSubmit}> 登录</div>
                                    </form>
                                </div>
                                <div className="sign-con"
                                     style={{height: 233, marginTop: 100, visibility: this.state.reVisibility}}>
                                    <input value={regUser} onChange={this.regUserChange} placeholder="用户名"/>
                                    <input value={regPassword} onChange={this.regPasswordChange} placeholder="密码"
                                           type="password"/>
                                    <input value={confirmPassword} onChange={this.confirmPasswordChange}
                                           placeholder="确认密码" type="password"/>
                                    <div className="submit" onClick={this.registerSubmit}> 注册</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;