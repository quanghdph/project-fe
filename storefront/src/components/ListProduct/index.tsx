import React, { Fragment, useState } from 'react'
import { createAxiosClient } from 'src/axios/axiosInstance';
import { IAxiosResponse, Product } from 'src/shared/types';
import { Row, Col, Pagination, Input } from 'antd'
import CardProduct from '../CardProduct/cardProduct';
import { Flex } from '@chakra-ui/react';
import { useDebounce } from 'use-debounce';

interface ProductList {
    products: Product[]
    totalPage: number
    total: number
    skip: number
    take: number
}

interface ListProductProps {
    filterCategories: number[],
    price: number
    opts: number[]
}

const ListProduct = ({ filterCategories, price, opts }: ListProductProps) => {
    // ** State
    const [products, setProducts] = React.useState<ProductList>()
    const [total, setTotal] = React.useState()
    const [take, setTake] = useState<number>(12)
    const [skip, setSkip] = useState<number>(0)
    const [search, setSearch] = useState<string>('')
    const [value] = useDebounce(search, 1000);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [filter, setFilter] = useState('')

    // ** Variables
    const axiosClient = createAxiosClient();

    // ** Effect
    React.useEffect(() => {
        axiosClient.get(`/product?page=${page}&limit=${limit}&filter=${filter}`
        // , {
        //     params: {
        //         skip,
        //         take,
        //         search: value,
        //         categories: filterCategories,
        //         price,
        //         options: opts,
        //         status: "active"
        //     }
        // }
        ).then((res) => {
            const result = { ...res } as unknown as IAxiosResponse<Product[]>
            console.log(result);
            // const filterProductActive = result.data.list.filter((e) => e.status === 1)
            // console.log(filterProductActive);
            setProducts(result.data.list as unknown as ProductList)
            setTotal(result.data.total)
        })
    }, [filterCategories, value, price, page])

    // ** Function handle
    const handleOnChangePagination = (e: number) => {
        // setSkip((e - 1) * take)
        setPage(e)
    }

    const dataToRender = () => {
        if (products && products.length) {
            return (
                <Row gutter={[16, 16]}>
                    {products?.map((p, index) => {
                        console.log(p)
                        return <CardProduct key={index} span={6} product={p} />
                    })}
                </Row>
            )
        }
        return null
    }


    return (
        <Fragment>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Input placeholder='Search by name' onChange={(e) => { setSearch(e.target.value); }} />
                </Col>
                <Col span={24}>
                    {dataToRender()}
                </Col>
                <Col span={24}>
                    {
                        products ? (
                            <Flex justifyContent="flex-end">
                                <Pagination
                                    total={total || 0}
                                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                                    // defaultCurrent={skip + 1}
                                    onChange={handleOnChangePagination}
                                    // defaultPageSize={take}
                                    responsive={true}
                                />
                            </Flex>
                        ) : null
                    }

                </Col>
            </Row>
        </Fragment>
    )
}

export default ListProduct