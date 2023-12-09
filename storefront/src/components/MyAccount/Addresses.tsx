import React, { Fragment, useEffect, useState } from 'react';
import { Row, Col, Button } from 'antd';
import { getMe } from 'src/features/auth/action';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createAxiosJwt } from 'src/axios/axiosInstance';
import { useToast } from '@chakra-ui/react';
import AddressItem from '../Checkout/AddressItem';
import AddressModal from '../Checkout/AddressModal';

const Addresses = () => {
    // ** State
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [addressDelete, setAddressDelete] = useState<number>();
    const [open, setOpen] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false)
    const [addressModal, setAddressModal] = useState<boolean>(false)
    const [mode, setMode] = useState<boolean>(false)
    const [updateAddress, setUpdateAddress] = useState<number>()

    // ** Third party
    const toast = useToast()

    // ** Variables
    const axiosClientJwt = createAxiosJwt();
    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth)

    // ** Effect
    useEffect(() => {
        getMe({
            axiosClientJwt,
            dispatch,
            toast
        })
    }, [refresh])
    return (
        <Fragment>
            <Row gutter={[12, 12]}>
                <Col span={24}>
                    <div className='flex justify-end'>
                        <Button
                            type="primary"
                            onClick={() => {
                                setAddressModal(true)
                                setMode(false)
                            }}
                        >
                            Create new address
                        </Button>
                    </div>
                </Col>
                {!auth.me.loading && auth.me.result && (
                    auth.me.result.address.map((address, index) => {
                        return (
                            <Col span={8} style={{ display: "flex" }} key={index}>
                                <AddressItem
                                    address={address}
                                    setRefresh={setRefresh}
                                    refresh={refresh}
                                    setUpdateAddress={setUpdateAddress}
                                    setMode={setMode}
                                    setAddressModal={setAddressModal}
                                />
                            </Col>
                        )
                    })
                )}
            </Row>
            <AddressModal
                addressModal={addressModal}
                setAddressModal={setAddressModal}
                mode={mode}
                updateAddress={updateAddress as number}
                refresh={refresh}
                setRefresh={setRefresh}
            />
        </Fragment>
    );
};

export default Addresses;