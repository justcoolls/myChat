import React from 'react';
import { Form, Icon, Input, Button,message} from 'antd';
const FormItem = Form.Item;


class NormalRegisterForm extends React.Component{
    state = {
        confirmDirty: false,
    };

    registerSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                    if (!err) {
                        // console.log('Received values of form: ', values);
                        let data={
                            username :values.userName,
                            pwd : values.password
                        }
                        fetch("/register", {
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
                                document.cookie="token="+data.token;
                                window.location.href = "/myChat";
                            }else if(data.status=="lengtherr"){
                                message.info('用户名不能少于三位数');
                            }else if(data.status=="err"){
                                message.info('注册失败，用户名已存在');
                            }
                        }).catch(err=>console.log(err));
                    }
            }
        });
    };

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        return(
            <Form onSubmit={this.registerSubmit} className="login-form">
                <FormItem
                    hasFeedback
                >
                    {getFieldDecorator('userName', {
                        rules: [{
                            required: true, message: 'Please input your username!'
                        },{
                            validator: this.userConfirm,
                        }],
                    })(
                        <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} type="user" placeholder="Username" />
                    )}
                </FormItem>
                <FormItem
                    // label="Password"
                    hasFeedback
                >
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: 'Please input your password!',
                        }, {
                            validator: this.checkConfirm,
                        }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
                    )}
                </FormItem>
                <FormItem
                    // label="Confirm Password"
                    hasFeedback
                >
                    {getFieldDecorator('confirm', {
                        rules: [{
                            required: true, message: 'Please confirm your password!',
                        }, {
                            validator: this.checkPassword,
                        }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Confirm Password" onBlur={this.handleConfirmBlur} />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        注册
                    </Button>
                </FormItem>
            </Form>
        )
    }
}
const Register = Form.create()(NormalRegisterForm);
export default Register;



