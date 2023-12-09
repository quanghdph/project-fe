import { Breadcrumb, Card, Col, Row, Input, Button, Modal, Upload, UploadProps, message, Divider, Space, Table, Avatar } from 'antd';
import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { deleteAsset, getListAsset } from 'src/features/catalog/asset/actions';
import { createAxiosJwt } from "src/helper/axiosInstance";
import { Box, Flex, Image } from '@chakra-ui/react';
import type { ColumnsType } from 'antd/es/table';
import {
    DeleteOutlined
} from '@ant-design/icons';
import { useDebounce } from 'use-debounce';

const props = (refresh: boolean, setRefresh: (refresh: boolean) => void, setLoading: (loading: boolean) => void): UploadProps => {
    const accessToken = localStorage.getItem("accessToken")
    return {
        name: 'files',
        action: 'http://localhost:1234/asset/upload',
        multiple: true,
        showUploadList: false,
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        onChange(info) {
            setLoading(true)
            if (info.fileList.every((file) => file.status === "done")) {
                setTimeout(function () {
                    setRefresh(!refresh)
                    message.success(`File uploaded successfully!`);
                    setLoading(false)
                }, 1000);
            }
        },
    }
};


interface DataType {
    key: number
    id: number
    name: string;
    url: string
}

const columns = (
    setIsModalOpen: (open: boolean) => void,
    setAssetDelete: (id: number) => void,
): ColumnsType<DataType> => [
        {
            title: 'Tên',
            dataIndex: 'name',
            ellipsis: true,
            key: 'name',
            width: '30%',
            render: (name, record) => {
                return (
                    <Flex alignItems={"center"}>
                        <Image
                            borderRadius='full'
                            boxSize='80px'
                            src={record.url}
                            objectFit='contain'
                        />
                        <Box ml={2} fontWeight='semibold'>{name}</Box>
                    </Flex>
                )
            }
        },
        {
            title: 'Đường dẫn',
            ellipsis: true,
            dataIndex: 'url',
            key: 'url',
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <Button shape="circle" icon={<DeleteOutlined />} onClick={() => {
                            setIsModalOpen(true)
                            setAssetDelete(record.id)
                        }} />
                    </Space>
                )
            },
        },
    ]

const Asset = () => {
    // ** State
    const [take, setTake] = useState<number>(12)
    const [skip, setSkip] = useState<number>(0)
    const [search, setSearch] = useState<string>('')
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [assetDelete, setAssetDelete] = useState<number>()
    const [refresh, setRefresh] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [value] = useDebounce(search, 1000);

    // ** Variables
    const navigate = useNavigate();
    const store = useAppSelector((state) => state.asset);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    useEffect(() => {
        getListAsset({
            pagination: {
                skip,
                take,
                search: value
            },
            axiosClientJwt,
            dispatch,
            navigate
        });
    }, [skip, take, value, refresh])

    const dataRender = (): DataType[] => {
        if (!store.list.loading && store.list.result && store.list.result?.assets?.length > 0) {
            return store.list.result.assets.map((asset, index) => {
                return {
                    id: asset.id,
                    key: index,
                    name: asset.name,
                    url: asset.url
                }
            })
        }
        return []
    }

    const handleOnChangePagination = (e: number) => {
        setSkip((e - 1) * take)
    }

    const handleOkDelete = () => {
        deleteAsset({
            axiosClientJwt,
            dispatch,
            id: assetDelete as number,
            message,
            navigate,
            refresh,
            setIsModalOpen,
            setRefresh
        })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <Fragment>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to='/'>Trang chủ</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Ảnh</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <Flex>
                                <Box mr={3} flex={1}>
                                    <Input type='text' placeholder='Tìm kiếm theo tên' onChange={(e) => { setSearch(e.target.value) }} />
                                </Box>
                                <Upload {...props(refresh, setRefresh, setLoading)}>
                                    <Button type="primary" loading={loading}>Tải ảnh lên</Button>
                                </Upload>
                            </Flex>
                        </Col>
                        <Divider />
                        <Col span={24}>
                            <Card>
                                <Table
                                    bordered
                                    columns={columns(setIsModalOpen, setAssetDelete)}
                                    dataSource={dataRender()}
                                    loading={store.list.loading}
                                    pagination={{
                                        total: store.list.result?.total,
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
            <Modal title="Xóa ảnh" okText={'Xóa'} cancelText={'Hủy'} open={isModalOpen} onOk={handleOkDelete} onCancel={handleCancel} centered confirmLoading={store.delete.loading}>
                <p>Bạn có muốn xóa ảnh này?</p>
            </Modal>
        </Fragment>
    );
};

export default Asset;