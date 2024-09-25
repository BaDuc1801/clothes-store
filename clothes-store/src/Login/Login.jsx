import React from 'react';
import { Button, Checkbox, Col, Form, Input, Row } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const result = await axios.post("http://localhost:8080/users/login", values);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + result.data.accessToken;
      window.localStorage.setItem('user', JSON.stringify(result.data));
      window.localStorage.setItem('authenticated', 'true');
      window.localStorage.setItem('cartCount', result.data.cart.length)
      window.localStorage.setItem('favouriteCount', result.data.favourites.length)
      const response = await axios.get("http://localhost:8080/users/get-user");
      window.localStorage.setItem('listFavourite', JSON.stringify(response.data.favourites))
      window.localStorage.setItem('listCart', JSON.stringify(response.data.cart))
      navigate('/');
    } catch (error) {
      form.setFields([
        {
          name: 'email',
          errors: [''],
        },
        {
          name: 'password',
          errors: ['Email or Password is incorrect'],
        },
      ]);
      setTimeout(() => { form.resetFields() }, 3000)
    }
  };

  const without = () => {
    window.localStorage.setItem('cartCount', 0)
    window.localStorage.setItem('favouriteCount', 0)
    navigate('/')
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
        <Col className='login-title'>Welcome!</Col>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input your email!',
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
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 3,
            span: 15,
          }}
        >
          <Row className='login-flex'>
            <Checkbox>Remember me</Checkbox>
            <Link to='/login/forgot'>Forget Password</Link>
          </Row>
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

        <Form.Item
          wrapperCol={{
            offset: 3,
            span: 20,
          }}
        >
          <Row className='login-flex'>
            <p>Don't have an account yet?</p>
            <Link to='/sign-up'>Create account</Link>
          </Row>
          <Row className='login-flex' style={{ marginTop: 10 }}>
            <Link
              to='#'
              onClick={(e) => {
                e.preventDefault(); 
                without();         
              }}
            >Join without an account</Link>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
