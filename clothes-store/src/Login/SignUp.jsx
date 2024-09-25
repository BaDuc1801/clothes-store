import { Col, Form, Input, Row, Button } from 'antd'
import axios from 'axios';
import React from 'react'
import { GiJetPack } from 'react-icons/gi'
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await axios.post("http://localhost:8080/users/register", values);
      window.localStorage.setItem('authenticated', 'true');
      nav('/login');
    } catch (error) {
      form.setFields([
        {
          name: 'email',
          errors: ['Email already exists!'],
        },
      ]);
      setTimeout(() => { form.resetFields() }, 3000)
    }
  };

  const nav = useNavigate();
  return (
    <div>
      <Row>
        <Col span={12} style={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "white", height: "100vh" }}>
          <div className='icon-name-l'>
            <div className='icon-l'><GiJetPack /></div>
            <div className='name-l'>Menly Store</div>
          </div>
        </Col>
        <Col span={12}>
          <div className='ff'>
            <Form
              form={form}
              name="reset-password"
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                textAlign: "center"
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <Col className='login-title'>Start your journey!</Col>
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Please input your username!',
                  },
                ]}
              >
                <Input style={{ width: 400 }} />
              </Form.Item>
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
                name="confirmPassword"
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
                  offset: 6,
                }}
              >
                <Button type="primary" htmlType="submit" style={{ width: 400 }}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default SignUp
