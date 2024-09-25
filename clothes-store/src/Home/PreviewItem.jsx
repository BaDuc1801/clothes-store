import React, { useState } from 'react';
import { Carousel } from 'antd';
import './PreviewItem.css';

const PreviewItem = (props) => {
    const {item} = props

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const handleImageClick = (index) => {
        setSelectedImageIndex(index); 
    };

    return (
        <>
            <div className='pv-img'>
                <div className='img-click'>
                    <img
                        src={item.img[selectedImageIndex]}
                    />
                </div>
                <Carousel
                    dots={false}
                    arrows
                    infinite={false}
                    slidesToShow={3}
                    slidesToScroll={1}
                >
                    {item.img.map((image, index) => (
                        <div
                            className={`div-img-carousel ${selectedImageIndex === index ? 'selected' : ''}`}
                            key={index}
                            onClick={() => handleImageClick(index)} 
                        >
                            <img src={image} />
                        </div>
                    ))}
                </Carousel>
            </div>
        </>
    );
};

export default PreviewItem;
