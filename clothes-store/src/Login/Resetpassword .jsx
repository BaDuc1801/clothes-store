import React from 'react';
import { Button, Col, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Password from 'antd/es/input/Password';

const Resetpassword = () => {
    const [form] = Form.useForm(); 
    const nav = useNavigate();

    const onFinish = async (values) => {
        const data = window.localStorage.getItem('email');
        const rs = {
            email: JSON.parse(data),
            password: values.password
        }
        await axios.put("http://localhost:8080/users/reset-pass", rs);
        nav('/login');
    };
    
    return (
        <div className='ff'>
            <Form
                form={form}
                name="reset-password"
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
                <Col className='login-title'>Reset Password</Col>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password style={{ width: 400 }} />
                </Form.Item>

                <Form.Item
                    label="Confirm Password"
                    name="confirm password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password style={{ width: 400 }} />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 3,
                        span: 20,
                    }}
                >
                    <Button type="primary" htmlType="submit" style={{ width: 400 }}>
                        Back to Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Resetpassword;
