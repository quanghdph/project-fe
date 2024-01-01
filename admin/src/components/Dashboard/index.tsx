import {Box, Flex} from '@chakra-ui/react';
import {Card, Col, Row, Divider, DatePicker, InputNumber} from 'antd';
import React, {Fragment, useEffect, useState} from 'react';
import {Pie, Column} from '@ant-design/plots';
import {createAxiosClient} from 'src/helper/axiosInstance';
import moment from 'moment';
import {Order, ProductVariant, User} from 'src/types';
import {currency} from 'src/helper/currencyPrice';
import SalesReportProps from './SalesReport';
import PotentialCustomers from './PotentialCustomers';
import Pagination from "antd/es/pagination";

interface Dashboard {
    totalBill: number
    totalCustomer: number
    totalEmployee0: number
    totalProduct: number
}

const Dashboard = () => {
    // ** State
    const [dashboard, setDashboard] = useState<Dashboard>()
    // const [money, setMoney] = useState<number>(1000)
    // const [startDate, setStartDate] = React.useState<string>(moment(new Date())?.toISOString() as string)
    // const [endDate, setEndDate] = React.useState<string>()

    // ** Variables
    const axiosClient = createAxiosClient();

    // ** Effect 
    useEffect(() => {
        axiosClient.get('/DashBoard').then((r) => {
            const d = {...r.data} as unknown as { data: Dashboard }
            console.log(d);
            setDashboard(d);
        })
    }, [])

    return (
        <Fragment>
            <Row>
                <Col span={24}>
                    <Row gutter={[16, 0]}>
                        <Col span={6}>
                            <Card>
                                <Box color="#8c8c8c" fontWeight={600}>Số lượng sản phẩm</Box>
                                <Box fontWeight="bold" fontSize="3xl">{dashboard?.totalProduct}</Box>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Box color="#8c8c8c" fontWeight={600}>Số lượng khách hàng</Box>
                                <Box fontWeight="bold" fontSize="3xl">{dashboard?.totalCustomer}</Box>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Box color="#8c8c8c" fontWeight={600}>Số lượng nhân viên</Box>
                                <Box fontWeight="bold" fontSize="3xl">{dashboard?.totalEmployee0}</Box>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Box color="#8c8c8c" fontWeight={600}>Số lượng đơn hàng</Box>
                                <Box fontWeight="bold" fontSize="3xl">{dashboard?.totalBill}</Box>
                            </Card>
                        </Col>
                        {/* <Col span={24} style={{marginTop: "1rem"}}>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Card title="Sản phẩm bán chạy">
                                        <Column
                                            data={dashboard ? dashboard.hotSellingProducts?.map((product) => {
                                                return {
                                                    sales: product._sum.quantity,
                                                    type: `${product.variant.name}`
                                                }
                                            }) : []}
                                            xField='type'
                                            yField='sales'
                                            label={{
                                                position: 'middle',
                                                style: {
                                                    fill: '#FFFFFF',
                                                    opacity: 0.6,
                                                },
                                            }}
                                            xAxis={{
                                                label: {
                                                    autoHide: true,
                                                    autoRotate: false,
                                                },
                                            }}
                                        />
                                    </Card>
                                </Col>
                                <Col span={24}>
                                    <Card title="Trạng thái đơn hàng">
                                        <Pie
                                            appendPadding={10}
                                            data={dashboard ? [

                                                {
                                                    type: 'Mở',
                                                    value: dashboard.totalOrdersOpen,
                                                },
                                                {
                                                    type: 'Xác nhận',
                                                    value: dashboard.totalOrderConfirm,
                                                },
                                                {
                                                    type: 'Đang vận chuyển',
                                                    value: dashboard.totalOrderShipped,
                                                },
                                                {
                                                    type: 'Hoàn thành',
                                                    value: dashboard.totalOrderCompleted,
                                                },
                                                {
                                                    type: 'Hoàn trả',
                                                    value: dashboard.totalOrderRefund,
                                                },
                                                {
                                                    type: 'Hủy',
                                                    value: dashboard.totalOrderCancel,
                                                },
                                            ] : []}
                                            angleField='value'
                                            colorField='type'
                                            radius={0.9}
                                            label={{
                                                type: 'inner',
                                                offset: '-30%',
                                                style: {
                                                    fontSize: 14,
                                                    textAlign: 'center',
                                                },
                                            }}
                                            interactions={[{type: 'element-active'}]}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={24}>
                            <Row style={{marginTop: "1rem"}} gutter={[16, 16]}>
                                <Col span={10}>
                                    <PotentialCustomers dashboard={dashboard} money={money} setMoney={setMoney}/>
                                </Col>
                                <Col span={14}>
                                    <SalesReportProps
                                        dashboard={dashboard}
                                        setEndDate={setEndDate}
                                        setStartDate={setStartDate}
                                        startDate={startDate}
                                    />
                                </Col>
                            </Row>
                        </Col> */}
                    </Row>
                </Col>
            </Row>
        </Fragment>
    );
};

export default Dashboard;