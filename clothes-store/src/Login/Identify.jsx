import { Button, Col, Input, Form, message } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Identify() {
  const nav = useNavigate();
  const [form] = Form.useForm();
  const [otp, setOtp] = useState(() => {
    const storedOtp = window.localStorage.getItem('OTP');
    return storedOtp ? JSON.parse(storedOtp) : '';
  });

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleVerify = () => {
    const enteredOtp = form.getFieldValue('otp');
    if (enteredOtp == otp) {
      message.success('OTP verified successfully!');
      nav('/login/forgot/identify/resetpassword');
    } else {
      form.setFields([
        {
          name: 'otp',
          errors: ['Invalid OTP'],
        },
      ]);
    }
  };

  const handleResend = () => {
    const newOtp = generateOtp();
    window.localStorage.setItem('OTP', JSON.stringify(newOtp));
    setOtp(newOtp); 
    alert("Your verification code is " + newOtp )
    setTimeout(() => {
        window.localStorage.removeItem('OTP')
    }, 30000)
  };

  return (
    <div className='identify-container'>
      <Col className='identify'>
        <Col className='login-title'>Enter Verification Code</Col>
        <p className='for-p'>We have just sent a verification code to your email</p>
        <Form
          form={form}
          name="identify"
          initialValues={{ otp: '' }}
        >
          <Col className='code-input'>
            <Form.Item
              name="otp"
              rules={[{ required: true, message: 'Please enter the verification code!' }]}
            >
              <Input className='pin' maxLength={6} />
            </Form.Item>
          </Col>
        </Form>
        <Button className='identify-but' type="primary" onClick={handleVerify}>
          Verify
        </Button>
        <br />
        <Button className='resend-but' onClick={handleResend}>
          Resend Code
        </Button>
      </Col>
    </div>
  );
}

export default Identify;
