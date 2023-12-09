import { Flex } from '@chakra-ui/react';
import { Col, Tooltip } from 'antd';
import React from 'react';
import { useAppSelector } from 'src/app/hooks';
import { currency } from 'src/helper/currencyPrice';

const OrderInfo = () => {
    const order = useAppSelector((state) => state.order);

    return (
        <Col span={24}>
            <Flex justifyContent={"center"} alignItems={"center"} mb={2}>
                <img style={{ width: "150px", borderRadius: '50%', height: '150px', objectFit: 'contain', border: '1px solid #dbdbdb' }} src={!order.single.loading && order.single.result ? order.single.result.product_variant.featured_asset?.url ? order.single.result.product_variant.featured_asset?.url : 'https://static.thenounproject.com/png/504708-200.png' : ''} />
            </Flex>
            <Flex borderBottom={"1px solid #dbdbdb"} padding={"10px 0"} justifyContent={"center"} alignItems={"center"}>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"}></Flex>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"} fontWeight={"bold"}>Tên sản phẩm</Flex>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"} fontWeight={"bold"}>SKU</Flex>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"} fontWeight={"bold"}>Số lượng</Flex>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"} fontWeight={"bold"}>Giá gốc</Flex>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"} fontWeight={"bold"}>Giá bán</Flex>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"} fontWeight={"bold"}>Tổng</Flex>
            </Flex>
            <Flex borderBottom={"1px dashed #dbdbdb"} padding={"10px 0"} justifyContent={"center"} alignItems={"center"}>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"}></Flex>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"} textOverflow='ellipsis' whiteSpace='nowrap' overflow='hidden'>
                    <Tooltip title={!order.single.loading && order.single.result ? order.single.result.product_variant.name : null}>
                        {!order.single.loading && order.single.result ? order.single.result.product_variant.name : null}
                    </Tooltip>
                </Flex>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"} textOverflow='ellipsis' whiteSpace='nowrap' overflow='hidden' ml={2}>
                    <Tooltip title={!order.single.loading && order.single.result ? order.single.result.product_variant.sku : null}>
                        {!order.single.loading && order.single.result ? order.single.result.product_variant.sku : null}
                    </Tooltip>
                </Flex>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"}>{!order.single.loading && order.single.result ? order.single.result.quantity : null}</Flex>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"}>{!order.single.loading && order.single.result ? currency(order.single.result.product_variant.origin_price) : null}</Flex>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"}>{!order.single.loading && order.single.result ? currency(order.single.result.product_variant.price) : null}</Flex>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"} fontWeight={"semibold"}>{!order.single.loading && order.single.result ? currency(order.single.result.quantity * order.single.result.product_variant.price) : "0"}</Flex>
            </Flex>
            <Flex borderBottom={"1px dashed #dbdbdb"} padding={"10px 0"} justifyContent={"center"} alignItems={"center"}>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"} fontWeight={"bold"} textOverflow='ellipsis' whiteSpace='nowrap' overflow='hidden'>
                    <Tooltip title={!order.single.loading && order.single.result ? order.single.result?.promotion ? order.single.result.promotion.coupon_code : null : null}>
                        {!order.single.loading && order.single.result ? order.single.result?.promotion ? order.single.result.promotion.coupon_code : null : null}
                    </Tooltip>
                </Flex>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"}></Flex>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"}></Flex>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"}></Flex>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"}></Flex>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"}></Flex>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"} fontWeight={"semibold"}>{!order.single.loading && order.single.result ? order.single.result.promotion ? `-${order.single.result.promotion.discount}% (-${currency(order.single.result.quantity * order.single.result.product_variant.price * (1 - (100 - order.single.result.promotion.discount) / 100))})` : '0' : '0'}</Flex>
            </Flex>
            <Flex padding={"10px 0"} justifyContent={"center"} alignItems={"center"}>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"}></Flex>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"}></Flex>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"}></Flex>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"}></Flex>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"}></Flex>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"}></Flex>
                <Flex flex={1} justifyContent={"center"} alignItems={"center"} fontWeight={"semibold"}>{!order.single.loading && order.single.result ? currency(order.single.result.total_price) : 0}</Flex>
            </Flex>
        </Col>
    );
};

export default OrderInfo;