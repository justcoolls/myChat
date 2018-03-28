import React from 'react';
import { Form, Icon, Input, Button,message} from 'antd';
const FormItem = Form.Item;


class NormalRegisterForm extends React.Component{
    state = {
        confirmDirty: false,
    };

    loginSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                let data={
                    username :values.userNamel,
                    pwd : values.passwordl
                };
                fetch("/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body:JSON.stringify(data),
                    credentials: 'include',
                }).then(res=>{
                    return res.json();
                }).then(data=>{
                    if(data.status=="success"){
                        message.info('登陆成功');
                        document.cookie="token="+data.token;
                        window.location.href = "/mychat";
                    }else if(data.status=="err"){
                        message.error('用户名或密码错误');
                    }
                }).catch(err=>console.log(err));
            }
        });
    };

    render(){
        const { getFieldDecorator } = this.props.form;
        return(
            <Form onSubmit={this.loginSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('userNamel', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('passwordl', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        登录
                    </Button>
                </FormItem>
            </Form>
        )
    }
}
const Login = Form.create()(NormalRegisterForm);
export default Login;



