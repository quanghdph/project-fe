import { Box, Flex } from '@chakra-ui/react';
import { Breadcrumb, Button, Card, Col, Divider, Input, Row, Select, Space, Table, Tag } from 'antd';
import React, { Fragment, useState, useEffect } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import {
    ShoppingCartOutlined,
    UserOutlined
} from '@ant-design/icons';
import { getListOrder } from 'src/features/sale/order/action';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createAxiosJwt } from 'src/helper/axiosInstance';
import { useDebounce } from 'use-debounce';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { currency } from 'src/helper/currencyPrice';
import { StatusOrder } from 'src/types';
import { Promotion } from 'src/types/promotion';

TimeAgo.addDefaultLocale(en)

const timeAgo = new TimeAgo('en-US')


interface DataType {
    key: number
    id: number
    status: string
    created_date: string
    modified_date: string
    total_price: number
    customer_name: string
    users_id: number
    payment_method: string
    code: string
    quantity: number
    price: number
    origin_price: number
    promotion: Promotion
    payment: boolean
}

const columns = (
    navigate: NavigateFunction
): ColumnsType<DataType> => [
        {
            title: 'Mã đơn hàng',
            ellipsis: true,
            dataIndex: 'code',
            key: 'code',
            width: '15%',
            fixed: 'left'
        },
        {
            title: 'Khách hàng',
            dataIndex: 'customer_name',
            ellipsis: true,
            width: '15%',
            key: 'customer_name',
            render: (customer_name: string, record) => {
                return (
                    <Flex alignItems={"center"}>
                        <UserOutlined />
                        <Link to={`/customers/update/${record.users_id}`} style={{ marginLeft: "5px" }}>{customer_name}</Link>
                    </Flex>
                )
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            ellipsis: true,
            key: 'status',
            width: '100px',
            render: (status: string) => {
                return (
                    <span>
                        {(() => {
                            switch (status) {
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
                        })()}
                    </span>
                )
            }
        },
        {
            title: 'Giá gốc',
            dataIndex: 'origin_price',
            ellipsis: true,
            key: 'origin_price',
            width: '150px',
            render: (origin_price: number) => {
                return (
                    <span>{currency(origin_price)}</span>
                )
            }
        },
        {
            title: 'Giá bán',
            dataIndex: 'price',
            ellipsis: true,
            key: 'price',
            width: '100px',
            render: (price: number) => {
                return (
                    <span>{currency(price)}</span>
                )
            }
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            ellipsis: true,
            key: 'quantity',
            width: '100px',
            render: (quantity: number) => {
                return (
                    <span>{quantity}</span>
                )
            }
        },
        {
            title: 'Tổng giá',
            dataIndex: 'total_price',
            ellipsis: true,
            key: 'total_price',
            width: '100px',
            render: (total_price: number) => {
                return (
                    <span>{currency(total_price)}</span>
                )
            }
        },
        {
            title: 'Lợi nhuận',
            ellipsis: true,
            key: 'profit',
            width: '100px',
            render: (_, record) => {
                return (
                    <span style={{ color: record.payment ? 'green' : 'red' }}>+{currency((record.total_price - (record.origin_price * record.quantity)))}</span>
                )
            }
        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'payment_method',
            ellipsis: true,
            key: 'payment_method',
            width: '100px',
            render: (payment_method: string) => {
                return (
                    <span>
                        <Tag>{payment_method === 'Standard' ? "Thanh toán thường" : "Paypal"}</Tag>
                    </span>
                )
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '100px',
            fixed: 'right',
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <Button icon={<ShoppingCartOutlined />} onClick={() => navigate(`detail/${record.id}`)}>Xem chi tiết</Button>
                    </Space>
                )
            },
        },
    ]

const Orders = () => {
    // ** State
    const [take, setTake] = useState<number>(10)
    const [skip, setSkip] = useState<number>(0)
    const [search, setSearch] = useState<string>('')
    const [value] = useDebounce(search, 1000);
    const [status, setStatus] = useState<string>('all')

    // ** Third party
    const navigate = useNavigate()

    // ** Variables
    const order = useAppSelector((state) => state.order);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Effect
    useEffect(() => {
        getListOrder({
            pagination: {
                skip,
                take,
                search: value,
                status
            },
            navigate,
            axiosClientJwt,
            dispatch,
        })
    }, [skip, take, value, status])

    // ** Function handle
    const handleOnChangePagination = (e: number) => {
        setSkip((e - 1) * take)
    }

    const onChangeStatus = (value: string) => {
        setStatus(value)
    };

    const dataRender = (): DataType[] => {
        if (!order.list.loading && order.list.result) {
            return order.list.result.orders.map((order, index: number) => {
                return {
                    key: index,
                    id: order.id,
                    code: order.code,
                    created_date: order.created_date,
                    status: order.status,
                    customer_name: order.users.first_name + order.users.last_name,
                    modified_date: order.modified_date,
                    payment_method: order.payment_method,
                    total_price: order.total_price,
                    users_id: order.users_id,
                    quantity: order.quantity,
                    price: order.product_variant.price,
                    origin_price: order.product_variant.origin_price,
                    promotion: order.promotion,
                    payment: order.payment
                }
            })
        }
        return []
    }

    return (
        <Fragment>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to='/'>Trang chủ</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Đơn hàng</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <Flex>
                                <Box mr={3} flex={1}>
                                    <Input type='text' placeholder='Tìm theo mã đơn hàng' />
                                </Box>
                                <Box mr={3}>
                                    <Select
                                        value={status}
                                        placeholder="Status"
                                        onChange={onChangeStatus}
                                        options={[
                                            {
                                                value: 'all',
                                                label: 'Tất cả',
                                            },
                                            {
                                                value: StatusOrder.Confirm,
                                                label: 'Xác nhận',
                                            },
                                            {
                                                value: StatusOrder.Cancel,
                                                label: 'Hủy',
                                            },
                                            {
                                                value: StatusOrder.Completed,
                                                label: 'Hoàn thành',
                                            },
                                            {
                                                value: StatusOrder.Open,
                                                label: 'Mở',
                                            },
                                            {
                                                value: StatusOrder.Refund,
                                                label: 'Hoàn trả',
                                            },
                                            {
                                                value: StatusOrder.Shipped,
                                                label: 'Đang vận chuyển',
                                            },
                                        ]}
                                    />
                                </Box>
                            </Flex>
                        </Col>
                        <Divider />
                        <Col span={24}>
                            <Card>
                                <Table
                                    bordered
                                    columns={columns(navigate)}
                                    dataSource={dataRender()}
                                    loading={order.list.loading}
                                    scroll={{ x: '120vw' }}
                                    pagination={{
                                        total: order.list.result?.total,
                                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                                        defaultCurrent: skip + 1,
                                        onChange: handleOnChangePagination,
                                        defaultPageSize: take,
                                        responsive: true
                                    }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Fragment>
    );
};

export default Orders;