import React from 'react';
import {message,Button,Row,Col,Input,Form,DatePicker,Select } from 'antd';
import moment from 'moment';
const Option = Select.Option;
class UserInfor extends React.Component{
    state={
        avatar:'',
        name:'',
        infor:'infor',
        userinfor:'none',
        opacity:0,
        scales:'scale(0.5,0.5)',
        visistatus:'hidden',
        age:"未知",
        birthday:"",
        sex:"未知",
        location:"未知",
        email:"未知",
        gitHub:"未知",
        personalWeb:"未知",
    };

    componentDidMount() {
        fetch("/userinform", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
        }).then(res=>{
            return res.json();
        }).then(data=>{
            if(data.status=="success"){
                this.setState({
                    name:data.name,
                    avatar:data.avatar,
                    age:this.ages(data.age),
                    birthday:data.age,
                    sex:data.sex,
                    location:data.location,
                    email:data.email,
                    gitHub:data.gitHub,
                    personalWeb:data.personalWeb,
                });
            }else if(data.status=="err"){
                console.log("无法获取用户信息");
            }
        }).catch(err=>console.log(err));

    }
    userClick=()=>{
       this.setState({
           userinfor:'block',
           opacity:1,
           scales:'scale(1,1)',
           visistatus:'visible'
       })
    };
    userhide=()=>{
        this.setState({
            userinfor:'none',
            opacity:0,
            scales:'scale(0.5,0.5)',
            visistatus:'hidden'
        })
    };
    userinfamend=()=>{
        this.setState({
            infor:'change',
        })
    };
    ages=(str)=>{
        let   r   =   str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
        if(r==null)return   false;
        let   d=   new   Date(r[1],   r[3]-1,   r[4]);
        if   (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4])
        {
            let   Y   =   new   Date().getFullYear();
            return((Y-r[1]));
        }
    };
    inforSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let _data={
                    sex :values.sex,
                    location : values.location,
                    age:values.age.format('YYYY-MM-DD'),
                    email:values.email,
                    gitHub:values.gitHub,
                    personalWeb:values.personalWeb
                };
                fetch("/upuser", {
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
                        message.info('更新成功');
                        this.setState({
                            age:this.ages(_data.age),
                            birthday:_data.age,
                            sex:_data.sex,
                            location:_data.location,
                            email:_data.email,
                            gitHub:_data.gitHub,
                            personalWeb:_data.personalWeb,
                            infor:'infor',
                        })
                    }else if(data.status=="err"){
                        message.error('更新失败');
                    }
                }).catch(err=>console.log(err));
            }



        });
    };
    infor=()=>{
        if(this.state.infor=="infor"){
            return(
                <div>
                    <div className="userinfli">
                        <Row style={{margin:5,padding:5}} type="flex" justify="end">
                            <Col className="userpro">性别:</Col><Col offset={1} span={13}>{this.state.sex}</Col>
                        </Row>
                        <Row style={{margin:5,padding:5}} type="flex" justify="end">
                            <Col className="userpro">位置:</Col><Col offset={1} span={13}>{this.state.location}</Col>
                        </Row>
                        <Row style={{margin:5,padding:5}} type="flex" justify="end">
                            <Col className="userpro">年龄:</Col><Col offset={1} span={13}>{this.state.age}</Col>
                        </Row>
                        <Row style={{margin:5,padding:5}} type="flex" justify="end">
                            <Col className="userpro">邮箱:</Col><Col offset={1} span={13}>{this.state.email}</Col>
                        </Row>
                        <Row style={{margin:5,padding:5}} type="flex" justify="end">
                            <Col className="userpro">GitHub:</Col><Col offset={1} span={13}>{this.state.gitHub}</Col>
                        </Row>
                        <Row style={{margin:5,padding:5}} type="flex" justify="end">
                            <Col className="userpro">个人网站:</Col><Col offset={1} span={13}>{this.state.personalWeb}</Col>
                        </Row>
                    </div>
                    <Button onClick={this.userinfamend} type="primary" style={{position: 'absolute',bottom:10, left:108}}>修改</Button>
                </div>
            )
        }else{
            const { getFieldDecorator } = this.props.form;
            return(
                <Form onSubmit={this.inforSubmit} className="login-form">
                    <div>
                        <div className="userinfli">
                            <Row style={{margin:5,padding:5}} type="flex" justify="end">
                                <Col className="userpro">性别:</Col>
                                <Col offset={1} span={13}>
                                    {getFieldDecorator('sex', {
                                        initialValue:(this.state.sex)
                                    })(
                                        <Select placeholder="Please select a country">
                                            <Option value="男">男</Option>
                                            <Option value="女">女</Option>
                                        </Select>
                                    )}
                                </Col>
                            </Row>
                            <Row style={{margin:5,padding:5}} type="flex" justify="end">
                                <Col className="userpro">位置:</Col>
                                <Col offset={1} span={13}>
                                    {getFieldDecorator('location', {
                                        initialValue:(this.state.location)
                                    })(
                                        <Input placeholder="位置" />
                                    )}
                                </Col>
                            </Row>
                            <Row style={{margin:5,padding:5}} type="flex" justify="end">
                                <Col className="userpro">年龄:</Col>
                                <Col offset={1} span={13}>
                                    {getFieldDecorator('age', {
                                        initialValue:(moment((this.state.birthday), 'YYYY-MM-DD'))
                                    })(
                                        <DatePicker/>
                                    )}
                                </Col>
                            </Row>
                            <Row style={{margin:5,padding:5}} type="flex" justify="end">
                                <Col className="userpro">邮箱:</Col>
                                <Col offset={1} span={13}>
                                    {getFieldDecorator('email', {
                                        initialValue:(this.state.email)
                                    })(
                                        <Input placeholder="email" />
                                    )}
                                </Col>
                            </Row>
                            <Row style={{margin:5,padding:5}} type="flex" justify="end">
                                <Col className="userpro">GitHub:</Col>
                                <Col offset={1} span={13}>
                                    {getFieldDecorator('gitHub', {
                                        initialValue:(this.state.gitHub)
                                    })(
                                        <Input placeholder="GitHub" />
                                    )}
                                </Col>
                            </Row>
                            <Row style={{margin:5,padding:5}} type="flex" justify="end">
                                <Col className="userpro">个人网站:</Col>
                                <Col offset={1} span={13}>
                                    {getFieldDecorator('personalWeb', {
                                        initialValue:(this.state.personalWeb)
                                    })(
                                        <Input placeholder="个人网站" />
                                    )}
                                </Col>
                            </Row>
                        </div>
                        <Button htmlType="submit" type="primary" style={{position: 'absolute',bottom:10, left:108}}>提交</Button>
                    </div>
                </Form>
            )
        }

    };

render(){
    return(
        <div>
            <img className="useravatar" id="useravatar" onClick={this.userClick} style={{height:60,width:60,borderRadius:65,margin:8,}} src={this.state.avatar}/>
            <div className="userinf" style={{opacity:this.state.opacity,transform:this.state.scales,visibility:this.state.visistatus}}>
                <img className="userheader"  src={this.state.avatar}/>
                <div className="username" id="username">{this.state.name}</div>
                {this.infor()}
            </div>
            <div className="backmark" onClick={this.userhide} style={{display:this.state.userinfor}}/>
        </div>
    );
}

}
const Infor = Form.create()(UserInfor);
export default  Infor;