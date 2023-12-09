import { Box } from '@chakra-ui/react';
import autoAnimate from '@formkit/auto-animate';
import { Form, Input, Modal, Select, Spin, message } from 'antd';
import React, { Fragment, useRef, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { countries } from 'src/constants';
import { createAddress, getAddress, updateAddress as updateAddressAction } from 'src/features/address/action';
import { createAxiosJwt } from 'src/helper/axiosInstance';

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
    const store = useAppSelector((state) => state.address);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Third party
    const params = useParams()
    const { id } = params
    const navigate = useNavigate()
    const { control, handleSubmit, setValue, formState: { errors }, reset } = useForm<FormValuesCustomerAddress>({
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
        if (id && mode) {
            getAddress({
                axiosClientJwt,
                dispatch,
                id: +updateAddress,
                navigate
            })
        }
    }, [id, mode, updateAddress])

    useEffect(() => {
        if (id && mode && !store.single.loading && store.single.result) {
            setValue("city", store.single.result.city)
            setValue("postal_code", store.single.result.postal_code)
            setValue("province", store.single.result.province)
            setValue("street_line_1", store.single.result.street_line_1)
            setValue("street_line_2", store.single.result.street_line_2)
            setCountry(store.single.result.country)
        } else {
            reset()
        }
    }, [id, mode, store.single.loading, store.single.result])

    // ** Function handle
    const onSubmit = async (data: FormValuesCustomerAddress) => {
        if (id) {
            // mode true is update and false is create
            if (mode) {
                updateAddressAction({
                    address: {
                        city: data.city,
                        country,
                        customer_id: +(id),
                        postal_code: data.postal_code,
                        province: data.postal_code,
                        street_line_1: data.street_line_1,
                        street_line_2: data.street_line_2
                    },
                    axiosClientJwt,
                    dispatch,
                    id: +updateAddress,
                    message,
                    navigate,
                    refresh,
                    setIsModalOpen: setAddressModal,
                    setRefresh
                })
            } else {
                createAddress({
                    address: {
                        city: data.city,
                        country,
                        customer_id: +(id),
                        postal_code: data.postal_code,
                        province: data.postal_code,
                        street_line_1: data.street_line_1,
                        street_line_2: data.street_line_2
                    },
                    axiosClientJwt,
                    dispatch,
                    message,
                    navigate,
                    refresh,
                    setRefresh,
                    setIsModalOpen: setAddressModal
                })
            }
        }
    }

    const handleChange = (value: string) => {
        setCountry(value)
    };

    return (
        <Fragment>
            <Modal title="Tạo địa chỉ mới" open={addressModal} okText={'Tạo'} cancelText={'Hủy'} onOk={handleSubmit(onSubmit)} onCancel={() => setAddressModal(false)} centered confirmLoading={mode ? store.update.loading : store.create.loading}>
                <Spin spinning={store.single.loading}>
                    <Form layout="vertical">
                        <Form.Item label="Tuyến phố 1">
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
                        <Form.Item label="Tuyến phố 2">
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
                        <Form.Item label="Thành phố">
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
                        <Form.Item label="Tình">
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
                        <Form.Item label="Mã bưu điện">
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
                        <Form.Item label="Quốc gia">
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