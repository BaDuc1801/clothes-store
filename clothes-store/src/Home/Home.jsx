import { Avatar, Badge, Modal, Pagination, Select, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { FaBorderAll, FaRegHeart } from 'react-icons/fa';
import { GiJetPack } from 'react-icons/gi';
import { IoBagHandleOutline, IoSearch } from 'react-icons/io5';
import { CgShoppingCart } from 'react-icons/cg';
import { LuShirt } from 'react-icons/lu';
import { PiPants, PiSunglasses } from 'react-icons/pi';
import { TbShoe } from 'react-icons/tb';
import axios from 'axios';
import ListItems from './ListItems.jsx';
import './Home.css'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoMdAddCircleOutline } from 'react-icons/io';

const Home = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [searchItem, setSearchItem] = useState(new URLSearchParams(location.search).get('searchItem') || '');
    const [currentPage, setCurrentPage] = useState(parseInt(new URLSearchParams(location.search).get('currentPage')) || 1);
    const pageSize = 12;
    const [totalItems, setTotalItems] = useState(1);
    const [sortBy, setSortBy] = useState(new URLSearchParams(location.search).get('sortBy') || 'createdAt');
    const [sortType, setSortType] = useState(parseInt(new URLSearchParams(location.search).get('sortType')) || -1);
    const [cartCount, setCartCount] = useState(0);
    const [favouriteCount, setFavouriteCount] = useState(0);
    const [tabKey, setTabKey] = useState('');

    useEffect(() => {
        setCartCount(parseInt(localStorage.getItem('cartCount')));
        setFavouriteCount(parseInt(localStorage.getItem('favouriteCount')));
    }, [cartCount, favouriteCount]);

    const fetchData = async () => {
        try {
            const res = await axios.get(
                `http://localhost:8080/items?currentPage=${currentPage}&pageSize=${pageSize}&sortBy=${sortBy}&sortType=${sortType}&searchValue=${searchItem}&filterData=${tabKey}`
            );
            setData(res.data.items);
            setTotalItems(res.data.totalItems);
        } catch (error) {
            setData([]);
            setTotalItems(0);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, sortBy, sortType, searchItem, tabKey]);

    const updateQueryParams = (params) => {
        const searchParams = new URLSearchParams(location.search);
        Object.keys(params).forEach(key => {
            searchParams.set(key, params[key]);
        });
        navigate(`?${searchParams.toString()}`, { replace: true });
    };

    let role = JSON.parse(localStorage.getItem('user'));

    const handleOptionChange = (value) => {
        let sortBy, sortType;
        switch (value) {
            case 'price-asc':
                sortBy = 'priceNum';
                sortType = 1;
                break;
            case 'price-desc':
                sortBy = 'priceNum';
                sortType = -1;
                break;
            case 'oldest':
                sortBy = 'createdAt';
                sortType = 1;
                break;
            case 'newest':
                sortBy = 'createdAt';
                sortType = -1;
                break;
            default:
                sortBy = 'createdAt';
                sortType = -1;
        }
        setSortBy(sortBy);
        setSortType(sortType);
        updateQueryParams({ currentPage: 1, sortBy, sortType });
    };

    const handleSearch = (e) => {
        const searchValue = e.target.value;
        setSearchItem(searchValue);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        updateQueryParams({ currentPage: page });
    };

    const items = [
        {
            key: '1',
            icon: <FaBorderAll />,
            label: 'All',
            children: data.length > 0 ? (
                <div className='item-infor'>
                    {data.map((item, index) => (
                        <ListItems item={item} index={index} key={index} />
                    ))}
                </div>
            ) : (
                <div>Loading...</div>
            )
        },
        {
            key: '2',
            icon: <LuShirt />,
            label: 'Shirts',
            children: data.length > 0 ? (
                <div className='item-infor'>
                    {data.filter(item => item.type === "shirt").map((item, index) => (
                        <ListItems item={item} index={index} key={index} />
                    ))}
                </div>
            ) : (
                <div>Loading...</div>
            )
        },
        {
            key: '3',
            icon: <PiPants />,
            label: 'Pants',
            children: data.length > 0 ? (
                <div className='item-infor'>
                    {data.filter(item => item.type === "pants").map((item, index) => (
                        <ListItems item={item} index={index} key={index} />
                    ))}
                </div>
            ) : (
                <div>Loading...</div>
            )
        },
        {
            key: '4',
            icon: <TbShoe />,
            label: 'Shoes',
            children: data.length > 0 ? (
                <div className='item-infor'>
                    {data.filter(item => item.type === "shoe").map((item, index) => (
                        <ListItems item={item} index={index} key={index} />
                    ))}
                </div>
            ) : (
                <div>Loading...</div>
            )
        },
        {
            key: '5',
            icon: <IoBagHandleOutline />,
            label: 'Bags',
            children: data.length > 0 ? (
                <div className='item-infor'>
                    {data.filter(item => item.type === "bag").map((item, index) => (
                        <ListItems item={item} index={index} key={index} />
                    ))}
                </div>
            ) : (
                <div>Loading...</div>
            )
        },
        {
            key: '6',
            icon: <PiSunglasses />,
            label: 'Accessories',
            children: data.length > 0 ? (
                <div className='item-infor'>
                    {data.filter(item => item.type === "accessories").map((item, index) => (
                        <ListItems item={item} index={index} key={index} />
                    ))}
                </div>
            ) : (
                <div>Loading...</div>
            )
        }
    ];

    const handleTabChange = (key) => {
        let filterValue = '';
        switch (key) {
            case '1':
                filterValue = '';
                break;
            case '2':
                filterValue = 'shirt';
                break;
            case '3':
                filterValue = 'pants';
                break;
            case '4':
                filterValue = 'shoe';
                break;
            case '5':
                filterValue = 'bag';
                break;
            case '6':
                filterValue = 'accessories';
                break;
            default:
                filterValue = '';
        }

        setTabKey(filterValue);
        setCurrentPage(1);
        fetchData();
    };

    const signUpButton = () => {
        navigate('/sign-up')
    }

    const loginButton = () => {
        navigate('/login')
    }

    const logoutButton = () => {
        window.localStorage.setItem('authenticated', 'false');
        window.localStorage.setItem('cartCount', 0);
        window.localStorage.setItem('favouriteCount', 0);
        window.localStorage.setItem('listCart', []);
        window.localStorage.setItem('listFavourite', []);
        window.localStorage.removeItem('user');
        navigate('/login')
    }

    const isAuthenticated = window.localStorage.getItem('authenticated') === 'true';
    const user = window.localStorage.getItem('user');
    const username = JSON.parse(user)?.username
    const avatar = JSON.parse(user)?.avatar


    const handleOk = () => {
        setIsModalVisible(false);
        navigate('/login');
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const [isModalVisible, setIsModalVisible] = useState(false);

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

    return (
        <div>
            <div className='shop-section1'>
                <Link to='/' className='link-no-underline'>
                    <div className='icon-name-shop' style={{ cursor: 'pointer' }}>
                        <div className='icon-shop'><GiJetPack /></div>
                        <div className='name-shop'>Menly Store</div>
                    </div>
                </Link>
                <div className='input-search'>
                    <input placeholder='Search products...' onChange={handleSearch} value={searchItem} />
                    <div className='icon-search'><IoSearch /></div>
                </div>
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
                            <button className='su-bt' onClick={() => { signUpButton() }}>Sign Up</button>
                            <button onClick={() => loginButton()}>Login</button>
                        </div> :
                        <div className='au'>
                            <div>{username}</div>
                            <div className='avt-img'><img src={avatar} />
                                <div className='menu-avt'>
                                    <div className='up-avt' onClick={() => navigate('/profile')}>Update Profile</div>
                                    <div className='change-pass' onClick={() => navigate('/change-password')}>Change Password</div>
                                    <div className='log-avt' onClick={() => logoutButton()}>Logout</div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className='shop-tab'>
                <div className='shop-select'>
                    <Select
                        className='select-op'
                        value={sortBy === 'priceNum' && sortType === 1 ? 'price-asc' : sortBy === 'priceNum' && sortType === -1 
                        ? 'price-desc' : sortBy === 'createdAt' && sortType === 1 ? 'oldest' : 'newest'}
                        onChange={handleOptionChange}
                        options={[
                            { value: 'newest', label: 'Sort by Newest' },
                            { value: 'oldest', label: 'Sort by Oldest' },
                            { value: 'price-asc', label: 'Sort by Price: Low to High' },
                            { value: 'price-desc', label: 'Sort by Price: High to Low' }
                        ]}
                    />
                </div>
                <Tabs className='tabs' defaultActiveKey="1" items={items} onChange={handleTabChange} />
                <Pagination className="pagi" current={currentPage} pageSize={pageSize} 
                showSizeChanger={false} total={totalItems} onChange={handlePageChange} />
            </div>
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

export default Home;
