import React, { Fragment, useState, useEffect } from "react";
import { Avatar, Breadcrumb, Button, Card, Col, Divider, Input, Modal, Row, Select, Space, Table, Tag, message } from "antd";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { Flex } from "@chakra-ui/react";
import {
    PlusCircleOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { createAxiosJwt } from "src/helper/axiosInstance";
import { deleteProduct, getListProduct } from "src/features/catalog/product/actions";
import { Box } from '@chakra-ui/react';
import { useDebounce } from "use-debounce";

interface DataType {
    key: number
    id: number
    name: string;
    url: string
    active: boolean
}

const columns = (
    setIsModalOpen: (open: boolean) => void,
    productDelete: { id: number, name: string } | undefined,
    setProductDelete: ({ id, name }: { id: number, name: string }) => void,
    navigate: NavigateFunction
): ColumnsType<DataType> => [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => {
                return (
                    <Flex alignItems={"center"}>
                        <Avatar src={<img src={record.url} style={{ width: 40 }} />} />
                        <Box ml={2}>{name}</Box>
                    </Flex>
                )
            }
        },
        {
            title: 'Hoạt động',
            dataIndex: 'active',
            key: 'active',
            width: '180px',
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
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <Button shape="circle" icon={<EditOutlined />} onClick={() => navigate(`detail-update/${record.id}`)} />
                        <Button shape="circle" icon={<DeleteOutlined />} onClick={() => {
                            setIsModalOpen(true)
                            setProductDelete({
                                ...productDelete,
                                id: record.id,
                                name: record.name
                            })
                        }} />
                    </Space>
                )
            },
        },
    ]
const Products: React.FC = () => {
    // ** State
    const [take, setTake] = useState<number>(10)
    const [skip, setSkip] = useState<number>(0)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [productDelete, setProductDelete] = useState<{ id: number, name: string }>()
    const [refresh, setRefresh] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [value] = useDebounce(search, 1000);
    const [status, setStatus] = useState<string>('all')

    // ** Third party
    const navigate = useNavigate()

    // ** Variables
    const product = useAppSelector((state) => state.product);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Effect
    useEffect(() => {
        getListProduct({
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
        if (!product.list.loading && product.list.result) {
            return product.list.result.products.map((product, index: number) => {
                return {
                    key: index,
                    id: product.id,
                    name: product.name,
                    url: product?.featured_asset?.url,
                    active: product.active
                }
            })
        }
        return []
    }

    const handleOk = async () => {
        await deleteProduct({
            axiosClientJwt,
            dispatch,
            navigate,
            id: productDelete?.id!,
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
                        <Breadcrumb.Item>Sản phẩm</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <Flex justifyContent={"flex-end"} alignItems={"center"}>
                                <Box mr={3} flex={2}>
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
                                    Tạo sản phẩm mới
                                </Button>
                            </Flex>
                        </Col>
                        <Divider />
                        <Col span={24}>
                            <Card>
                                <Table
                                    bordered
                                    columns={columns(setIsModalOpen, productDelete, setProductDelete, navigate)}
                                    dataSource={dataRender()}
                                    loading={product.list.loading}
                                    pagination={{
                                        total: product.list.result?.total,
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
            <Modal title="Xóa sản phẩm" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} centered confirmLoading={product.delete.loading}>
                <p>Bản có muốn xóa sản phẩm này (<span style={{ fontWeight: "bold" }}>{productDelete?.name}</span>) ?</p>
            </Modal>
        </Fragment>
    );
};

export default Products;
