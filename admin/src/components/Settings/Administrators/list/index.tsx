import { Breadcrumb, Button, Card, Col, Divider, Input, Modal, Row, Select, Space, Table, Tag, Tooltip, message } from 'antd';
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
import { deleteAdministrator, getListAdministrator } from 'src/features/setting/administrator/action';
import type { ColumnsType } from 'antd/es/table';
import { useDebounce } from 'use-debounce';

interface DataType {
    key: number
    id: number
    email: string;
    first_name: string
    last_name: string
    phone: string
    active: boolean
    permissions: string[]
}

const columns = (
    setIsModalOpen: (open: boolean) => void,
    administratorDelete: { id: number, email: string } | undefined,
    setAdministratorDelete: ({ id, email }: { id: number, email: string }) => void,
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
            width: '12%',
        },
        {
            title: 'Họ',
            dataIndex: 'last_name',
            key: 'last name',
            width: '12%',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            width: '12%',
        },
        {
            title: 'Hoạt động',
            dataIndex: 'active',
            key: 'active',
            width: '150px',
            render: (active: boolean) => {
                return (
                    <Tag color={active ? 'green' : 'gold'}>{active ? 'Hoạt động' : 'Vô hiệu hóa'}</Tag>
                )
            }
        },
        {
            title: 'Các quyền',
            dataIndex: 'permissions',
            key: 'permissions',
            width: '35%',
            render: (permissions: string[]) => {
                return (
                    <Space wrap>
                        {permissions.map((permission, index) => {
                            if (index + 1 <= 4) {
                                return <Tag key={index}>{permission}</Tag>
                            }
                        })}
                        {
                            permissions.length > 4 && (
                                <Tooltip title={permissions.map((permission, index) => {
                                    if (index >= 4) {
                                        return permission
                                    }
                                }).filter(notUndefined => notUndefined !== undefined).join(', ')}>
                                    <Tag style={{ cursor: "pointer" }}>+{permissions.length - 4}</Tag>
                                </Tooltip>)
                        }
                    </Space>
                )
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '150px',
            fixed: 'right',
            render: (_, record) => {
                if (record.email === "superadmin@gmail.com") {
                    return null
                }
                return (
                    <Space size="middle">
                        <Button shape="circle" icon={<EditOutlined />} onClick={() => navigate(`update/${record.id}`)} />
                        <Button shape="circle" icon={<DeleteOutlined />} onClick={() => {
                            setIsModalOpen(true)
                            setAdministratorDelete({
                                ...administratorDelete,
                                id: record.id,
                                email: record.email
                            })
                        }} />
                    </Space>
                )
            },
        },
    ]

const AdministratorList = () => {
    // ** State
    const [take, setTake] = useState<number>(12)
    const [skip, setSkip] = useState<number>(0)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [administratorDelete, setAdministratorDelete] = useState<{ id: number, email: string }>()
    const [refresh, setRefresh] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [value] = useDebounce(search, 1000);
    const [status, setStatus] = useState<string>('all')

    // ** Third party
    const navigate = useNavigate()

    // ** Variables
    const administrator = useAppSelector((state) => state.administrator);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Effect
    useEffect(() => {
        getListAdministrator({
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
        if (!administrator.list.loading && administrator.list.result) {
            return administrator.list.result.administrators.map((administrator, index: number) => {
                const permissions = administrator?.users_role?.map((ur) => ur.role.permissions).flat()
                return {
                    key: index,
                    id: administrator.id,
                    email: administrator.email,
                    first_name: administrator.first_name,
                    last_name: administrator.last_name,
                    phone: administrator.phone,
                    active: administrator.active,
                    permissions
                }
            })
        }
        return []
    }

    const handleOnChangePagination = (e: number) => {
        setSkip((e - 1) * take)
    }

    const handleOk = async () => {
        await deleteAdministrator({
            axiosClientJwt,
            dispatch,
            navigate,
            id: administratorDelete?.id!,
            refresh,
            setIsModalOpen,
            setRefresh,
            message
        })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

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
                        <Breadcrumb.Item>Quản trị viên</Breadcrumb.Item>
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
                                                label: 'Họa động',
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
                                    Tạo mới quản trị viên
                                </Button>
                            </Flex>
                        </Col>
                        <Divider />
                        <Col span={24}>
                            <Card>
                                <Table
                                    bordered
                                    columns={columns(setIsModalOpen, administratorDelete, setAdministratorDelete, navigate)}
                                    dataSource={dataRender()}
                                    loading={administrator.list.loading}
                                    scroll={{ x: '100vw' }}
                                    pagination={{
                                        total: administrator.list.result?.total,
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
            <Modal title="Xóa quản trị viên" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} centered confirmLoading={administrator.delete.loading}>
                <p>Bạn có muốn xóa quản trị viên này (<span style={{ fontWeight: "bold" }}>{administratorDelete?.email}</span>) ?</p>
            </Modal>
        </Fragment>
    );
};

export default AdministratorList;