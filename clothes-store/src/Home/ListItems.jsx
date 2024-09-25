import React from 'react';
import { Flex, Rate } from 'antd';
import './ListItems.css';
import { useNavigate } from 'react-router-dom';

const ListItems = (props) => {
    const { item } = props;
    const navigate = useNavigate();
    const changePage = () => {
        navigate('/infor-item', { state: { item } });
    };

    return (
        <div className="li-items" onClick={changePage}>
            <div className="li-items-img">
                <img src={item.img[0]} alt={item.itemName} />
            </div>
            <div className="li-items-name">
                <h1>{item.itemName}</h1>
            </div>
            <div className="li-items-price">
                <p>{item.price} $</p>
            </div>
            <div className='li-evaluate-sold'>
                <div className='evaluate'>
                    <Flex gap="middle" vertical>
                        <Rate disabled allowHalf value={item.evaluate} />
                    </Flex>
                </div>
                <div className='sold'>
                    <p>Sold: {item.sold}</p>
                </div>
            </div>
        </div>
    );
};

export default ListItems;
