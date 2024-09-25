import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { Col, InputNumber, Modal, Rate, Row, Input } from 'antd';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import PreviewItem from './PreviewItem.jsx';
import './ClickItems.css';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';

const ClickItems = () => {
    const location = useLocation();
    const { item } = location.state;
    const navigate = useNavigate();
    const { updateFavouriteCount, updateCartCount } = useOutletContext();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [heart, setHeart] = useState(<FaRegHeart />);
    const [isFavourite, setIsFavourite] = useState(false);
    const [itemName, setItemName] = useState(item.itemName);
    const [itemDescription, setItemDescription] = useState(item.description);
    const [itemPrice, setItemPrice] = useState(item.price);

    const isAuthenticated = window.localStorage.getItem('authenticated') === 'true';
    let user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const checkHeart = async () => {
            if (user && user.favourites.includes(item._id)) {
                setHeart(<FaHeart color='red' />);
                setIsFavourite(true);
            } else {
                setHeart(<FaRegHeart />);
                setIsFavourite(false);
            }
        };

        if (isAuthenticated && item) {
            checkHeart();
        }
    }, [item._id, isAuthenticated]);

    const toggleHeart = async () => {
        if (!isAuthenticated) {
            setIsModalVisible(true);
            return;
        }
        try {
            let favouriteCount = parseInt(localStorage.getItem("favouriteCount")) || 0;
            let listFavourite = JSON.parse(localStorage.getItem('listFavourite')) || [];

            if (isFavourite) {
                await axios.delete("http://localhost:8080/users/delete-favourite", { data: { itemID: item._id } });
                setHeart(<FaRegHeart />);
                setIsFavourite(false);
                favouriteCount -= 1;
                listFavourite = listFavourite.filter(fav => fav._id !== item._id);
            } else {
                await axios.post("http://localhost:8080/users/add-to-favourite", { itemID: item._id });
                setHeart(<FaHeart color='red' />);
                setIsFavourite(true);
                favouriteCount += 1;
                if (!listFavourite.some(fav => fav._id === item._id)) {
                    listFavourite.push(item);
                }
            }

            localStorage.setItem('listFavourite', JSON.stringify(listFavourite));
            localStorage.setItem("favouriteCount", favouriteCount);
            updateFavouriteCount(favouriteCount);
        } catch (error) {
            console.error("Error toggling favourite:", error);
        }
    };

    const addToCart = async () => {
        if (isAuthenticated) {
            try {
                await axios.post("http://localhost:8080/users/add-to-cart", { itemID: item._id });
                let cartCount = parseInt(localStorage.getItem("cartCount")) || 0;
                let listCart = JSON.parse(localStorage.getItem('listCart')) || [];

                cartCount += 1;
                updateCartCount(cartCount);
                localStorage.setItem("cartCount", cartCount);

                if (!listCart.some(cartItem => cartItem._id === item._id)) {
                    listCart.push(item);
                    localStorage.setItem('listCart', JSON.stringify(listCart));
                }
            } catch (error) {
                console.error("Error adding to cart:", error);
            }
        } else {
            setIsModalVisible(true);
        }
    };

    const handleButtonClick = () => {
        if (!isAuthenticated) {
            setIsModalVisible(true);
        }
    };

    const handleOk = () => {
        setIsModalVisible(false);
        navigate('/login');
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const openEditModal = () => {
        setItemName(item.itemName);
        setItemDescription(item.description);
        setItemPrice(item.price);
        setIsEditModalVisible(true);
    };

    const handleEditSubmit = async () => {
        try {
            await axios.put(`http://localhost:8080/items/update-item/${item._id}`, {
                itemName,
                description: itemDescription,
                price: itemPrice,
            });
            setIsEditModalVisible(false);
            navigate('/');
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };

    const confirmDelete = () => {
        setIsDeleteModalVisible(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/items/delete-item/${item._id}`);
            setIsDeleteModalVisible(false);
            navigate('/');
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    return (
        <div className='infor-item'>
            <Row>
                <Col>
                    {<PreviewItem item={item} />}
                </Col>
                <Col className='col-infor' span={14}>
                    <p className='infor-name'>{item.itemName}</p>
                    <div className='infor-evaluate-sold'>
                        <div className='infor-evaluate'>
                            <Rate allowHalf disabled value={item.evaluate} />
                        </div>
                        <p className='infor-sold'>Sold: {item.sold}</p>
                    </div>
                    <p className='infor-price'>Price: {item.price}$</p>
                    <p className='infor-description'><span className='des'>Description: </span>{item.description}</p>
                    <div className='flex-remain'>
                        <InputNumber className='input-num' min={1} max={item.remaining} defaultValue={1} />
                        <p className='infor-rm'>{item.remaining} remaining</p>
                    </div>
                    <div className='two-button'>
                        <div>
                            <button className='add-to-cart' onClick={addToCart}>Add to Cart</button>
                            <button className='buy-now' onClick={handleButtonClick}>Buy Now</button>
                        </div>
                        <div>
                            <button className='add-favourite' onClick={toggleHeart}>Favourite {heart}</button>
                        </div>
                    </div>
                    {(user?.role === "admin") && (
                        <div className='admin'>
                            <button className='edit-item' onClick={openEditModal}>Edit <CiEdit /></button>
                            <button className='delete-item' onClick={confirmDelete}>Delete <MdDeleteOutline /></button>
                        </div>
                    )}
                </Col>
            </Row>

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

            <Modal
                title='Edit Item'
                open={isEditModalVisible}
                onOk={handleEditSubmit}
                onCancel={() => setIsEditModalVisible(false)}
            >
                <p>Name:</p>
                <Input
                    placeholder='Item Name'
                    value={itemName}
                    onChange={e => setItemName(e.target.value)}
                />
                <p>Description:</p>
                <Input.TextArea
                    placeholder='Description'
                    value={itemDescription}
                    onChange={e => setItemDescription(e.target.value)}
                />
                <p>Price:</p>
                <Input
                    type='number'
                    placeholder='Price'
                    value={itemPrice}
                    onChange={e => setItemPrice(e.target.value)}
                />
            </Modal>

            <Modal
                title='Confirm Deletion'
                open={isDeleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
            >
                <p>Are you sure you want to delete this item?</p>
            </Modal>
        </div>
    );
};

export default ClickItems;
