import React from 'react';
import { Button, Col, Form, Input, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GiJetPack } from 'react-icons/gi';

const Changepassword = () => {
    const [form] = Form.useForm();
    const nav = useNavigate();

    const onFinish = async (values) => {
        const rs = {
            oldP: values.oldP,
            newP: values.newP
        }
        await axios.put("http://localhost:8080/users/change-password", rs);
        nav('/login');
    };

    return (
        <Row style={{ height: "100vh" }}>
            <Col span={12} style={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
                <div className='icon-name-l'>
                    <div className='icon-l'><GiJetPack style={{ fontSize: 80 }} /></div>
                    <div className='name-l' style={{ fontSize: 32, fontWeight: 'bold' }}>Menly Store</div>
                </div>
            </Col>

            <Col span={12} style={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f0f2f5" }}>
                <div style={{ width: "100%", maxWidth: 400 }}>
                    <Form
                        form={form}
                        name="reset-password"
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        onFinish={onFinish}
                        style={{
                            textAlign: "center",
                            padding: "40px",
                            backgroundColor: "white",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <Row className='login-title'>
                            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Change Password</h2>
                        </Row>

                        <Form.Item
                            label="Old Password"
                            name="oldP"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your old password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="New Password"
                            name="newP"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your new password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="Confirm New Password"
                            name="confirm"
                            dependencies={['newP']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your new password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newP') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The two passwords do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                                Change Password
                            </Button>
                        </Form.Item>

                        <Form.Item>
                            <Button onClick={() => nav('/')} style={{ width: "100%" }}>
                                Back to Home
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Col>
        </Row>
    );
};

export default Changepassword;
