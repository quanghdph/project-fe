import { Box, Button, Card, HStack, useToast } from '@chakra-ui/react';
import { Col, Form, Input, Row } from 'antd';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createAxiosJwt } from 'src/axios/axiosInstance';
import { deleteFromCart, updateCart } from 'src/features/cart/action';
import { Cart } from 'src/shared/types';
import formatMoney from 'src/shared/utils/formatMoney';

interface FormValues {
    quantity: number
}

interface CartItemProps {
    cartItem: Cart
    onClose: () => void
    refresh: boolean
    setRefresh: (refresh: boolean) => void
}

const CartItem = ({ cartItem, onClose, refresh, setRefresh }: CartItemProps) => {
    const [itemIdDel, setItemIdDel] = React.useState<number>()

    const navigate = useNavigate()
    const toast = useToast()

    const { control, setValue, setError, formState: { errors }, resetField } = useForm<FormValues>({
        defaultValues: {
            quantity: cartItem.quantity
        }
    });

    const cart = useAppSelector((state) => state.cart)
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    React.useEffect(() => {
        console.log(cartItem.quantity)
        setValue('quantity', cartItem.quantity)
    }, [])

    return (
        <Card variant="outline" padding="10px" mb={4}>
            <Row gutter={[16, 0]}>
                <Col span={8}>
                    <img src={cartItem.product_variant?.featured_asset ? cartItem.product_variant.featured_asset?.url : "https://inantemnhan.com.vn/wp-content/uploads/2017/10/no-image.png"} className="w-full object-cover" />
                </Col>
                <Col span={16}>
                    <p className="font-bold">{cartItem.product_variant.name}</p>
                    <p className="text-xs text-[#808080]">{cartItem.product_variant.sku}</p>
                    <p>Price: {formatMoney(cartItem.product_variant.price)}</p>
                    <p className="font-bold">Total: {formatMoney(cartItem.product_variant.price * cartItem.quantity)}</p>
                    <Form className='flex'>
                        <Controller
                            name='quantity'
                            control={control}
                            render={({ field: { value, ...other } }) => {
                                console.log(value)
                                return (
                                    <React.Fragment>
                                        <HStack maxW='320px'>
                                            <Button
                                                size='sm'
                                                borderRadius='50%'
                                                onClick={() => {
                                                    resetField('quantity')
                                                    updateCart({
                                                        axiosClientJwt,
                                                        cart: {
                                                            quantity: value - 1
                                                        },
                                                        dispatch,
                                                        id: cartItem.product_variant.id,
                                                        refresh,
                                                        setError,
                                                        setRefresh,
                                                        toast
                                                    })
                                                }}
                                            >
                                                -
                                            </Button>
                                            <Input  {...other} value={value} disabled={cart.update.loading} style={{ width: '50px', border: 'none', pointerEvents: 'none' }} />
                                            <Button
                                                size='sm'
                                                borderRadius='50%'
                                                onClick={() => {
                                                    resetField('quantity')
                                                    updateCart({
                                                        axiosClientJwt,
                                                        cart: {
                                                            quantity: value + 1
                                                        },
                                                        dispatch,
                                                        id: cartItem.product_variant.id,
                                                        refresh,
                                                        setError,
                                                        setRefresh,
                                                        toast
                                                    })
                                                }}
                                            >
                                                +
                                            </Button>
                                        </HStack>
                                    </React.Fragment>
                                )
                            }}
                        />
                    </Form>
                    {errors?.quantity ? <Box as="div" mt={1} textColor="red.600">{errors.quantity.message}</Box> : null}
                </Col>
            </Row>
            <div className="flex justify-end mt-2" >
                <Button
                    size='sm'
                    colorScheme='blue'
                    borderRadius='3px'
                    onClick={() => {
                        navigate(`/checkout/${cartItem.id}`)
                        onClose()
                    }}
                >
                    Checkout
                </Button>
                <Button
                    className="ml-2"
                    borderRadius='3px'
                    size='sm'
                    colorScheme='red'
                    {...cartItem.product_variant.id === itemIdDel && { isLoading: cart.deleteProductFromCart.loading }}
                    onClick={() => {
                        setItemIdDel(cartItem.product_variant.id)
                        deleteFromCart({
                            axiosClientJwt,
                            dispatch,
                            id: cartItem.product_variant.id,
                            refresh,
                            setRefresh,
                            toast
                        })
                    }}>
                    Delete
                </Button>
            </div>
        </Card>
    );
};

export default CartItem;