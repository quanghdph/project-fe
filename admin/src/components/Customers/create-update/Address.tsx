import {Box} from '@chakra-ui/react';
import {Button, Card, Modal, Popover, Tooltip, message} from 'antd';
import React, {Fragment, useState} from 'react';
import {UserAddress} from 'src/types';
import {
    InboxOutlined,
    EllipsisOutlined
} from '@ant-design/icons';
import {deleteAddress, setDefaultShippingAddressAction} from 'src/features/address/action';
import {useAppDispatch, useAppSelector} from 'src/app/hooks';
import {createAxiosJwt} from 'src/helper/axiosInstance';
import {useNavigate, useParams} from 'react-router-dom';

interface AddressesProps {
    address: UserAddress
    setRefresh: (refresh: boolean) => void,
    refresh: boolean,
    setUpdateAddress: (addressId: number) => void
    setMode: (mode: boolean) => void
    setAddressModal: (open: boolean) => void,
}

const Address = ({address, refresh, setRefresh, setMode, setUpdateAddress, setAddressModal}: AddressesProps) => {
    // ** State
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [addressDelete, setAddressDelete] = useState<number>();
    const [open, setOpen] = useState<boolean>(false);

    // ** Third party
    const navigate = useNavigate()
    const params = useParams()
    const {id} = params

    // ** Variables
    const store = useAppSelector((state) => state.address);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Function handle
    const showModal = (id: number) => {
        setIsModalOpen(true);
        setAddressDelete(id)
        setOpen(false)
    };

    const handleOk = () => {
        deleteAddress({
            axiosClientJwt,
            dispatch,
            id: +(addressDelete as number),
            message,
            navigate,
            refresh,
            setIsModalOpen,
            setRefresh,
        })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const setDefaultShippingAddress = (updateAddress: number) => {
        if (id) {
            setDefaultShippingAddressAction({
                axiosClientJwt,
                customer_id: +id,
                dispatch,
                id: +updateAddress,
                message,
                navigate,
                refresh,
                setRefresh
            })
        }
    }

    return (
        <Fragment>
            <Card title={
                <Tooltip title={`${address.street_line_1}, ${address.city}`}>
                    <div style={{width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                        {`${address.street_line_1}, ${address.city}`}
                    </div>
                </Tooltip>
            } extra={
                <Popover content={
                    <Fragment>
                        <Box as="p" cursor={"pointer"} onClick={() => showModal(address.id)}>Xóa địa chỉ</Box>
                        <Box as="p" cursor={"pointer"} onClick={() => {
                            setUpdateAddress(address.id)
                            setOpen(false)
                            setAddressModal(true)
                            setMode(true)
                        }}>Cập nhật địa chỉ</Box>
                        <Box
                            as="p"
                            cursor={"pointer"}
                            style={{pointerEvents: address.default_shipping_address ? 'none' : 'unset'}}
                            opacity={address.default_shipping_address ? 0.5 : 1}
                            onClick={() => {
                                setDefaultShippingAddress(address.id)
                            }}
                        >
                            Đặt làm địa chỉ giao hàng mặc định
                        </Box>
                    </Fragment>
                } trigger="click" placement="bottom" title="Hành động" open={open}
                         onOpenChange={(open: boolean) => setOpen(open)}>
                    <EllipsisOutlined/>
                </Popover>
            } style={{flex: 1}}>
                {
                    address.default_shipping_address && (
                        <p>
                            <Button disabled icon={<InboxOutlined/>}>Địa chỉ giao hàng mặc định</Button>
                        </p>
                    )
                }
                <Tooltip title={`Street line 1: ${address.street_line_1}`}>
                    <p style={{width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                        <Box as="span" fontWeight="semibold">Tuyến phố 1: </Box>{address.street_line_1}
                    </p>
                </Tooltip>
                <Tooltip title={`Street line 2: ${address.street_line_2 ? address.street_line_2 : '-'}`}>
                    <p style={{width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                        <Box as="span" fontWeight="semibold">Tuyến phố
                            2: </Box>{address.street_line_2 ? address.street_line_2 : '-'}
                    </p>
                </Tooltip>
                <Tooltip title={`City: ${address.city}`}>
                    <p style={{width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                        <Box as="span" fontWeight="semibold">Thành phố: </Box>{address.city}
                    </p>
                </Tooltip>
                <Tooltip title={`Country: ${address.country}`}>
                    <p style={{width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                        <Box as="span" fontWeight="semibold">Quốc gia: </Box>{address.country}
                    </p>
                </Tooltip>
                <Tooltip title={`Postal code: ${address.postal_code}`}>
                    <p style={{width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                        <Box as="span" fontWeight="semibold">Mã bưu điện: </Box>{address.postal_code}
                    </p>
                </Tooltip>
                <Tooltip title={`Province: ${address.province}`}>
                    <p style={{width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                        <Box as="span" fontWeight="semibold">Tình: </Box>{address.province}
                    </p>
                </Tooltip>
            </Card>
            <Modal title="Delete address" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} centered
                   confirmLoading={store.delete.loading}>
                <p>Bạn chắc chắn muốn xóa địa chỉ này ?</p>
            </Modal>
        </Fragment>
    );
};

export default Address;