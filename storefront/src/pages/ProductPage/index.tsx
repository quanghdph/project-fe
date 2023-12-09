import React, { Fragment } from 'react'
import FilterProduct from 'src/components/FilterProduct'
import ListProduct from 'src/components/ListProduct'
import { Col, Row } from 'antd'
import { Breadcrumb, BreadcrumbItem } from '@chakra-ui/react'
import { ChevronRight } from 'react-feather'
import { Link } from 'react-router-dom'

const ProductPage = () => {
    // ** State
    const [filterCategories, setFilterCategories] = React.useState<number[]>()
    const [price, setPrice] = React.useState<number>(0);
    const [size, setSize] = React.useState<number[]>([])
    const [color, setColor] = React.useState<number[]>([])


    return (
        <Fragment>
            <div className='py-8 px-10 mt-16'>
                <Row>
                    <Col span={24}>
                        <Breadcrumb spacing='8px' marginBottom='35px' separator={<ChevronRight size={14} />}>
                            <BreadcrumbItem>
                                <Link to='/' className='hover:text-primary hover:no-underline transition duration-150 text-sm font-medium'>Home</Link>
                            </BreadcrumbItem>
                            <BreadcrumbItem isCurrentPage>
                                <Link to='#' className='!text-[#999] text-sm font-medium'>Products</Link>
                            </BreadcrumbItem>
                        </Breadcrumb>
                    </Col>
                    <Col span={24}>
                        <Row gutter={[16, 16]}>
                            <Col span={5}>
                                <FilterProduct setFilterCategories={setFilterCategories} setPrice={setPrice} price={price as number} setSize={setSize} setColor={setColor} />
                            </Col>
                            <Col span={19}>
                                <ListProduct filterCategories={filterCategories as number[]} price={price as number} opts={[...size, ...color]} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </Fragment>
    )
}

export default ProductPage