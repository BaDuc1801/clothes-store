import React, { useState } from 'react';
import axios from 'axios';
import { Input, InputNumber, Button, message, Upload, Image, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const Add = () => {
    const [itemName, setItemName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [remaining, setRemaining] = useState(0);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const nav = useNavigate()
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + selectedImages.length > 6) {
            message.warning('You can upload a maximum of 6 images.');
            return;
        }

        const newImages = files.map(file => {
            setSelectedImages(prev => [...prev, file]);
            return URL.createObjectURL(file);
        });

        setImagePreviews(prev => [...prev, ...newImages]);
    };

    const handleSubmit = async () => {
        const itemData = {
            itemName,
            price,
            description,
            type,
            remaining,
        };

        try {
            const response = await axios.post('http://localhost:8080/items', itemData);
            const itemId = response.data._id;
            const formData = new FormData();
            selectedImages.forEach((file) => {
                formData.append('img', file);
            });

            await axios.put(`http://localhost:8080/items/update-item-img/${itemId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            message.success('Item added successfully with images!');
            setItemName('');
            setPrice('');
            setDescription('');
            setType('');
            setRemaining(0);
            setSelectedImages([]);
            setImagePreviews([]);
            nav('/')
        } catch (error) {
            console.error('Error adding item:', error);
            message.error('Failed to add item.');
        }
    };

    return (
        <div className='addd'>
            <h2>Add New Item</h2>
            <p style={{marginTop:20, fontWeight:600}}>Item Name</p>
            <Input
                placeholder="Item Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
            />
            <p style={{marginTop:20, fontWeight:600}}>Price</p>
            <InputNumber
                placeholder="Price"
                value={price}
                onChange={(value) => setPrice(value)}
                style={{ width: '100%', marginTop: '10px' }}
            />
            <p style={{marginTop:20, fontWeight:600}}>Description</p>
            <Input.TextArea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                style={{ marginTop: '10px' }}
            />
            <p style={{marginTop:20, fontWeight:600}}>Type</p>
            <Select
                placeholder="Select Type"
                value={type}
                onChange={(value) => setType(value)}
                style={{ width: '100%', marginTop: '10px' }}
            >
                <Option value="shirt">Shirt</Option>
                <Option value="accessories">Accessories</Option>
                <Option value="bag">Bag</Option>
                <Option value="shoe">Shoe</Option>
                <Option value="pants">Pants</Option>
            </Select>
            <p style={{marginTop:20, fontWeight:600}}>Remaing</p>
            <InputNumber
                placeholder="Remaining Stock"
                value={remaining}
                onChange={(value) => setRemaining(value)}
                style={{ width: '100%', marginTop: '10px' }}
            />
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                style={{ marginTop: '10px' }}
            />
            <div style={{ marginTop: '10px' }}>
                {imagePreviews.map((preview, index) => (
                    <Image key={index} width={100} src={preview} style={{ marginRight: '10px' }} />
                ))}
            </div>
            <Button
                type="primary"
                onClick={handleSubmit}
                style={{ marginTop: '20px' }}
            >
                Submit
            </Button>
        </div>
    );
};

export default Add;
