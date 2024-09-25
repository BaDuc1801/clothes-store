import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Modal } from 'antd';
import { CgShoppingCart } from 'react-icons/cg';
import { FaRegHeart } from 'react-icons/fa';
import { GiJetPack } from 'react-icons/gi';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { IoMdAddCircleOutline } from 'react-icons/io';

const LayoutPage = () => {
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);
    const [favouriteCount, setFavouriteCount] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const isAuthenticated = window.localStorage.getItem('authenticated') === 'true';
    const user = window.localStorage.getItem('user');
    const username = JSON.parse(user)?.username;
    const avatar = JSON.parse(user)?.avatar;

    useEffect(() => {
        setCartCount(parseInt(localStorage.getItem('cartCount')));
        setFavouriteCount(parseInt(localStorage.getItem('favouriteCount')));
    }, []);

    const updateFavouriteCount = (newCount) => {
        setFavouriteCount(newCount);
    };

    const updateCartCount = (newCount) => {
        setCartCount(newCount);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        navigate('/login');
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleClick = () => {
        if (!isAuthenticated) {
            setIsModalVisible(true);
        } else {
            navigate('/infor-item/favourites');
        }
    };

    const handleClick1 = () => {
        if (!isAuthenticated) {
            setIsModalVisible(true);
        } else {
            navigate('/infor-item/cart');
        }
    };

    let role = JSON.parse(localStorage.getItem('user'));

    return (
        <div>
            <div className='shop-section1'>
                <Link to='/' className='link-no-underline'>
                    <div className='icon-name-shop' style={{ cursor: 'pointer' }}>
                        <div className='icon-shop'><GiJetPack /></div>
                        <div className='name-shop'>Menly Store</div>
                    </div>
                </Link>
                <div className='client-space'>
                    {
                        (role?.role === "admin") && <div>
                            <div onClick={() => navigate('/add-item')} style={{ cursor: "pointer" }}>
                                <IoMdAddCircleOutline style={{fontSize:30}}/>
                            </div>
                        </div>
                    }
                    <div className='client-favourite'>
                        <div onClick={handleClick} style={{ cursor: "pointer" }}>
                            <Badge count={favouriteCount}>
                                <Avatar size="large" style={{ backgroundColor: "white" }}><FaRegHeart className='heart-icon' /></Avatar>
                            </Badge>
                        </div>
                    </div>
                    <div className='client-cart'>
                        <div onClick={handleClick1} style={{ cursor: "pointer" }}>
                            <Badge count={cartCount}>
                                <Avatar size="large" style={{ backgroundColor: "white" }}><CgShoppingCart className='shopping-cart' /></Avatar>
                            </Badge>
                        </div>
                    </div>
                    {!isAuthenticated ?
                        <div className='login'>
                            <button className='su-bt' onClick={() => { navigate('/sign-up') }}>Sign Up</button>
                            <button onClick={() => navigate('/login')}>Login</button>
                        </div> :
                        <div className='au'>
                            <div>{username}</div>
                            <div className='avt-img'><img src={avatar} />
                                <div className='menu-avt'>
                                    <div className='up-avt' onClick={() => navigate('/profile')}>Update Profile</div>
                                    <div className='change-pass' onClick={() => navigate('/change-password')}>Change Password</div>
                                    <div className='log-avt' onClick={() => {
                                        window.localStorage.setItem('authenticated', 'false');
                                        window.localStorage.setItem('cartCount', 0);
                                        window.localStorage.setItem('favouriteCount', 0);
                                        window.localStorage.setItem('listCart', []);
                                        window.localStorage.setItem('listFavourite', []);
                                        window.localStorage.removeItem('user');
                                        navigate('/login');
                                    }}>Logout</div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <Outlet context={{ updateFavouriteCount, updateCartCount }} />
            <Modal
                title='Authentication Required'
                open={isModalVisible}
                okText='Login'
                cancelText='Cancel'
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>You need to be logged in to perform this action.</p>
            </Modal>
        </div>
    );
};

export default LayoutPage;
