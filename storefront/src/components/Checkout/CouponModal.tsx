import { Box, useToast } from '@chakra-ui/react';
import { Card, Modal, Spin } from 'antd';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createAxiosJwt } from 'src/axios/axiosInstance';
import { getListPromotion } from 'src/features/promotion/action';

interface CouponModalProps {
    couponModal: boolean
    setCouponModal: (couponModal: boolean) => void
}

const CouponModal = ({ couponModal, setCouponModal }: CouponModalProps) => {
    // ** State
    const [take, setTake] = useState<number>(9999)
    const [skip, setSkip] = useState<number>(0)

    // ** Third party
    const toast = useToast()

    // ** Variables
    const promotion = useAppSelector((state) => state.promotion);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Effect
    useEffect(() => {
        getListPromotion({
            axiosClientJwt,
            dispatch,
            toast,
            pagination: {
                skip,
                take,
                status: 'active'
            }
        })
    }, [])

    return (
        <Fragment>
            <Modal title="Coupon" open={couponModal} onCancel={() => setCouponModal(false)} centered footer={null}>
                <Spin spinning={promotion.list.loading} style={{ maxHeight: 'unset' }}>
                    <Box height="500px" overflowY="auto" sx={{ '&::-webkit-scrollbar': { display: 'none' } }}>
                        {
                            promotion && promotion.list?.result && (
                                promotion.list?.result?.promotions?.map((promotion) => {
                                    return (
                                        <Card title={promotion.name} style={{ marginTop: "1rem", opacity: moment(promotion.ends_at).subtract(1, 'days').date() - moment(new Date()).subtract(1, 'days').date() < 0 ? 0.5 : 1 }}>
                                            <Box mb={2}>
                                                Coupon code: <span className='font-bold'>{promotion.coupon_code}</span>
                                            </Box>
                                            <Box mb={2}>
                                                Discount: <span className='font-semibold'>{promotion.discount}%</span>
                                            </Box>
                                            <Box>
                                                Remaining: <span className='font-semibold'>{promotion.limit}</span>
                                            </Box>
                                        </Card>
                                    )
                                })
                            )
                        }
                    </Box>
                </Spin>
            </Modal>
        </Fragment>
    );
};

export default CouponModal;