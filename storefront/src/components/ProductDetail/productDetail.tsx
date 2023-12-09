import React, { Fragment } from 'react'
import { useForm, Controller } from "react-hook-form"
import formatMoney from 'src/shared/utils/formatMoney';
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
    const [variantId, setVariantId] = React.useState<number>()

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
        axiosClient.get(`product/${id}`).then((res) => {
            const result = { ...res } as unknown as IAxiosResponse<Product>
            setProduct(result.response.data)
        })
    }, [])

    React.useEffect(() => {
        if (product) {
            setVariantId(product.product_variants[0]?.id)
        }
    }, [product])

    // ** Function handle
    const renderVariantOption = (data: { product_option: ProductOption }[]) => {
        const arrayVariantOption: any = []
        data.forEach(element => {
            arrayVariantOption.push(element.product_option.value)
        });
        return arrayVariantOption.toString().replace(',', ' ')
    }

    const onChangeVariant = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setVariantId(+event.target.value)
    }

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
                                <img src={product?.product_variants.find((variant) => variant.id === variantId)?.featured_asset?.url ?
                                    product?.product_variants.find((variant) => variant.id === variantId)?.featured_asset?.url :
                                    "https://us.123rf.com/450wm/mathier/mathier1905/mathier190500002/134557216-no-thumbnail-image-placeholder-for-forums-blogs-and-websites.jpg?ver=6"
                                } alt='' className='w-full object-cover rounded-md' />
                            </Col>
                            <Col span={12}>
                                <div className='flex flex-col gap-3'>
                                    <p className='font-bold text-2xl'>{product?.name}</p>
                                    <p className='font-bold text-sm' style={{ color: "gray" }}>{product?.product_variants.find((variant) => variant.id === variantId)?.sku}</p>
                                    <p className='font-bold text-lg'>{formatMoney(product?.product_variants.find((variant) => variant.id === variantId)?.price || 0)}</p>
                                    {/* <form > */}
                                    <div className='flex flex-col gap-2'>
                                        <p className='font-semibold'>Select option</p>
                                        <Fragment>
                                            <Select value={variantId} onChange={onChangeVariant}>
                                                {
                                                    product?.product_variants.map((item, index) => {
                                                        const variantOption = renderVariantOption(item.product_options)
                                                        return (
                                                            <option value={item.id} key={item.id}>{`${product.name} ${variantOption}`}</option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </Fragment>
                                    </div>
                                    <p className='font-bold text-sm'>Available: {(product?.product_variants.find((variant) => variant.id === variantId)?.stock || 0)}</p>
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
                                        {
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
                                        }

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