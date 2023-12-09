import { Card, Flex, useToast, Box, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { Col, Collapse, Pagination, Row, Timeline, Card as CardAntd, Tooltip, Tag, Button, Spin } from 'antd';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createAxiosJwt } from 'src/axios/axiosInstance';
import { cancelOrder, getListOrder, refundOrder } from 'src/features/order/action';
import {
    UserOutlined
} from '@ant-design/icons';
import formatMoney from 'src/shared/utils/formatMoney';
import { StatusOrder } from 'src/shared/types';

const Purchase = () => {
    // ** State
    const [take, setTake] = useState<number>(12)
    const [skip, setSkip] = useState<number>(0)
    const [refresh, setRefresh] = useState<boolean>(false)

    // ** Variables
    const axiosClientJwt = createAxiosJwt();
    const dispatch = useAppDispatch();
    const order = useAppSelector((state) => state.order);

    // ** Third party
    const toast = useToast()
    const navigate = useNavigate()

    // ** Effect
    useEffect(() => {
        getListOrder({
            axiosClientJwt,
            dispatch,
            navigate,
            pagination: {
                skip,
                take
            },
            toast
        })
    }, [refresh])

    // ** Function handle
    const handleOnChangePagination = (e: number) => {
        setSkip((e - 1) * take)
    }

    const dataToRender = () => {
        if (!order.list.loading && order.list.result) {
            return order.list.result.orders?.map((order, index) => {
                return (
                    <Card variant="outline" padding={5} mb={8} key={index}>

                        <Row gutter={[12, 12]}>
                            <Col span={24}>
                                <Row>
                                    <Col span={24}>
                                        <Row gutter={[12, 12]}>
                                            <Col span={12}>
                                                <Flex>
                                                    <img src={order.product_variant.featured_asset?.url} className='w-40 object-cover' />
                                                    <Box ml={2}>
                                                        <Flex>
                                                            <span className='font-semibold'>Order number:</span>
                                                            <span className='ml-2 font-semibold'>{order.code}</span>
                                                        </Flex>
                                                        <Link to={`/products/${order.product_variant.id}`}>{order.product_variant.name}</Link>
                                                        <div className='text-[#a0aec0] mb-2'>{order.product_variant.sku}</div>
                                                        {(() => {
                                                            switch (order.status) {
                                                                case StatusOrder.Confirm:
                                                                    return <Tag color="cyan">Confirm</Tag>
                                                                case StatusOrder.Shipped:
                                                                    return <Tag color="orange">Shipped</Tag>
                                                                case StatusOrder.Completed:
                                                                    return <Tag color="green">Completed</Tag>
                                                                case StatusOrder.Cancel:
                                                                    return <Tag color="red">Cancel</Tag>
                                                                case StatusOrder.Refund:
                                                                    return <Tag color="magenta">Refund</Tag>
                                                                default:
                                                                    return <Tag color="blue">Open</Tag>
                                                            }
                                                        })()}
                                                        {order.payment ? <Tag>Paid</Tag> : <Tag>Unpaid</Tag>}
                                                    </Box>
                                                </Flex>
                                            </Col>
                                            <Col span={5}>
                                                <p className='font-bold'>Order summary</p>
                                                <Flex justifyContent="space-between">
                                                    <p>Price</p>
                                                    <p>{formatMoney(order.product_variant.price)}</p>
                                                </Flex>
                                                <Flex justifyContent="space-between">
                                                    <p>Quantity</p>
                                                    <p>x{order.quantity}</p>
                                                </Flex>
                                                {
                                                    order.promotion ? (
                                                        <Flex justifyContent="space-between">
                                                            <p>Discount</p>
                                                            <p>x{order.promotion.discount}%</p>
                                                        </Flex>
                                                    ) : null
                                                }
                                                <Flex justifyContent="space-between">
                                                    <p className='font-bold'>Total</p>
                                                    <p className='font-bold'>{formatMoney(order.total_price)}</p>
                                                </Flex>
                                            </Col>
                                            {
                                                order.status === StatusOrder.Open || order.status === StatusOrder.Confirm ? (
                                                    <Col span={7}>
                                                        <Flex justifyContent="flex-end">
                                                            <Menu>
                                                                <MenuButton as={Button}>
                                                                    Action
                                                                </MenuButton>
                                                                <MenuList>
                                                                    <MenuItem
                                                                        onClick={() => {
                                                                            if (order.payment) {
                                                                                refundOrder({
                                                                                    axiosClientJwt,
                                                                                    dispatch,
                                                                                    id: order.id,
                                                                                    navigate,
                                                                                    refresh,
                                                                                    setRefresh,
                                                                                    toast
                                                                                })
                                                                            } else {
                                                                                cancelOrder({
                                                                                    axiosClientJwt,
                                                                                    dispatch,
                                                                                    id: order.id,
                                                                                    navigate,
                                                                                    refresh,
                                                                                    setRefresh,
                                                                                    toast
                                                                                })
                                                                            }
                                                                        }}
                                                                    >
                                                                        {order.payment ? "Refund" : "Cancel"} order
                                                                    </MenuItem>
                                                                </MenuList>
                                                            </Menu>
                                                        </Flex>
                                                    </Col>
                                                ) : null
                                            }
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Collapse >
                                    <Collapse.Panel showArrow={false} header="Detailed overview" key="1">
                                        <Row gutter={[24, 0]}>
                                            <Col span={12}>
                                                <Row gutter={[0, 12]}>
                                                    <Col span={24}>
                                                        <CardAntd title={
                                                            <Flex alignItems={"center"}>
                                                                <UserOutlined />
                                                                <span style={{ marginLeft: "5px" }}>{order.users.first_name + order.users.last_name}</span>
                                                            </Flex>
                                                        }>
                                                            <Tooltip title={`Street line 1: ${order.billing_address.street_line_1}`}>
                                                                <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                                    <Box as="span" fontWeight="semibold">Street line 1: </Box>{order.billing_address.street_line_1}
                                                                </p>
                                                            </Tooltip>
                                                            <Tooltip title={`Street line 2: ${order.billing_address.street_line_2 ? order.billing_address.street_line_2 : '-'}`}>
                                                                <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                                    <Box as="span" fontWeight="semibold">Street line 2: </Box>{order.billing_address.street_line_2 ? order.billing_address.street_line_2 : '-'}
                                                                </p>
                                                            </Tooltip>
                                                            <Tooltip title={`City: ${order.billing_address.city}`}>
                                                                <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                                    <Box as="span" fontWeight="semibold">City: </Box>{order.billing_address.city}
                                                                </p>
                                                            </Tooltip>
                                                            <Tooltip title={`Country: ${order.billing_address.country}`}>
                                                                <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                                    <Box as="span" fontWeight="semibold">Country: </Box>{order.billing_address.country}
                                                                </p>
                                                            </Tooltip>
                                                            <Tooltip title={`Postal code: ${order.billing_address.postal_code}`}>
                                                                <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                                    <Box as="span" fontWeight="semibold">Postal code: </Box>{order.billing_address.postal_code}
                                                                </p>
                                                            </Tooltip>
                                                            <Tooltip title={`Province: ${order.billing_address.province}`}>
                                                                <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                                    <Box as="span" fontWeight="semibold">Province: </Box>{order.billing_address.province}
                                                                </p>
                                                            </Tooltip>
                                                        </CardAntd>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col span={12}>
                                                <Timeline>
                                                    {
                                                        order.order_history.map((history, index) => {
                                                            return (
                                                                <Timeline.Item key={index}>{`${history.content} at ${new Date(history.created_date).toISOString().substring(0, 10)} - ${moment(history.created_date).utc().format('HH:mm:ss')}`}</Timeline.Item>

                                                            )
                                                        })
                                                    }
                                                </Timeline>
                                            </Col>
                                        </Row>
                                    </Collapse.Panel>
                                </Collapse>
                            </Col>
                        </Row>
                    </Card>
                )
            })
        }
        return null
    }

    return (
        <Fragment>
            <Row>
                <Col span={24}></Col>
                <Col span={24}>
                    <Spin spinning={order.list.loading} style={{ maxHeight: 'unset', height: '100vh' }}>
                        {dataToRender()}
                    </Spin>
                </Col>
                <Col span={24}>
                    <Flex justifyContent="flex-end">
                        {!order.list.loading && order.list.result && (
                            <Pagination
                                total={order.list.result.total}
                                defaultCurrent={skip + 1}
                                onChange={handleOnChangePagination}
                                defaultPageSize={take}
                                responsive={true}
                            />
                        )}
                    </Flex>
                </Col>
            </Row>
        </Fragment>
    );
};

export default Purchase;