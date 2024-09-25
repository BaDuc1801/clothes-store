import { Table, Modal, Button, Divider, Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';

const Cart = () => {
    const [items, setItems] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal for Checkout
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false); // Modal for Order Success
    const [isInfoModalVisible, setIsInfoModalVisible] = useState(false); // Modal for User Info
    const [form] = Form.useForm(); 
    const { updateCartCount } = useOutletContext();

    useEffect(() => {
        const storedItems = JSON.parse(localStorage.getItem('listCart')) || [];
        const itemsWithKey = storedItems.map((item) => ({
            ...item,
            key: item._id,
        }));
        setItems(itemsWithKey);
    }, [refreshData]);

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
            render: (_, record) => (
                <div style={{ textAlign: "right" }} className='action-flex'>
                    <MdDeleteOutline
                        onClick={() => confirmDelete(record)}
                        style={{ color: 'red', cursor: 'pointer', marginLeft: 10, fontSize: 26 }}
                    />
                </div>
            ),
        },
    ];

    const confirmDelete = (record) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this item?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => onDeleteItems(record),
        });
    };

    const onDeleteItems = async (record) => {
        try {
            const itemsToDelete = selectedRowKeys.length > 0 ? selectedRowKeys : [record.key];
            const itemIDsToDelete = itemsToDelete.map(key => items.find(item => item.key === key)._id);

            for (const itemID of itemIDsToDelete) {
                await axios.delete("http://localhost:8080/users/delete-cart", {
                    data: { itemID: itemID }
                });
            }

            const updatedItems = items.filter(item => !itemsToDelete.includes(item.key));
            setItems(updatedItems);
            localStorage.setItem('listCart', JSON.stringify(updatedItems));

            const updatedCartCount = updatedItems.length;
            updateCartCount(updatedCartCount);
            localStorage.setItem('cartCount', updatedCartCount); 

            setSelectedRowKeys([]);
            setRefreshData(prev => !prev);

        } catch (error) {
            console.error("Error deleting items:", error);
        }
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
    };

    const calculateTotal = () => {
        const selectedItems = items.filter(item => selectedRowKeys.includes(item.key));
        return selectedItems.reduce((total, item) => total + Number(item.price), 0);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOrder = async () => {
        setIsModalVisible(false);
        setIsInfoModalVisible(true);
    };

    const handleSuccessOk = () => {
        setIsSuccessModalVisible(false);
    };

    const handleInfoSubmit = async (values) => {
        setIsInfoModalVisible(false);
        setIsSuccessModalVisible(true);

        try {
            const itemsToDelete = selectedRowKeys.map(key => items.find(item => item.key === key)._id);

            for (const itemID of itemsToDelete) {
                await axios.delete("http://localhost:8080/users/delete-cart", {
                    data: { itemID: itemID }
                });
            }

            const updatedItems = items.filter(item => !selectedRowKeys.includes(item.key));
            setItems(updatedItems);
            localStorage.setItem('listCart', JSON.stringify(updatedItems));
            localStorage.setItem('cartCount', updatedItems.length); 

            const updatedCartCount = updatedItems.length;
            updateCartCount(updatedCartCount);
            setSelectedRowKeys([]);

        } catch (error) {
            console.error("Error placing order:", error);
        }
    };

    const handleInfoCancel = () => {
        setIsInfoModalVisible(false);
    };

    return (
        <div>
            <div className='table-css'>
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={items}
                    pagination={false}
                />
            </div>
            <div className='thanhtoan'>
                <Button
                    type="primary"
                    onClick={showModal}
                    disabled={selectedRowKeys.length === 0}
                    style={{ marginTop: 20, padding: "10px 20px" }}
                >
                    Checkout
                </Button>
            </div>
            <Modal
                title="Order Details"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <h3>Selected items:</h3>
                <ul>
                    {items
                        .filter(item => selectedRowKeys.includes(item.key))
                        .map((item) => (
                            <li key={item.key}>
                                {item.itemName} - {item.price}$
                            </li>
                        ))}
                </ul>
                <Divider />
                <h3>Total Price: {calculateTotal()}$</h3>
                <div style={{ textAlign: 'right', marginTop: 20 }}>
                    <Button onClick={handleCancel} style={{ marginRight: 10 }}>
                        Cancel
                    </Button>
                    <Button type="primary" onClick={handleOrder}>
                        Place Order
                    </Button>
                </div>
            </Modal>

            <Modal
                title="Enter Your Information"
                open={isInfoModalVisible}
                onCancel={handleInfoCancel}
                footer={null}
            >
                <Form form={form} onFinish={handleInfoSubmit} layout="vertical"
                initialValues={{
                    username: JSON.parse(localStorage.getItem('user')).username, 
                    address: JSON.parse(localStorage.getItem('user')).address,
                    phone: JSON.parse(localStorage.getItem('user')).phone,
                }}>
                    <Form.Item
                        label="Name"
                        name="username"
                        rules={[{ required: true, message: 'Please enter your name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: 'Please enter your address!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Phone Number"
                        name="phone"
                        rules={[{ required: true, message: 'Please enter your phone number!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <div style={{ textAlign: 'right', marginTop: 20 }}>
                        <Button onClick={handleInfoCancel} style={{ marginRight: 10 }}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </div>
                </Form>
            </Modal>

            <Modal
                title="Order Success"
                open={isSuccessModalVisible}
                onOk={handleSuccessOk}
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                <p>Your order has been successfully placed. Thank you for shopping with us!</p>
            </Modal>
        </div>
    );
};

export default Cart;
