import { Breadcrumb, Button, Card, Col, Divider, Input, Modal, Row, Select, Space, Table, Tag, message } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import {
    EditOutlined,
    DeleteOutlined,
    PlusCircleOutlined
} from '@ant-design/icons';
import { Box, Flex } from '@chakra-ui/react';
import { createAxiosJwt } from 'src/helper/axiosInstance';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import type { ColumnsType } from 'antd/es/table';
import { deleteCustomer, getListCustomer } from 'src/features/customer/action';
import { useDebounce } from 'use-debounce';

interface DataType {
    key: number
    id: number
    email: string;
    first_name: string
    last_name: string
    phone: string
    active: boolean
}

const columns = (
    setIsModalOpen: (open: boolean) => void,
    customerDelete: { id: number, email: string } | undefined,
    setCustomerDelete: ({ id, email }: { id: number, email: string }) => void,
    navigate: NavigateFunction
): ColumnsType<DataType> => [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            fixed: 'left',
            width: '20%'
        },
        {
            title: 'Tên',
            dataIndex: 'first_name',
            key: 'first name',
            width: '20%'
        },
        {
            title: 'Họ',
            dataIndex: 'last_name',
            key: 'last name',
            width: '20%'
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            width: '20%'
        },
        {
            title: 'Hoạt động',
            dataIndex: 'active',
            key: 'active',
            width: '100px',
            render: (active: number) => {
                return (
                    <Tag color={active ? 'green' : 'gold'}>{active ? 'Hoạt động' : 'Vô hiệu hóa'}</Tag>
                )
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '150px',
            fixed: 'right',
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <Button shape="circle" icon={<EditOutlined />} onClick={() => navigate(`update/${record.id}`)} />
                        <Button shape="circle" icon={<DeleteOutlined />} onClick={() => {
                            setIsModalOpen(true)
                            setCustomerDelete({
                                ...customerDelete,
                                id: record.id,
                                email: record.email
                            })
                        }} />
                    </Space>
                )
            },
        },
    ]

const Customers = () => {
    // ** State
    const [take, setTake] = useState<number>(10)
    const [skip, setSkip] = useState<number>(0)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [customerDelete, setCustomerDelete] = useState<{ id: number, email: string }>()
    const [refresh, setRefresh] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [value] = useDebounce(search, 1000);
    const [status, setStatus] = useState<string>('all')

    // ** Third party
    const navigate = useNavigate()

    // ** Variables
    const customer = useAppSelector((state) => state.customer);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Effect
    useEffect(() => {
        getListCustomer({
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
    }, [skip, take, refresh, value, status])

    // ** Function handle
    const dataRender = (): DataType[] => {
        if (!customer.list.loading && customer.list.result) {
            return customer.list.result.customers.map((customer, index: number) => {
                return {
                    key: index,
                    id: customer.id,
                    email: customer.email,
                    first_name: customer.first_name,
                    last_name: customer.last_name,
                    phone: customer.phone,
                    active: customer.active
                }
            })
        }
        return []
    }

    const handleOk = async () => {
        await deleteCustomer({
            axiosClientJwt,
            dispatch,
            navigate,
            id: customerDelete?.id!,
            refresh,
            setIsModalOpen,
            setRefresh,
            message
        })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleOnChangePagination = (e: number) => {
        setSkip((e - 1) * take)
    }

    const onChangeStatus = (value: string) => {
        setStatus(value)
    };


    return (
        <Fragment>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to='/'>Trang chủ</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Khách hàng</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <Flex justifyContent={"flex-end"} alignItems={"center"}>
                                <Box mr={3} flex={1}>
                                    <Input type='text' placeholder='Tìm kiếm...' onChange={(e) => { setSearch(e.target.value); }} />
                                </Box>
                                <Box mr={3} flex={1}>
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
                                                value: 'active',
                                                label: 'Hoạt động',
                                            },
                                            {
                                                value: 'disabled',
                                                label: 'Vô hiệu hóa',
                                            },
                                        ]}
                                    />
                                </Box>
                                <Button
                                    style={{ textTransform: "uppercase" }}
                                    type="primary"
                                    onClick={() => navigate('create')}
                                    icon={<PlusCircleOutlined />}
                                >
                                    Tạo khách hàng mới
                                </Button>
                            </Flex>
                        </Col>
                        <Divider />
                        <Col span={24}>
                            <Card>
                                <Table
                                    bordered
                                    columns={columns(setIsModalOpen, customerDelete, setCustomerDelete, navigate)}
                                    dataSource={dataRender()}
                                    loading={customer.list.loading}
                                    scroll={{x: '100vw'}}
                                    pagination={{
                                        total: customer.list.result?.total,
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
            <Modal title="Xóa khách hàng" open={isModalOpen} onOk={handleOk} okText={'Xóa'} cancelText={'Hủy'} onCancel={handleCancel} centered confirmLoading={customer.delete.loading}>
                <p>Bán có muốn xóa khách hàng này (<span style={{ fontWeight: "bold" }}>{customerDelete?.email}</span>) ?</p>
            </Modal>
        </Fragment>

    );
};

export default Customers;