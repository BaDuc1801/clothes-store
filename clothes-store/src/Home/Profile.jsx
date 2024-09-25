import React, { useEffect, useState } from 'react';
import './Profile.css';
import { Modal, Form, Input, Button, Badge, Avatar } from 'antd';
import { FaCheckCircle, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';
import { GiJetPack } from 'react-icons/gi';
import { Link, useNavigate } from 'react-router-dom';
import { CgShoppingCart } from 'react-icons/cg';

const Profile = () => {
    const [form] = Form.useForm();
    const [selectedImage, setSelectedImage] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [imagePreview, setImagePreview] = useState(JSON.parse(localStorage.getItem('user')).avatar);
    const [cartCount, setCartCount] = useState(0);
    const [favouriteCount, setFavouriteCount] = useState(0);
    const [username, setUsername] = useState("");
    const [avatar, setAvatar] = useState("");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUsername(user.username);
            setAvatar(user.avatar);
        }
        setCartCount(parseInt(localStorage.getItem('cartCount')) || 0);
        setFavouriteCount(parseInt(localStorage.getItem('favouriteCount')) || 0);
    }, []);

    const navigate = useNavigate();

    const isAuthenticated = window.localStorage.getItem('authenticated') === 'true';

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleFileSelectClick = () => {
        document.getElementById('file-input').click();
    };

    const handleSubmit = async (values) => {
        try {
            let formData = new FormData();
            
            if (selectedImage) {
                formData.append('avatar', selectedImage);
                await axios.put('http://localhost:8080/users/up-avatar?email=' + values.email, formData);
            }
    
            await axios.put("http://localhost:8080/users/update-user", values);
    
            const updatedUser = {
                ...JSON.parse(localStorage.getItem('user')),
                ...values,
                avatar: selectedImage ? imagePreview : avatar 
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
    
            setUsername(values.username);
            setAvatar(selectedImage ? imagePreview : avatar);
    
            setOpenModal(true);
        } catch (error) {
            console.error("Error:", error);
        }
    };
    

    const handleOk = () => {
        setOpenModal(false);
    };

    const handleCancel = () => {
        form.resetFields();
    };

    return (
        <>
            <div className='shop-section1'>
                <Link to='/' className='link-no-underline'>
                    <div className='icon-name-shop' style={{ cursor: 'pointer' }}>
                        <div className='icon-shop'><GiJetPack /></div>
                        <div className='name-shop'>Menly Store</div>
                    </div>
                </Link>
                <div className='client-space'>
                    <div className='client-favourite'>
                        <Badge count={favouriteCount}>
                            <Avatar size="large" style={{ backgroundColor: "white" }}><FaRegHeart className='heart-icon' /></Avatar>
                        </Badge>
                    </div>
                    <div className='client-cart'>
                        <Badge count={cartCount}>
                            <Avatar size="large" style={{ backgroundColor: "white" }}><CgShoppingCart className='shopping-cart' /></Avatar>
                        </Badge>
                    </div>
                    {!isAuthenticated ? (
                        <div className='login'>
                            <button className='su-bt' onClick={() => navigate('/sign-up')}>Sign Up</button>
                            <button onClick={() => navigate('/login')}>Login</button>
                        </div>
                    ) : (
                        <div className='au'>
                            <div>{username}</div>
                            <div className='avt-img'>
                                <img src={avatar} alt="User Avatar" />
                                <div className='menu-avt'>
                                    <div className='up-avt' onClick={() => navigate('/profile')}>Update Profile</div>
                                    <div className='change-pass' onClick={() => navigate('/change-password')}>Change Password</div>
                                    <div className='log-avt' onClick={() => {
                                        window.localStorage.setItem('authenticated', 'false');
                                        window.localStorage.removeItem('user');
                                        navigate('/login');
                                    }}>Logout</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="tc-add-std-detail"
                initialValues={{
                    username: JSON.parse(localStorage.getItem('user')).username, 
                    email: JSON.parse(localStorage.getItem('user')).email,
                    address: JSON.parse(localStorage.getItem('user')).address,
                    phone: JSON.parse(localStorage.getItem('user')).phone,
                    place: JSON.parse(localStorage.getItem('user')).place
                }}
            >
                <div className="tc-add-std-head">
                    <p>User Details</p>
                </div>
                <table className="tc-table-input">
                    <tr>
                        <td rowSpan={2} style={{ verticalAlign: 'top', width: 180, paddingRight: 40 }}>
                            <p>Photo</p>
                            <div className="tc-add-photo" onClick={handleFileSelectClick}>
                                <img src={imagePreview} alt="Selected" style={{ width: '100%', height: '100%' }} />
                            </div>
                            <input
                                type="file"
                                style={{ display: 'none' }}
                                id="file-input"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </td>
                        <td style={{ width: 450, paddingRight: 40 }}>
                            <Form.Item
                                name="username"
                                label={<p style={{ color: '#303972', fontSize: 18 }}>Name</p>}
                                rules={[{ required: true, message: 'Please input user name!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </td>
                        <td style={{ width: 400, paddingRight: 40 }}>
                            <Form.Item
                                name="phone"
                                label={<p style={{ color: '#303972', fontSize: 18 }}>Phone number</p>}
                            >
                                <Input placeholder="+1234567890" />
                            </Form.Item>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ width: 400, paddingRight: 40 }}>
                            <Form.Item
                                name="email"
                                label={<p style={{ color: '#303972', fontSize: 18 }}>Email</p>}
                                rules={[{ required: true, message: 'Please input email!' }]}
                            >
                                <Input disabled />
                            </Form.Item>
                        </td>
                        <td style={{ width: 400, paddingRight: 40 }}>
                            <Form.Item
                                name="place"
                                label={<p style={{ color: '#303972', fontSize: 18 }}>Place of Birth</p>}
                            >
                                <Input placeholder="Place of Birth" />
                            </Form.Item>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td style={{ paddingRight: 40 }}>
                            <Form.Item
                                name="address"
                                label={<p style={{ color: '#303972', fontSize: 18 }}>Address</p>}
                            >
                                <Input.TextArea placeholder="Enter your address here" />
                            </Form.Item>
                        </td>
                        <td></td>
                    </tr>
                </table>
                <div className='tc-2-btn'>
                    <Button type="default" onClick={handleCancel} className="tc-table-cc">
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" className="tc-table-sm">
                        Submit
                    </Button>
                </div>
            </Form>

            <Modal
                title={<span style={{ color: '#3d32b8' }}>Form Submitted</span>}
                open={openModal}
                onOk={handleOk}
                okButtonProps={{ style: { backgroundColor: '#1677FF' } }}
                okText="OK"
                cancelButtonProps={{ style: { color: '#1677FF' } }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3d32b8', fontSize: 40 }}>
                    <FaCheckCircle />
                </div>
                <div style={{ color: '#3d32b8', fontSize: 22, textAlign: 'center' }}>
                    User updated successfully!
                </div>
            </Modal>
        </>
    );
};

export default Profile;
