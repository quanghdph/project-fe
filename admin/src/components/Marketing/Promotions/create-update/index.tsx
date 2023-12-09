import { Box, Flex } from '@chakra-ui/react';
import autoAnimate from '@formkit/auto-animate';
import { Breadcrumb, Button, Card, Col, DatePicker, Divider, Form, Input, InputNumber, Row, Spin, Switch, message } from 'antd';
import moment from 'moment';
import React, { Fragment, useRef, useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createAxiosJwt } from 'src/helper/axiosInstance';
import type { DatePickerProps } from 'antd';
import { createPromotion, getPromotion, updatePromotion } from 'src/features/promotion/action';

export interface FormValuesPromotion {
    coupon_code: string
    name: string
    limit: string
    discount: string
}

const dateFormat = 'YYYY/MM/DD';

const PromotionCreateUpdate = () => {
    // ** State
    const [active, setActive] = useState<boolean>(true)
    const [startsAt, setStartsAt] = useState<string>()
    const [endsAt, setEndsAt] = useState<string>()

    // ** Third party
    const navigate = useNavigate()
    const params = useParams()
    const { id } = params
    const { control, handleSubmit, setValue, setError, formState: { errors } } = useForm<FormValuesPromotion>({
        defaultValues: {
            coupon_code: '',
            name: '',
            limit: '',
            discount: '',
        }
    });

    // ** Ref
    const nameErrorRef = useRef(null);
    const couponCodeErrorRef = useRef(null);

    // ** Variables
    const promotion = useAppSelector((state) => state.promotion);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Effect
    useEffect(() => {
        nameErrorRef.current && autoAnimate(nameErrorRef.current);
        couponCodeErrorRef.current && autoAnimate(couponCodeErrorRef.current);
    }, [parent])

    useEffect(() => {
        if (id) {
            getPromotion({
                axiosClientJwt,
                dispatch,
                id: +id,
                navigate
            })
        }
    }, [id])

    useEffect(() => {
        if (id && !promotion.single.loading && promotion.single.result) {
            setValue("coupon_code", promotion.single.result.coupon_code)
            setValue("discount", String(promotion.single.result.discount))
            setValue("limit", String(promotion.single.result.limit))
            setValue("name", promotion.single.result.name)
            setActive(promotion.single.result.active)
            setEndsAt(promotion.single.result.ends_at)
            setStartsAt(promotion.single.result.starts_at)
        }
    }, [id, promotion.single.loading, promotion.single.result])

    // ** Function handle
    const onSubmit = async (data: FormValuesPromotion) => {
        if (id) {
            updatePromotion({
                axiosClientJwt,
                dispatch,
                id: +id,
                message,
                navigate,
                promotion: {
                    active,
                    coupon_code: data.coupon_code,
                    ends_at: endsAt as string,
                    name: data.name,
                    starts_at: startsAt as string,
                    discount: +data.discount,
                    limit: +data.limit,
                },
                setError
            })
        } else {
            createPromotion({
                axiosClientJwt,
                dispatch,
                message,
                navigate,
                promotion: {
                    active,
                    coupon_code: data.coupon_code,
                    ends_at: endsAt as string,
                    name: data.name,
                    starts_at: startsAt as string,
                    discount: +data.discount,
                    limit: +data.limit,
                },
                setError
            })
        }
    };

    const onChangeDateStartsAtPicker: DatePickerProps['onChange'] = (date, _dateString) => {
        setStartsAt(date?.toISOString() as string)
    };

    const onChangeDateEndsAtPicker: DatePickerProps['onChange'] = (date, _dateString) => {
        setEndsAt(date?.toISOString() as string)
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
                            <Link to='/marketing/promotions'>Khuyến mãi</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{id ? 'Cập nhật' : 'Tạo'}</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col span={24}>
                    <Spin spinning={promotion.single.loading}>
                        <Card>
                            <Form onFinish={handleSubmit(onSubmit)} layout="vertical" autoComplete="off">
                                <Col span={24}>
                                    <Flex justifyContent="space-between" alignItems="center">
                                        <Flex justifyContent="center" alignItems="center">
                                            <Switch checked={active} size='small' onChange={() => setActive(!active)} />
                                            <Box as="span" ml={2} fontWeight="semibold">Hoạt động</Box>
                                        </Flex>
                                        {
                                            id && promotion.update.loading ?
                                                <Button type="primary" loading>Đang cập nhật...</Button> :
                                                promotion.create.loading ?
                                                    <Button type="primary" loading>Đang tạo...</Button> :
                                                    id ? <Button htmlType="submit" type="primary">Cập nhật</Button> :
                                                        <Button htmlType="submit" type="primary">Tạo</Button>
                                        }
                                    </Flex>
                                </Col>
                                <Divider />
                                <Col span={24}>
                                    <Form.Item label="Tên khuyến mãi">
                                        <Controller
                                            name="name"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => {
                                                return (
                                                    <div ref={nameErrorRef}>
                                                        <Input {...field} placeholder="Ví dụ: Ngày 8/8 giảm giá" />
                                                        {errors?.name ? <Box as="div" mt={1} textColor="red.600">{errors.name?.type === 'required' ? "Vui lòng điền tên khuyến mãi!" : errors.name.message}</Box> : null}
                                                    </div>
                                                )
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Mã khuyến mãi">
                                        <Controller
                                            name="coupon_code"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => {
                                                return (
                                                    <div ref={couponCodeErrorRef}>
                                                        <Input {...field} placeholder="Ví dụ: ad7dwd58" />
                                                        {errors?.coupon_code ? <Box as="div" mt={1} textColor="red.600">{errors.coupon_code?.type === 'required' ? "Vui lòng điền mã khuyến mãi!" : errors.coupon_code.message}</Box> : null}
                                                    </div>
                                                )
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Thời gian bắt đầu">
                                        <DatePicker placeholder={'Chọn ngày bắt đầu'} style={{ width: "100%" }} value={startsAt ? moment(startsAt?.substring(0, 10), dateFormat) : '' as any} onChange={onChangeDateStartsAtPicker} />
                                    </Form.Item>
                                    <Form.Item label="Thời gian kết thúc">
                                        <DatePicker placeholder={'Chọn ngày kết thúc'} style={{ width: "100%" }} value={endsAt ? moment(endsAt?.substring(0, 10), dateFormat) : '' as any} onChange={onChangeDateEndsAtPicker} />
                                    </Form.Item>
                                    <Form.Item label="Giới hạn">
                                        <Controller
                                            name="limit"
                                            control={control}
                                            render={({ field }) => {
                                                return (
                                                    <div>
                                                        <InputNumber
                                                            {...field}
                                                            style={{ width: "100%" }}
                                                        />
                                                    </div>
                                                )
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Giảm giá">
                                        <Controller
                                            name="discount"
                                            control={control}
                                            render={({ field }) => {
                                                return (
                                                    <div>
                                                        <InputNumber
                                                            {...field}
                                                            formatter={value => `${value}%`}
                                                            min={'0'}
                                                            style={{ width: "100%" }}
                                                            max={'100'}
                                                            parser={value => value!.replace('%', '')}
                                                        />
                                                    </div>
                                                )
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Form>
                        </Card>
                    </Spin>
                </Col>
            </Row>
        </Fragment>
    );
};

export default PromotionCreateUpdate;