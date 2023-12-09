// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @ts-nocheck

import React, { Fragment } from 'react';
import { Input, InputNumber } from 'antd';
import { Controller } from "react-hook-form";
import { Box, Text } from '@chakra-ui/react';

interface DataType {
    sku: JSX.Element;
    variant: JSX.Element;
    originPrice: JSX.Element;
    price: JSX.Element;
    stock: JSX.Element;
}

export const columns = () => [
    {
        title: 'SKU',
        dataIndex: 'sku',
        key: 'sku',
        render: (sku: JSX.Element) => sku
    },
    {
        title: 'Tên biến thể',
        dataIndex: 'variant',
        key: 'variant',
        render: (variant: JSX.Element) => variant
    },
    {
        title: 'Giá gốc',
        dataIndex: 'originPrice',
        key: 'originPrice',
        render: (originPrice: JSX.Element) => originPrice
    },
    {
        title: 'Giá bán',
        dataIndex: 'price',
        key: 'price',
        render: (price: JSX.Element) => price
    },
    {
        title: 'Số lượng',
        dataIndex: 'stock',
        key: 'stock',
        render: (stock: JSX.Element) => stock
    },
];

export const data = ({ control, errors, variantItem, setValue, clearErrors }): DataType[] => {
    return variantItem.map((_item, index) => {
        return {
            sku: (
                <Controller
                    key={index}
                    name={`sku[${index}]`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, ...other } }) => {
                        return (
                            <Fragment>
                                <Input
                                    className='!my-1'
                                    id='sku'
                                    status={'sku' in errors && errors?.sku[index] ? 'error' : ''}
                                    placeholder='Ví dụ: bag-sku-01'
                                    onChange={e => {
                                        setValue(`variant[${index}].sku`, e.target.value);
                                        onChange(e.target.value)
                                        clearErrors('sku')
                                    }}
                                    {...other}
                                    value={value || ''}
                                />
                                {'sku' in errors && errors?.sku[index] ? <Box as="span" textColor="red.500">{errors.sku[index]?.type === 'required' ? "Vui lòng điền SKU!" : errors.sku[index].message}</Box> : null}
                            </Fragment>
                        )
                    }}
                />
            ),
            variant: (
                <Controller
                    name={`variant[${index}]`}
                    key={index}
                    control={control}
                    render={({ field: { value: { name } } }) => {
                        return (
                            <Fragment>
                                <Text>{name}</Text>
                            </Fragment>
                        )
                    }}
                />
            ),
            originPrice: (
                <Controller
                    name={`originPrice[${index}]`}
                    key={index}
                    control={control}
                    render={({ field: { value, ...other } }) => {
                        return (
                            <Fragment>
                                <InputNumber
                                    className='!my-1'
                                    id='originPrice'
                                    type=''
                                    defaultValue={0}
                                    {...other}
                                    value={value || 0}
                                />
                            </Fragment>
                        )
                    }}
                />
            ),
            price: (
                <Controller
                    name={`price[${index}]`}
                    key={index}
                    control={control}
                    render={({ field: { value, ...other } }) => {
                        return (
                            <Fragment>
                                <InputNumber
                                    className='!my-1'
                                    id='price'
                                    type=''
                                    defaultValue={0}
                                    {...other}
                                    value={value || 0}
                                />
                            </Fragment>
                        )
                    }}
                />
            ),
            stock: (
                <Controller
                    name={`stock[${index}]`}
                    key={index}
                    control={control}
                    render={({ field: { value, ...other } }) => {
                        return (
                            <Fragment>
                                <InputNumber
                                    style={{ width: "100%" }}
                                    id='stock'
                                    defaultValue={0}
                                    {...other}
                                    value={value || 0}
                                />
                            </Fragment>
                        )
                    }}
                />
            )
        }
    })
}

