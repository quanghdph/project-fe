import { Breadcrumb, Button, Col, Divider, Row, Table, Space, Tag, Modal, Card, message, Tooltip } from 'antd';
import React, { Fragment, useState, useEffect } from 'react';
import { Link, NavigateFunction } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createAxiosJwt } from 'src/helper/axiosInstance';
import { deleteRole, getListRole } from 'src/features/setting/role/actions';
import {
    EditOutlined,
    DeleteOutlined,
    PlusCircleOutlined
} from '@ant-design/icons';

interface DataType {
    key: number;
    id: number;
    role_name: string;
    role_code: string;
    description: string
    permissions: string[];
}

const columns = (
    setIsModalOpen: (open: boolean) => void,
    roleDelete: { id: number, code: string } | undefined,
    setRoleDelete: ({ id, code }: { id: number, code: string }) => void,
    navigate: NavigateFunction
): ColumnsType<DataType> => [
        {
            title: 'Tên vai trò',
            dataIndex: 'role_name',
            key: 'name',
            width: '15%',
            fixed: 'left',
        },
        {
            title: 'Mã vai trò',
            dataIndex: 'role_code',
            key: 'code',
            width: '15%',
        },
        {
            title: 'Chú thích',
            dataIndex: 'description',
            key: 'description',
            width: '25%',
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
            width: 150,
            fixed: 'right',
            render: (_, record) => {
                if (record.role_code === "superadmin" || record.role_code === "customer") {
                    return null
                }
                return (
                    <Space size="middle">
                        <Button shape="circle" icon={<EditOutlined />} onClick={() => navigate(`update/${record.id}`)} />
                        <Button shape="circle" icon={<DeleteOutlined />} onClick={() => {
                            setIsModalOpen(true)
                            setRoleDelete({
                                ...roleDelete,
                                id: record.id,
                                code: record.role_code
                            })
                        }} />
                    </Space>
                )
            },
        },
    ]

const RoleList = () => {
    // ** State
    const [take, setTake] = useState<number>(12)
    const [skip, setSkip] = useState<number>(0)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [roleDelete, setRoleDelete] = useState<{ id: number, code: string }>()
    const [refresh, setRefresh] = useState<boolean>(false)

    // ** Third party
    const navigate = useNavigate()

    // ** Variables
    const role = useAppSelector((state) => state.role);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Effect
    useEffect(() => {
        getListRole({
            pagination: {
                skip,
                take
            },
            axiosClientJwt,
            dispatch,
            navigate
        })
    }, [skip, take, refresh])

    // ** Function handle
    const dataRender = (): DataType[] => {
        if (!role.list.loading && role.list.result) {
            return role.list.result.roles.map((role, index: number) => {
                return {
                    key: index,
                    id: role.id,
                    description: role.description,
                    role_code: role.role_code,
                    role_name: role.role_name,
                    permissions: role.permissions,
                }
            })
        }
        return []
    }

    const handleOk = async () => {
        await deleteRole({
            axiosClientJwt,
            dispatch,
            message,
            navigate,
            refresh,
            setIsModalOpen,
            setRefresh,
            id: roleDelete?.id!
        })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    }

    const handleOnChangePagination = (e: number) => {
        setSkip((e - 1) * take)
    }

    return (
        <Fragment>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to='/'>Trang chủ</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Vai trò</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                                <Button
                                    style={{ textTransform: "uppercase" }}
                                    type="primary"
                                    onClick={() => navigate('create')}
                                    icon={<PlusCircleOutlined />}
                                >
                                    Tạo vai trò mới
                                </Button>
                            </div>
                        </Col>
                        <Divider />
                        <Col span={24}>
                            <Card>
                                <Table
                                    bordered
                                    columns={columns(setIsModalOpen, roleDelete, setRoleDelete, navigate)}
                                    dataSource={dataRender()}
                                    loading={role.list.loading}
                                    scroll={{ x: '100vw' }}
                                    pagination={{
                                        total: role.list.result?.total,
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
            <Modal title="Xóa vai trò" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} centered confirmLoading={role.delete.loading}>
                <p>Bạn có muốn xóa vai trò này (<span style={{ fontWeight: "bold" }}>{roleDelete?.code}</span>) ?</p>
            </Modal>
        </Fragment>
    );
};

export default RoleList;