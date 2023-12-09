import { Box, useToast } from '@chakra-ui/react';
import autoAnimate from '@formkit/auto-animate';
import { Form, Input, Modal, Select, Spin } from 'antd';
import React, { Fragment, useRef, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createAxiosJwt } from 'src/axios/axiosInstance';
import { createAddress, getAddress, updateAddress as updateAddressAction } from 'src/features/address/action';
import { countries } from 'src/shared/constants';

interface FormValuesCustomerAddress {
    street_line_1: string
    street_line_2: string
    city: string
    province: string
    postal_code: string
}

interface AddressModalProps {
    addressModal: boolean
    setAddressModal: (open: boolean) => void
    mode: boolean
    updateAddress: number
    refresh: boolean,
    setRefresh: (refresh: boolean) => void
}

const AddressModal = ({ addressModal, setAddressModal, mode, updateAddress, setRefresh, refresh }: AddressModalProps) => {
    // ** State
    const [country, setCountry] = useState<string>("VN")

    // ** Variables
    const address = useAppSelector((state) => state.address);
    const auth = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Third party
    const toast = useToast()
    const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormValuesCustomerAddress>({
        defaultValues: {
            street_line_1: '',
            street_line_2: '',
            city: '',
            province: '',
            postal_code: '',
        }
    })

    // ** Ref
    const streetLine1ErrorRef = useRef(null);
    const cityErrorRef = useRef(null)
    const provinceErrorRef = useRef(null)
    const postalCodeErrorRef = useRef(null)

    // ** Effect
    useEffect(() => {
        streetLine1ErrorRef.current && autoAnimate(streetLine1ErrorRef.current);
        cityErrorRef.current && autoAnimate(cityErrorRef.current);
        provinceErrorRef.current && autoAnimate(provinceErrorRef.current);
        postalCodeErrorRef.current && autoAnimate(postalCodeErrorRef.current);
    }, [parent])

    useEffect(() => {
        if (mode) {
            getAddress({
                axiosClientJwt,
                dispatch,
                id: +updateAddress,
                toast
            })
        } else {
            setValue("city", '')
            setValue("postal_code", '')
            setValue("province", '')
            setValue("street_line_1", '')
            setValue("street_line_2", '')
            setCountry('VN')
        }
    }, [mode, updateAddress])

    useEffect(() => {
        if (mode && !address.single.loading && address.single.result) {
            setValue("city", address.single.result.city)
            setValue("postal_code", address.single.result.postal_code)
            setValue("province", address.single.result.province)
            setValue("street_line_1", address.single.result.street_line_1)
            setValue("street_line_2", address.single.result.street_line_2)
            setCountry(address.single.result.country)
        }
    }, [mode, address.single.loading, address.single.result])

    // ** Function handle
    const onSubmit = async (data: FormValuesCustomerAddress) => {
        // mode true is update and false is create
        if (mode) {
            updateAddressAction({
                address: {
                    city: data.city,
                    country,
                    customer_id: !auth.login.loading && auth.login.result ? auth.login.result.id : 0,
                    postal_code: data.postal_code,
                    province: data.postal_code,
                    street_line_1: data.street_line_1,
                    street_line_2: data.street_line_2
                },
                axiosClientJwt,
                dispatch,
                id: +updateAddress,
                toast,
                refresh,
                setIsModalOpen: setAddressModal,
                setRefresh
            })
        } else {
            createAddress({
                address: {
                    city: data.city,
                    country,
                    customer_id: !auth.login.loading && auth.login.result ? auth.login.result.id : 0,
                    postal_code: data.postal_code,
                    province: data.postal_code,
                    street_line_1: data.street_line_1,
                    street_line_2: data.street_line_2
                },
                axiosClientJwt,
                dispatch,
                toast,
                refresh,
                setRefresh,
                setIsModalOpen: setAddressModal
            })
        }
    }

    const handleChange = (value: string) => {
        setCountry(value)
    };

    return (
        <Fragment>
            <Modal title={mode ? "Update" : "Create address"} open={addressModal} onOk={handleSubmit(onSubmit)} onCancel={() => setAddressModal(false)} centered confirmLoading={mode ? address.update.loading : address.create.loading}>
                <Spin spinning={address.single.loading}>
                    <Form layout="vertical">
                        <Form.Item label="Street line 1">
                            <Controller
                                name="street_line_1"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => {
                                    return (
                                        <div ref={streetLine1ErrorRef}>
                                            <Input {...field} />
                                            {errors?.street_line_1 ? <Box as="div" mt={1} textColor="red.600">{errors.street_line_1?.type === 'required' ? "Please input your street line 1!" : errors.street_line_1.message}</Box> : null}
                                        </div>
                                    )
                                }}
                            />
                        </Form.Item>
                        <Form.Item label="Street line 2">
                            <Controller
                                name="street_line_2"
                                control={control}
                                render={({ field }) => {
                                    return (
                                        <div>
                                            <Input {...field} />
                                        </div>
                                    )
                                }}
                            />
                        </Form.Item>
                        <Form.Item label="City">
                            <Controller
                                name="city"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => {
                                    return (
                                        <div ref={cityErrorRef}>
                                            <Input {...field} />
                                            {errors?.city ? <Box as="div" mt={1} textColor="red.600">{errors.city?.type === 'required' ? "Please input your city!" : errors.city.message}</Box> : null}
                                        </div>
                                    )
                                }}
                            />
                        </Form.Item>
                        <Form.Item label="Province">
                            <Controller
                                name="province"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => {
                                    return (
                                        <div ref={provinceErrorRef}>
                                            <Input {...field} />
                                            {errors?.province ? <Box as="div" mt={1} textColor="red.600">{errors.province?.type === 'required' ? "Please input your province!" : errors.province.message}</Box> : null}
                                        </div>
                                    )
                                }}
                            />
                        </Form.Item>
                        <Form.Item label="Postal code">
                            <Controller
                                name="postal_code"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => {
                                    return (
                                        <div ref={postalCodeErrorRef}>
                                            <Input {...field} />
                                            {errors?.postal_code ? <Box as="div" mt={1} textColor="red.600">{errors.postal_code?.type === 'required' ? "Please input your postal code!" : errors.postal_code.message}</Box> : null}
                                        </div>
                                    )
                                }}
                            />
                        </Form.Item>
                        <Form.Item label="Country">
                            <Select
                                value={country}
                                onChange={handleChange}
                                options={countries.map((country) => {
                                    return {
                                        value: country.code,
                                        label: country.name,
                                    }
                                })}
                            />
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        </Fragment>
    );
};

export default AddressModal;