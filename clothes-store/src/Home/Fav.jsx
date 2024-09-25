import React, { useEffect, useState } from 'react';
import './Fav.css';
import { Modal, Table } from 'antd';
import axios from 'axios';
import { MdDeleteOutline } from 'react-icons/md';
import { useOutletContext } from 'react-router-dom';
import { CgShoppingCart } from 'react-icons/cg';

const Fav = () => {
    const [items, setItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const { updateFavouriteCount, updateCartCount } = useOutletContext();

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('listFavourite'))
        setItems(items)

        const cartItems = JSON.parse(localStorage.getItem('listCart'));
        setCartItems(cartItems)
    }, [refreshData])

    const columns = [
        {
            title: <span style={{ color: '#303972' }}>Image</span>,
            dataIndex: 'img',
            render: (text) => <img src={text[0]} style={{ width: 100, height: 100 }} alt="Item" />,
        },
        {
            title: <span style={{ color: '#303972' }}>Item</span>,
            dataIndex: 'itemName',
            render: (text) => <a style={{ fontSize: 18 }}>{text}</a>,
        },
        {
            title: <span style={{ color: '#303972' }}>Price</span>,
            dataIndex: 'price',
            render: (text) => <p style={{ fontSize: 18 }}>{text}$</p>,
        },
        {
            title: <span style={{ color: '#303972' }}>Action</span>,
            dataIndex: 'action',
            align: 'right',
            render: (_, record) => {
                const isInCart = cartItems.some(cartItem => cartItem._id === record._id);
                return (
                    <div style={{ textAlign: "right" }} className='action-flex'>
                        {!isInCart && (
                            <CgShoppingCart className='shopping-cart-a' onClick={() => onDisplay(record)} />
                        )}
                        <MdDeleteOutline
                            onClick={() => confirmDelete(record)}
                            style={{ color: 'red', cursor: 'pointer', marginLeft: 10, fontSize: 26 }}
                        />
                    </div>
                )
            },
        },
    ];

    const confirmDelete = (record) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this item?',
            content: `Item: ${record.itemName}`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => onDelItem(record),
        });
    };

    const onDisplay = async (record) => {
        try {
            await axios.delete("http://localhost:8080/users/delete-favourite", { data: { itemID: record._id } });
            
            await axios.post("http://localhost:8080/users/add-to-cart", { itemID: record._id });
    
            const updatedItems = items.filter(fav => fav._id !== record._id);
            setItems(updatedItems);
            localStorage.setItem('listFavourite', JSON.stringify(updatedItems));
            updateFavouriteCount(updatedItems.length);
    
            const currentFavouriteCount = parseInt(localStorage.getItem('favouriteCount')) || 0;
            localStorage.setItem('favouriteCount', currentFavouriteCount - 1);
    
            const updatedCart = [...cartItems, record];
            setCartItems(updatedCart);
            localStorage.setItem('listCart', JSON.stringify(updatedCart));
    
            const currentCartCount = updatedCart.length;
            localStorage.setItem('cartCount', currentCartCount);
            updateCartCount(currentCartCount);
            setRefreshData(prev => !prev);
    
        } catch (error) {
            console.error("Error processing item:", error);
        }
    };

    const onDelItem = async (record) => {
        try {
            await axios.delete("http://localhost:8080/users/delete-favourite", {
                data: { itemID: record._id }
            });

            const updatedItems = items.filter(fav => fav._id !== record._id);
            setItems(updatedItems);
            localStorage.setItem('listFavourite', JSON.stringify(updatedItems));
            updateFavouriteCount(updatedItems.length);
            const a = parseInt(localStorage.getItem('favouriteCount'));
            localStorage.setItem('favouriteCount', a - 1);
            setRefreshData(prev => !prev);
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    return (
        <div>
            <div className='table-css'>
                <Table
                    columns={columns}
                    dataSource={items}
                    pagination={false}
                />
            </div>
        </div>
    );
};

export default Fav;
