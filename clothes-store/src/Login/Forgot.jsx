import React from 'react';
import { Button, Col, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Forgot = () => {
    const nav = useNavigate();
    const [form] = Form.useForm();
    const onFinish = async (values) => {
        try {
            const result = await axios.post("http://localhost:8080/users/forgot", values)
            const otp = Object.keys(result.data.data)[0]
            alert("Your verification code is " + otp )
            window.localStorage.setItem('OTP', otp);
            window.localStorage.setItem('email', JSON.stringify(values.email));
            setTimeout(() => {
                window.localStorage.removeItem('OTP')
            }, 30000)
            setTimeout(() => {
                window.localStorage.remove('email');
            }, 60000)
            nav('/login/forgot/identify')
        } catch (error) {
            form.setFields([
                {
                    name: 'email',
                    errors: ['Email does not exist!'],
                },
            ]);
            setTimeout(() => { form.resetFields() }, 3000)
        }
    }

    return (
        <div className='ff'>
            <Form
                form={form}
                name="basic"
                labelCol={{
                    span: 6,
                }}
                wrapperCol={{
                    span: 14,
                }}
                style={{
                    width: '100vw',
                    textAlign: "center"
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                <Col className='login-title'>Forgot Password?</Col>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input valid email!',
                            type: 'email'
                        },
                    ]}
                >
                    <Input style={{ width: 400 }} />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 3,
                        span: 20,
                    }}
                >
                    <Button type="primary" htmlType="submit" style={{ width: 400 }}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
};
export default Forgot;