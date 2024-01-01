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

// const props = (refresh: boolean, setRefresh: (refresh: boolean) => void, setLoading: (loading: boolean) => void): UploadProps => {
//     const accessToken = localStorage.getItem("accessToken")
//     return {
//         name: 'files',
//         action: 'http://localhost:1234/asset/upload',
//         multiple: true,
//         showUploadList: false,
//         headers: {
//             Authorization: `Bearer ${accessToken}`
//         },
//         onChange(info) {
//             setLoading(true)
//             if (info.fileList.every((file) => file.status === "done")) {
//                 setTimeout(function () {
//                     setRefresh(!refresh)
//                     message.success(`File uploaded successfully!`);
//                     setLoading(false)
//                 }, 1000);
//             }
//         },
//     }
// };


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
                        <img src={record.url} style={{ width: 60 ,height: 80}} />
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
    setFiles:any
}
const SelectImage = ({setFiles, isModalAssetOpen,setFeaturedAsset, setIsModalAssetOpen, featuredAsset }: SelectImageProps) => {
    // ** State
    const [take, setTake] = useState<number>(12)
    const [skip, setSkip] = useState<number>(0)
    const [search, setSearch] = useState<string>('')
    const [refresh, setRefresh] = useState<boolean>(false)
    const [value] = useDebounce(search, 1000);
    const [loading, setLoading] = useState<boolean>(false)

    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);


    // ** Variables
    const navigate = useNavigate();
    const store = useAppSelector((state) => state.asset);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

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
            // Update onChange to handle selected files
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
            // Additional props to handle file selection
            beforeUpload: (file) => {
                setSelectedFiles((prev) => {
                    if (prev) {
                        const files = Array.from(prev);
                        files.push(file);
                        return new FileList(files);
                    }
                    return new FileList([file]);
                });
                return false; // Prevent default upload behavior
            },
        };
    };

    useEffect(() => {
        // getListAsset({
        //     pagination: {
        //         skip,
        //         take,
        //         search: value
        //     },
        //     axiosClientJwt,
        //     dispatch,
        //     navigate
        // });
    }, [skip, take, value, refresh])

    // ** Function handle
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(e.target.files);
        }
        setFiles(e.target.files)
    };


 
    
    const handleOnChangePagination = (e: number) => {
        setSkip((e - 1) * take);
    };
    
   
    

    const handleCancel = () => {
        setIsModalAssetOpen(false);
    };

    // const dataRender = (): DataType[] => {
    //     if (!store.list.loading && store.list.result && store.list.result?.assets?.length > 0) {
    //         return store.list.result.assets.map((asset, index) => {
    //             return {
    //                 id: asset.id,
    //                 key: index,
    //                 name: asset.name,
    //                 url: asset.url,
    //             };
    //         });
    //     }
    //     return [];
    // };
    const dataRender = (): DataType[] => {
        const selectedImages = selectedFiles
            ? Array.from(selectedFiles).map((file, index) => ({
                  id: -index, // Use negative values to distinguish from fetched assets
                  key: -index,
                  name: file.name,
                  url: URL.createObjectURL(file),
              }))
            : [];
    
        if (!store.list.loading && store.list.result && store.list.result?.assets?.length > 0) {
            return [...selectedImages, ...store.list.result.assets.map((asset, index) => ({
                id: asset.id,
                key: index,
                name: asset.name,
                url: asset.url,
            }))];
        }
    
        return selectedImages;
    };
    const handleOk = () => {
        setIsModalAssetOpen(false);
    };


    return (
        <Modal title="Chọn ảnh" open={isModalAssetOpen} onOk={handleOk} onCancel={handleCancel} centered width={"90%"} footer={null}>
            <Row>
                <Col span={24}>
                    <Flex>
                            <Box mr={3} flex={1}>
                                {/* Update file input to trigger file selection */}
                                <Input type='file' onChange={handleFileChange} multiple />
                            </Box>
                            <Box>
                                {/* Trigger file selection when clicking the button */}
                                <Button type="primary" loading={loading} onClick={() => setSelectedFiles(null)}>
                                    Tải ảnh lên
                                </Button>
                            </Box>
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