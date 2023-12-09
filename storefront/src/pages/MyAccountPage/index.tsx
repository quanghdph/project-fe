import React from 'react';
import { Tabs, Row, Col } from 'antd';
import { Breadcrumb, BreadcrumbItem } from '@chakra-ui/react';
import { ChevronRight } from 'react-feather';
import Addresses from 'src/components/MyAccount/Addresses';
import { Link } from 'react-router-dom';
import Purchase from 'src/components/MyAccount/Purchase';

const MyAccountPage = () => {
    return (
        <div className='py-8 px-10 mt-16'>
            <Row>
                <Col span={24}>
                    <Breadcrumb spacing='8px' marginBottom='35px' separator={<ChevronRight size={14} />}>
                        <BreadcrumbItem>
                            <Link to='/' className='hover:text-primary hover:no-underline transition duration-150 text-sm font-medium'>Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <Link to='#' className='!text-[#999] text-sm font-medium'>My account</Link>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </Col>
            </Row>
            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Purchase History" key="1">
                    <Purchase />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Addresses" key="2">
                    <Addresses />
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};

export default MyAccountPage;