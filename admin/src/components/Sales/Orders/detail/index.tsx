import { Box, Flex } from '@chakra-ui/react';
import { Breadcrumb, Button, Card, Col, Divider, Popover, Row, Spin, Tag, message } from 'antd';
import React, { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { cancelOrder, completedOrder, confirmOrder, deleteOrder, getOrder, refundOrder, shippedOrder } from 'src/features/sale/order/action';
import { createAxiosJwt } from 'src/helper/axiosInstance';
import { StatusOrder } from 'src/types'
import OrderInfo from './OrderInfo';
import UserOrderAddress from './UserOrderAddress';
import OrderHistory from './OrderHistory';

const OrderDetail = () => {
    // ** State
    const [refresh, setRefresh] = useState<boolean>(false)

    // ** Third party
    const navigate = useNavigate()
    const params = useParams()
    const { id } = params

    // ** Variables
    const order = useAppSelector((state) => state.order);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Effect
    useEffect(() => {
        if (id) {
            getOrder({
                axiosClientJwt,
                dispatch,
                id: +id,
                navigate
            })
        }
    }, [id, refresh])

    return (
        <Fragment>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to='/'>Trang chủ</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to='/sales/orders'>Đơn hàng</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{!order.single.loading && order.single.result ? order.single.result.code : null}</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <Flex justifyContent={"space-between"} alignItems={"center"}>
                                <Flex>
                                    <Box>
                                        {
                                            !order.single.loading && order.single.result ?
                                                (() => {
                                                    switch (order.single.result.status) {
                                                        case StatusOrder.Confirm:
                                                            return <Tag color="cyan">Xác nhận</Tag>
                                                        case StatusOrder.Shipped:
                                                            return <Tag color="orange">Đang vận chuyển</Tag>
                                                        case StatusOrder.Completed:
                                                            return <Tag color="green">Hoàn thành</Tag>
                                                        case StatusOrder.Cancel:
                                                            return <Tag color="red">Hủy</Tag>
                                                        case StatusOrder.Refund:
                                                            return <Tag color="magenta">Hoàn trả</Tag>
                                                        default:
                                                            return <Tag color="blue">Mở</Tag>
                                                    }
                                                })()
                                                : null
                                        }
                                    </Box>
                                    <Box>
                                        {!order.single.loading && order.single.result ? order.single.result.payment ? <Tag>Đã thanh toán</Tag> : <Tag>Chưa thanh toán</Tag> : null}
                                    </Box>
                                </Flex>
                                <Popover placement="leftTop" content={
                                    <Fragment>
                                        <Box
                                            _hover={{ background: '#dbdbdb' }}
                                            cursor={"pointer"}
                                            padding={"2px 5px"}
                                            opacity={
                                                !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Open && !order.single.result.payment ||
                                                    !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Confirm && !order.single.result.payment
                                                    ? 1 : 0.5}
                                            pointerEvents={
                                                !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Open && !order.single.result.payment ||
                                                    !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Confirm && !order.single.result.payment
                                                    ? 'unset' : 'none'
                                            }
                                            borderRadius={"4px"}
                                            onClick={() => {
                                                cancelOrder({
                                                    axiosClientJwt,
                                                    dispatch,
                                                    id: id ? +id : 0,
                                                    message,
                                                    navigate,
                                                    refresh,
                                                    setRefresh
                                                })
                                            }}
                                        >
                                            Hủy đơn hàng
                                        </Box>
                                        <Box
                                            _hover={{ background: '#dbdbdb' }}
                                            cursor={"pointer"}
                                            padding={"2px 5px"}
                                            opacity={
                                                !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Open && order.single.result.payment ||
                                                    !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Confirm && order.single.result.payment
                                                    ? 1 : 0.5}
                                            pointerEvents={
                                                !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Open && order.single.result.payment ||
                                                    !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Confirm && order.single.result.payment
                                                    ? 'unset' : 'none'
                                            }
                                            borderRadius={"4px"}
                                            onClick={() => {
                                                refundOrder({
                                                    axiosClientJwt,
                                                    dispatch,
                                                    id: id ? +id : 0,
                                                    message,
                                                    navigate,
                                                    refresh,
                                                    setRefresh
                                                })
                                            }}
                                        >
                                            Hoàn trả đơn hàng
                                        </Box>
                                        <Box
                                            _hover={{ background: '#dbdbdb' }}
                                            cursor={"pointer"}
                                            padding={"2px 5px"}
                                            borderRadius={"4px"}
                                            opacity={
                                                !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Cancel ? 1 : 0.5}
                                            pointerEvents={
                                                !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Cancel && !order.single.result.payment ? 'unset' : 'none'
                                            }
                                            onClick={() => deleteOrder({
                                                axiosClientJwt,
                                                dispatch,
                                                id: id ? +id : 0,
                                                message,
                                                navigate,
                                                refresh,
                                                setRefresh
                                            })}
                                        >
                                            Xóa đơn hàng
                                        </Box>
                                        <Box
                                            _hover={{ background: '#dbdbdb' }}
                                            cursor={"pointer"}
                                            padding={"2px 5px"}
                                            opacity={
                                                !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Open ||
                                                    !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Shipped ||
                                                    !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Confirm
                                                    ? 1 : 0.5}
                                            pointerEvents={
                                                !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Open ||
                                                    !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Shipped ||
                                                    !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Confirm
                                                    ? 'unset' : 'none'
                                            }
                                            borderRadius={"4px"}
                                            onClick={() => {
                                                if (order.single.result?.status === StatusOrder.Open) {
                                                    confirmOrder({
                                                        axiosClientJwt,
                                                        dispatch,
                                                        id: id ? +id : 0,
                                                        message,
                                                        navigate,
                                                        refresh,
                                                        setRefresh
                                                    })
                                                }
                                                if (order.single.result?.status === StatusOrder.Confirm) {
                                                    shippedOrder({
                                                        axiosClientJwt,
                                                        dispatch,
                                                        id: id ? +id : 0,
                                                        message,
                                                        navigate,
                                                        refresh,
                                                        setRefresh
                                                    })
                                                }
                                                if (order.single.result?.status === StatusOrder.Shipped) {
                                                    completedOrder({
                                                        axiosClientJwt,
                                                        dispatch,
                                                        id: id ? +id : 0,
                                                        message,
                                                        navigate,
                                                        refresh,
                                                        setRefresh
                                                    })
                                                }
                                            }}
                                        >
                                            Tiếp tục trạng thái tiếp theo...
                                        </Box>
                                    </Fragment>
                                } title="Xử lý đơn hàng">
                                    <Button type="primary">{!order.single.loading && order.single.result ? order.single.result.status === StatusOrder.Completed ? null : 'Hành động' : null}</Button>
                                </Popover>
                            </Flex>
                        </Col>
                        <Divider />
                        <Col span={24}>
                            <Spin spinning={order.single.loading} style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', maxHeight: 'unset' }}>
                                <Card>
                                    <Row>
                                        <OrderInfo />
                                        <Divider />
                                        <Col span={24}>
                                            <Row gutter={[12, 12]}>
                                                <UserOrderAddress />
                                                <OrderHistory />
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card>
                            </Spin>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Fragment>
    );
};

export default OrderDetail;