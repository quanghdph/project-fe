
import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Comment, Pagination, Tooltip } from 'antd'
import { createAxiosClient, createAxiosJwt } from 'src/axios/axiosInstance';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { Box, Flex, useToast } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { createRating, getListRating } from 'src/features/rating/action';
import { Row, Col, Form, Input, Divider, Button, Rate } from 'antd'
import { Controller, useForm } from 'react-hook-form';
import autoAnimate from "@formkit/auto-animate"
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

interface FormValuesRating {
    title: string
    content: string
}

TimeAgo.addDefaultLocale(en)

const timeAgo = new TimeAgo('en-US')

const Rating = () => {
    // ** State
    const [take, setTake] = useState<number>(12)
    const [skip, setSkip] = useState<number>(0)
    const [refresh, setRefresh] = useState<boolean>(false)
    const [star, setStar] = useState(1);

    // ** Variables
    const axiosClient = createAxiosClient();
    const axiosClientJwt = createAxiosJwt();
    const dispatch = useAppDispatch();
    const rating = useAppSelector((state) => state.rating);
    const auth = useAppSelector((state) => state.auth);

    // ** Third party
    const params = useParams()
    const { id } = params
    const toast = useToast()
    const navigate = useNavigate()
    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValuesRating>({
        defaultValues: {
            title: '',
            content: '',
        }
    });

    // ** Ref
    const titleErrorRef = useRef(null);
    const contentErrorRef = useRef(null);

    // ** Effect
    useEffect(() => {
        titleErrorRef.current && autoAnimate(titleErrorRef.current);
        contentErrorRef.current && autoAnimate(contentErrorRef.current);
    }, [parent])

    useEffect(() => {
        if (id) {
            getListRating({
                axiosClient,
                dispatch,
                navigate,
                pagination: {
                    skip,
                    take
                },
                toast,
                id: +id
            })
        }
    }, [refresh, id])

    // ** Function handle
    const handleOnChangePagination = (e: number) => {
        setSkip(e - 1)
    }

    const onSubmit = (data: FormValuesRating) => {
        createRating({
            axiosClientJwt,
            dispatch,
            navigate,
            rating: {
                content: data.content,
                stars: star,
                product_id: id ? +id : 0,
                title: data.title
            },
            refresh,
            setRefresh,
            toast
        })
        setStar(1)
        reset()
    }

    const dataToRender = () => {
        if (!rating.list.loading && rating.list.result && rating.list.result.rates.length > 0) {
            return rating.list.result.rates.map((rate, index) => {
                return (
                    <Comment
                        key={index}
                        author={<p>{rate.users.first_name + rate.users.last_name}</p>}
                        content={
                            <Fragment>
                                <p className='font-bold'>{rate.title}</p>
                                <p> <Rate style={{ fontSize: "14px" }} disabled defaultValue={rate.stars} /></p>
                                <p>
                                    {rate.content}
                                </p>
                            </Fragment>
                        }
                        datetime={<span>{timeAgo.format(new Date(rate.cmt_datetime))}</span>}
                    />
                )
            })
        }
        return (
            <Flex justifyContent="center" flexDirection="column" alignItems="center">
                <Box fontWeight="semibold" fontSize="1rem" textTransform="uppercase">The product has no reviews yet</Box>
                <Rate value={0} disabled />
            </Flex>
        )
    }

    return (
        <Fragment>
            <Row>
                <Col span={24}>
                    {dataToRender()}
                    {
                        !rating.list.loading && rating.list.result && rating.list.result.rates.length > 0 && (
                            <Flex justifyContent="flex-end">
                                <Pagination
                                    total={rating.list.result?.total || 0}
                                    defaultCurrent={skip + 1}
                                    onChange={handleOnChangePagination}
                                    defaultPageSize={take}
                                    responsive={true}
                                />
                            </Flex>
                        )
                    }
                </Col>
                {
                    auth.login.result ? (
                        <Fragment>
                            <Divider />
                            <Col span={24}>
                                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                                    <Box textAlign="center" fontWeight="bold" fontSize="2xl">Rating</Box>
                                    <Form.Item label="Stars">
                                        <Rate value={star} onChange={(value: number) => { setStar(value) }} />
                                    </Form.Item>
                                    <Form.Item label="Title">
                                        <Controller
                                            name="title"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => {
                                                return (
                                                    <div ref={titleErrorRef}>
                                                        <Input {...field} />
                                                        {errors?.title ? <Box as="div" mt={1} textColor="red.600">{errors.title?.type === 'required' ? "Please input your title!" : errors.title.message}</Box> : null}
                                                    </div>
                                                )
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Content">
                                        <Controller
                                            name="content"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => {
                                                return (
                                                    <div ref={titleErrorRef}>
                                                        <Input.TextArea {...field} />
                                                        {errors?.content ? <Box as="div" mt={1} textColor="red.600">{errors.content?.type === 'required' ? "Please input your content!" : errors.content.message}</Box> : null}
                                                    </div>
                                                )
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type='primary' htmlType='submit' loading={rating.create.loading}>Send</Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Fragment>
                    ) : null
                }
            </Row>
        </Fragment>
    );
};

export default Rating;