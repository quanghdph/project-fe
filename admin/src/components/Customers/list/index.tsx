import { Breadcrumb, Button, Card, Col, Divider, Input, Modal, PaginationProps, Row, Select, Space, Table, Tag, message } from 'antd';
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
import { deleteCustomer, getListCustomer, getListSearchCustomer, getListSearchPhoneNumberCustomer } from 'src/features/customer/action';
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
        title: '#',
        dataIndex: 'id',
        key: 'id',
        fixed: 'left',
        width: '5%'
    },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            // fixed: 'left',
            width: '12%'
        },
        {
            title: 'Họ',
            dataIndex: 'firstName',
            key: 'first name',
            width: '8%'
        },
        {
            title: 'Tên',
            dataIndex: 'lastName',
            key: 'lastName',
            width: '8%'
        },
        {
            title: 'Mã khách hàng',
            dataIndex: 'customerCode',
            key: 'customerCode',
            width: '8%'
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            width: '8%'
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            width: '8%'
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: '10%'
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '8%',
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
    // const [take, setTake] = useState<number>(10)
    // const [skip, setSkip] = useState<number>(0)
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [filter, setFilter] = useState<string>('')
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
        // getListSearchCustomer
        // getListCustomer({
        //   params: {
        //     page: page,
        //     limit: limit,
        //     filter: filter
        //   },
        //   navigate,
        //   axiosClientJwt,
        //   dispatch,
        // });
        useEffect(() => {
            const fetchData = async () => {
              const fetchFunction = value ? getListSearchPhoneNumberCustomer : getListCustomer;
        
              try {
                const params = value ? { value: value } : {page: page, limit: limit, filter: filter};
                await fetchFunction({
                  params,
                  navigate,
                  axiosClientJwt,
                  dispatch,
                });
              } catch (error) {
                console.error("Error fetching data:", error);
              }
            };
        
            fetchData();
          }, [search, page, limit, value]);

    // ** Function handle
    const dataRender = (): DataType[] => {
        if (!customer.list.loading && customer.list.result) {
         if(customer.list.result.listCustomer) {
            return customer.list.result.listCustomer.map((customer, index: number) => {
                return {
                    key: index,
                    id: customer.id,
                    email: customer.email,
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    phoneNumber: customer.phoneNumber,
                    gender: customer.gender == 0 ? "Nữ" : "Nam",
                    dateOfBirth: customer.dateOfBirth,
                    customerCode: customer.customerCode
                    // active: customer.active
                }
            })
         } else {
            return customer.list.result.map((customer, index: number) => {
                return {
                    key: index,
                    id: customer.id,
                    email: customer.email,
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    phoneNumber: customer.phoneNumber,
                    gender: customer.gender == 0 ? "Nữ" : "Nam",
                    dateOfBirth: customer.dateOfBirth,
                    // active: customer.active
                }
            })
         }
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
       setPage(e)
    }

    const onChangeStatus = (value: string) => {
        setStatus(value)
    };

    const handleOnShowSizeChange: PaginationProps["onShowSizeChange"] = (
        current,
        pageSize,
      ) => {
        setPage(current);
        setLimit(pageSize);
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
                                    <Input type='text' placeholder='Tìm kiếm theo số điện thoại' onChange={(e) => { setSearch(e.target.value); }} />
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
                                        defaultCurrent: page,
                                        onChange: handleOnChangePagination,
                                        onShowSizeChange: handleOnShowSizeChange,
                                        defaultPageSize: limit,
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