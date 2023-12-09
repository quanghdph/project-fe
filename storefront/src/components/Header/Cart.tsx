import * as React from 'react';
import {
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    useToast,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { Spin } from 'antd';
import { getListProductOnCart } from 'src/features/cart/action';
import { createAxiosJwt } from 'src/axios/axiosInstance';
import CartItem from './CartItem';

interface CartProps {
    isOpen: boolean
    onClose: () => void
    refresh: boolean
    setRefresh: (refresh: boolean) => void
}

const Cart = ({ isOpen, onClose, refresh, setRefresh }: CartProps) => {

    const cart = useAppSelector((state) => state.cart)
    const checkout = useAppSelector((state) => state.checkout)

    const toast = useToast()

    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    React.useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            getListProductOnCart({
                axiosClientJwt,
                dispatch,
                toast
            })
        }
    }, [localStorage.getItem("accessToken"), refresh, cart.addToCart.loading, checkout.createOrder.result])

    const dataCartToRender = () => {
        if (!cart.listProductOnCart.loading && cart.listProductOnCart.result && cart.listProductOnCart.result.length) {
            return cart.listProductOnCart.result.map((p, index) => {
                return (
                    <CartItem cartItem={p} key={index} onClose={onClose} refresh={refresh} setRefresh={setRefresh} />
                )
            })
        }
        return null
    }

    return (
        <React.Fragment>
            <Drawer onClose={onClose} isOpen={isOpen} size='sm'>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader className="font-bold uppercase" borderBottomWidth='1px'>your cart</DrawerHeader>
                    <DrawerBody marginTop={'30px'} display='flex' flexDirection='column' gap='20px' height='500px' overflowY='auto' justifyContent={cart.listProductOnCart.loading ? 'center' : 'flex-start'}>
                        <Spin spinning={cart.listProductOnCart.loading}>
                            {dataCartToRender()}
                        </Spin>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </React.Fragment>
    );
};

export default Cart;