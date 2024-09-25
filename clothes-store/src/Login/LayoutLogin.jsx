import { Col, Row } from 'antd'
import React from 'react'
import { GiJetPack } from 'react-icons/gi'
import { Outlet } from 'react-router-dom'
import './Login.css'

const LayoutLogin = () => {
    return (
        <div>
            <Row>
                <Col span={12} style={{display: "flex", justifyContent: "center", alignItems: "center" ,backgroundColor: "white", height: "100vh"}}>
                    <div className='icon-name-l'>
                        <div className='icon-l'><GiJetPack /></div>
                        <div className='name-l'>Menly Store</div>
                    </div>
                </Col>
                <Col span={12}>
                    <Outlet/>
                </Col>
            </Row>
        </div>
    )
}

export default LayoutLogin
