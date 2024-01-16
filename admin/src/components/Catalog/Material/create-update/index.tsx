import { Box, Flex } from '@chakra-ui/react';
import autoAnimate from '@formkit/auto-animate';
import { Breadcrumb, Card, Col, Divider, Row, Switch, Form, Button, Input, message } from 'antd';
import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createMaterial, getMaterial, updateMaterial } from 'src/features/catalog/material/action';
import { createAxiosJwt } from 'src/helper/axiosInstance';
// import ProductOfCategory from './ProductOfCategory';
import { Product } from 'src/types';

export type FormValuesMaterial = {
    material_name: string
    material_code: string
}

const MaterialCreateUpdate = () => {
    // ** State
    const [active, setActive] = useState<boolean>(true)
    const [parentId, setParentId] = useState<number | null>(null)

    // ** Third party
    const navigate = useNavigate()
    const params = useParams()
    const { id } = params
    const { control, handleSubmit, setValue, setError, formState: { errors } } = useForm<FormValuesMaterial>({
        defaultValues: {
            material_name: '',
            material_code: '',
        }
    });

    // ** Ref
    const materialNameErrorRef = useRef(null);
    const materialCodeErrorRef = useRef(null);

    // ** Variables
    const material = useAppSelector((state) => state.material);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Effect
    useEffect(() => {
        materialNameErrorRef.current && autoAnimate(materialNameErrorRef.current);
        materialCodeErrorRef.current && autoAnimate(materialCodeErrorRef.current);
    }, [parent])

    useEffect(() => {
        if (id) {
            getMaterial({
                axiosClientJwt,
                dispatch,
                id: +id,
                navigate
            })
        }
    }, [id])

    useEffect(() => {
        if (id && !material.single.loading && material.single.result) {
            setValue("material_code", material.single.result.materialCode)
            setValue("material_name", material.single.result.materialName)
        }
    }, [id, material.single.loading, material.single.result])

    // ** Function handle
    const onSubmit = async (data: FormValuesMaterial) => {
        if (id) {
            updateMaterial({
                axiosClientJwt,
                material: {
                    materialName: data.material_name,
                },
                dispatch,
                id: +id,
                message,
                navigate,
                setError
            })
        } else {
            createMaterial({
                axiosClientJwt,
                material: {
                    materialName: data.material_name,
                },
                dispatch,
                message,
                navigate,
                setError
            })
        }
    };

            // validate 
            const validateNoWhiteSpace = (value) => {
                const regexLeadingWhitespace = /^\s/;
                const regexTrailingWhitespace = /\s$/;
                const maxLength = 50;
                if (regexLeadingWhitespace.test(value)) {
                  return "Không được chứa khoảng trắng ở đầu!";
                } else if (regexTrailingWhitespace.test(value)) {
                  return "Không được chứa khoảng trắng ở cuối!";
                }else if(value.length > maxLength) {
                   return `Độ dài không được vượt quá ${maxLength} kí tự`;
                }
                return true;
              };

    return (
        <Fragment>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to='/'>Trang chủ</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to='/catalog/material'>Chất liệu</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{id ? 'Cập nhật' : 'Tạo'}</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col span={24}>
                    <Card>
                        <Form onFinish={handleSubmit(onSubmit)} layout="vertical" autoComplete="off">
                            <Col span={24}>
                                <Flex justifyContent="flex-end" alignItems="center">
                                    {
                                        id && material.update.loading ?
                                            <Button type="primary" loading>Đang cập nhật...</Button> :
                                            material.create.loading ?
                                                <Button type="primary" loading>Đang tạo...</Button> :
                                                id ? <Button htmlType="submit" type="primary">Cập nhật</Button> :
                                                       <Button htmlType="submit" type="primary" disabled={!!Object.keys(errors).length}>Tạo</Button>
                                    }
                                </Flex>
                            </Col>
                            <Divider />
                            <Col span={24}>
                                <Form.Item label="Tên">
                                    <Controller
                                        name="material_name"
                                        control={control}
                                        rules={{
                                             required: true,
                                             validate:validateNoWhiteSpace
                                         }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={materialNameErrorRef}>
                                                    <Input {...field} placeholder="Ví dụ: Bamboo" />
                                                    {errors?.material_name ? <Box as="div" mt={1} textColor="red.600">{errors.material_name?.type === 'required' ? "Vui lòng điền tên!" : errors.material_name.message}</Box> : null}
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                              {
                                id && (
                                    <Form.Item label="Mã chất liệu">
                                    <Controller
                                        name="material_code"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={materialCodeErrorRef}>
                                                    <Input {...field} placeholder="Ví dụ: VNMA001" disabled />
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                                )
                              }
                            </Col>
                        </Form>

                    </Card>
                </Col>
            </Row>

        </Fragment>
    )
}
export default MaterialCreateUpdate