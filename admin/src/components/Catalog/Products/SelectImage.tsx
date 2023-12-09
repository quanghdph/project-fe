import { Box, Flex } from '@chakra-ui/react';
import { Avatar, Button, Checkbox, Col, Divider, Input, Modal, Row, Space, Table, Upload, message } from 'antd';
import { UploadProps } from 'antd/es/upload/interface';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { getListAsset } from 'src/features/catalog/asset/actions';
import { createAxiosJwt } from 'src/helper/axiosInstance';
import { Asset } from 'src/types/asset';
import { useDebounce } from 'use-debounce';
import type { ColumnsType } from 'antd/es/table';

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
    setFeaturedAsset: (asset: Asset) => void,
    setIsModalAssetOpen: (open: boolean) => void,
    featuredAsset: Asset
): ColumnsType<DataType> => [
        {
            title: 'Tên',
            dataIndex: 'name',
            ellipsis: true,
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
            title: 'Đường dẫn',
            ellipsis: true,
            dataIndex: 'url',
            key: 'url',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <Checkbox checked={featuredAsset && featuredAsset.id === record.id} onChange={() => {
                            setFeaturedAsset(record)
                            setIsModalAssetOpen(false)
                        }} />
                    </Space>
                )
            },
        },
    ]

interface SelectImageProps {
    isModalAssetOpen: boolean,
    setIsModalAssetOpen: (open: boolean) => void
    setFeaturedAsset: (asset: Asset) => void,
    featuredAsset: Asset
}
const SelectImage = ({ isModalAssetOpen, setFeaturedAsset, setIsModalAssetOpen, featuredAsset }: SelectImageProps) => {
    // ** State
    const [take, setTake] = useState<number>(12)
    const [skip, setSkip] = useState<number>(0)
    const [search, setSearch] = useState<string>('')
    const [refresh, setRefresh] = useState<boolean>(false)
    const [value] = useDebounce(search, 1000);
    const [loading, setLoading] = useState<boolean>(false)

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

    // ** Function handle
    const handleOk = () => {
        setIsModalAssetOpen(false);
    };

    const handleCancel = () => {
        setIsModalAssetOpen(false);
    };

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

    return (
        <Modal title="Chọn ảnh" open={isModalAssetOpen} onOk={handleOk} onCancel={handleCancel} centered width={"90%"} footer={null}>
            <Row>
                <Col span={24}>
                    <Flex>
                        <Box mr={3} flex={1}>
                            <Input type='text' placeholder='Search by asset name' onChange={(e) => { setSearch(e.target.value); }} />
                        </Box>
                        <Upload {...props(refresh, setRefresh, setLoading)}>
                            <Button type="primary" loading={loading}>Tải ảnh lên</Button>
                        </Upload>
                    </Flex>
                </Col>
                <Divider />
                <Col span={24}>
                    <Table
                        columns={columns(setFeaturedAsset, setIsModalAssetOpen, featuredAsset)}
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
                </Col>
            </Row>
        </Modal>
    );
};

export default SelectImage;