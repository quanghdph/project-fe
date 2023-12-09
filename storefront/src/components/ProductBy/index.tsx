import React from 'react';
import CardProduct from '../CardProduct/cardProduct';
import { createAxiosClient } from 'src/axios/axiosInstance';
import { IAxiosResponse, Product } from 'src/shared/types';
import { Row, Col } from 'antd'

interface ProductByProps {
    title: string,
    url: string
}

const ProductBy = ({ title, url }: ProductByProps) => {
    // ** Variables
    const axiosClient = createAxiosClient();

    // ** State
    const [products, setProducts] = React.useState<Product[]>([])

    // ** Effect
    React.useEffect(() => {
        axiosClient.get(url).then((res) => {
            const result = { ...res } as unknown as IAxiosResponse<Product[]>
            setProducts(result.response.data)
        })
    }, [])

    // ** Function handle
    const dataToRender = () => {
        if (products && products.length) {
            return (
                <Row style={{ marginBottom: "2rem" }}>
                    <Col span={24}>
                        <p className='font-bold text-3xl uppercase text-center'>{title}</p>
                    </Col>
                    <Col span={24}>
                        <Row gutter={[16, 16]}>
                            {products.map((p, index) => {
                                return <CardProduct key={index} span={4} product={p} />
                            })}
                        </Row>

                    </Col>
                </Row>
            )
        }
        return null
    }
    return (
        <React.Fragment>
            {dataToRender()}
        </React.Fragment>
    );
};

export default ProductBy;