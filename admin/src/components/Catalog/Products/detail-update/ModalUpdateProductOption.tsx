import { Box } from '@chakra-ui/react';
import autoAnimate from '@formkit/auto-animate';
import { Col, Form, Input, Modal, Row, Select, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { updateProductOption } from 'src/features/catalog/product/actions';
import { createAxiosJwt } from 'src/helper/axiosInstance';
import { ProductOption } from 'src/types';

export interface FormValuesProductOption {
    value: string
}

interface ModalUpdateProductOptionProps {
    isModalUpdateProductOptionOpen: boolean
    setIsModalUpdateProductOptionOpen: (isModalUpdateProductOptionOpen: boolean) => void
    option: ProductOption
    refresh: boolean,
    setRefresh: (refresh: boolean) => void
}
const ModalUpdateProductOption = ({ isModalUpdateProductOptionOpen, setIsModalUpdateProductOptionOpen, option, refresh, setRefresh }: ModalUpdateProductOptionProps) => {
    const [nameOption, setNameOption] = useState<string>()

    const valueErrorRef = useRef(null);

    const product = useAppSelector((state) => state.product);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    const navigate = useNavigate();
    const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormValuesProductOption>({
        defaultValues: {
            value: ''
        }
    });

    useEffect(() => {
        if (option) {
            setNameOption(option.name)
            setValue("value", option.value)
        }
    }, [option])

    useEffect(() => {
        valueErrorRef.current && autoAnimate(valueErrorRef.current);
    }, [parent])

    const onSubmit = (data: FormValuesProductOption) => {
        updateProductOption({
            axiosClientJwt,
            dispatch,
            id: option?.id,
            message,
            navigate,
            productOption: {
                value: data.value
            },
            refresh,
            setIsModalOpen: setIsModalUpdateProductOptionOpen,
            setRefresh
        })
    };

    const handleCancel = () => {
        setIsModalUpdateProductOptionOpen(false);
    }

    return (
        <Modal title="Cập nhật sản phẩm option" cancelText={'Hủy'} okText={'Cập nhật'} open={isModalUpdateProductOptionOpen} onOk={handleSubmit(onSubmit)} onCancel={handleCancel} centered confirmLoading={product.productOptionUpdate.loading}>
            <Form layout='vertical'>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Form.Item label="Tên Option">
                            <Select
                                value={nameOption}
                                disabled
                                options={[
                                    {
                                        value: 'Size',
                                        label: 'Kích cỡ',
                                    },
                                    {
                                        value: 'Color',
                                        label: 'Mãu',
                                    },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item label="Giá trị">
                            <Controller
                                name="value"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => {
                                    return (
                                        <div ref={valueErrorRef}>
                                            <Input {...field} placeholder="XL" />
                                            {errors?.value ? <Box as="div" mt={1} textColor="red.600">{errors.value?.type === 'required' ? "Vui lòng điền giá trị option!" : errors.value.message}</Box> : null}
                                        </div>
                                    )
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default ModalUpdateProductOption;