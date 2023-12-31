import React, { Fragment } from 'react'
import { useForm, Controller } from "react-hook-form"
import { Breadcrumb, BreadcrumbItem, Button, FormControl, HStack, Input, Select, useToast } from '@chakra-ui/react';
import { ChevronRight } from 'react-feather';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createAxiosClient, createAxiosJwt } from 'src/axios/axiosInstance';
import { IAxiosResponse, Product, ProductOption } from 'src/shared/types';
import { addToCart } from 'src/features/cart/action';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { Col, Row, Divider } from 'antd';
import Rating from '../Rating';

const ProductDetail = () => {

    // ** Variables
    const cart = useAppSelector((state) => state.cart);
    const axiosClient = createAxiosClient();
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** State
    const [product, setProduct] = React.useState<Product>()
    const [color, setColor] = React.useState()
    const [colorIdSelected, setColorIdSelected] = React.useState()
    const [colorId, setColorId] = React.useState<number>()

    // ** Third party
    const { id } = useParams()
    const toast = useToast()
    const navigate = useNavigate()

    const { control, setValue, handleSubmit } = useForm({
        defaultValues: {
            quantity: 1
        }
    })


    // ** Effect
    React.useEffect(() => {
        axiosClient.get(`/product/${id}`).then((res) => {
            const result = { ...res } as unknown as IAxiosResponse<Product>
            setProduct(result.data)
        })
    }, [])
    

    React.useEffect(() => {
        axiosClient.get(`/color`).then((res) => {
            const result = { ...res } as unknown as IAxiosResponse<Product>
            setColor(result.data.listColors)
        })
    }, [])

    React.useEffect(() => {
        // if (product) {
        //     setVariantId(product.product_variants[0]?.id)
        // }
    }, [product])

    // ** Function handle
    // const renderVariantOption = (data: { product_option: ProductOption }[]) => {
    //     const arrayVariantOption: any = []
    //     data.forEach(element => {
    //         arrayVariantOption.push(element.product_option.value)
    //     });
    //     return arrayVariantOption.toString().replace(',', ' ')
    // }


    const onSubmit = (data: { quantity: number }) => {
        if (id) {
            addToCart({
                axiosClientJwt,
                cart: {
                    quantity: data.quantity
                },
                dispatch,
                id: variantId ? variantId : 0,
                toast
            })
        }
    }



    return (
        <React.Fragment>
            <div className='py-8 px-10 mt-16'>
                <Row>
                    <Col span={24}>
                        <Breadcrumb spacing='8px' marginBottom='35px' separator={<ChevronRight size={14} />}>
                            <BreadcrumbItem>
                                <Link to='/' className='hover:text-primary hover:no-underline transition duration-150 text-sm font-medium'>Home</Link>
                            </BreadcrumbItem>

                            <BreadcrumbItem>
                                <Link to='/products' className='hover:text-primary hover:no-underline transition duration-150 text-sm font-medium'>Products</Link>
                            </BreadcrumbItem>

                            <BreadcrumbItem isCurrentPage>
                                <Link to='#' className='!text-[#999] text-sm font-medium'>{product?.name}</Link>
                            </BreadcrumbItem>
                        </Breadcrumb>
                    </Col>
                    <Col span={24}>
                        <Row gutter={[16, 16]} style={{ padding: "25px 0" }} justify="space-evenly">
                            <Col span={6}>
            
                                   {product&& <img src={`http://localhost:8080/product/${product?.id}/image-main`} alt='' className='w-full object-cover rounded-md'/>}
                            </Col>
                            <Col span={12}>
                                <div className='flex flex-col gap-3'>
                                    <p className='font-bold text-2xl'>{product?.name}</p>
                
                                    <div className='flex flex-col gap-2'>
                                        <p className='font-semibold'>Màu sắc</p>

                                        <Fragment>
                                            <div>
                                                {
                                                    color && color.map((item, index) => {
                                                        return (
                                                            
                                                             <label style={{padding:"10px"}} className='col-6' key={item.id}><input type='radio' checked={colorIdSelected==item.id} onChange={()=>setColorIdSelected(item.id)} value={item.id}/> {item.colorName}</label>
                                                            
                                                        )
                                                    })
                                                }
                                            </div>
                                        </Fragment>

                                    </div>
                                    {/* <p className='font-bold text-sm'>Available: {(product?.product_variants.find((variant) => variant.id === variantId)?.stock || 0)}</p> */}
                                    <div >
                                        <p className='font-semibold'>Kho: {product?.quantity}</p>
                                        <p className='font-semibold'>Mã sản phẩm: {product?.id}</p>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <p className='font-semibold'>Quantity</p>
                                        <FormControl>
                                            <Controller
                                                name='quantity'
                                                control={control}
                                                render={({ field: { value } }) => (
                                                    <Fragment>
                                                        <HStack maxW='320px'>
                                                            <Button onClick={() => {
                                                                if (value > 1) {
                                                                    setValue('quantity', value - 1)
                                                                }
                                                            }}>-</Button>
                                                            <Input width={'60px'} value={value} onChange={(e) => setValue('quantity', parseInt(e.target.value))} />
                                                            <Button onClick={() => {
                                                                if (value < 50) {
                                                                    setValue('quantity', value + 1)
                                                                }
                                                            }}>+</Button>
                                                        </HStack>
                                                    </Fragment>
                                                )}
                                            />
                                        </FormControl>
                                    </div>
                                    <div className='flex flex-row items-center gap-5 mt-2'>
                                        {/* {
                                            product?.product_variants.find((variant) => variant.id === variantId)?.stock || 0 > 0 ? (
                                                <Button
                                                    className='!bg-primary text-white hover:!bg-[#5866c9]'
                                                    variant='solid'
                                                    isLoading={cart.addToCart.loading}
                                                    onClick={handleSubmit(onSubmit)}
                                                >
                                                    Add to cart
                                                </Button>
                                            ) : null
                                        } */}

                                    </div>
                                    {/* </form> */}
                                    <p className='text-[#666]' dangerouslySetInnerHTML={{ __html: product?.description || '' }} />
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Divider />
                    <Col span={24}>
                        <Rating />
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    )

}
export default ProductDetail