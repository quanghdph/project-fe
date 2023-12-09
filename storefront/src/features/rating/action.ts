import { CreateToastFnReturn } from '@chakra-ui/react';
import {
    getListRatingStart,
    getListRatingSuccess,
    getListRatingFailed,
    createRatingStart,
    createRatingSuccess,
    createRatingFailed
} from './ratingSlice'
import { NavigateFunction } from 'react-router-dom';
import { IAxiosResponse, Pagination } from 'src/shared/types';
import { AxiosInstance, Axios } from 'axios';
import { AppDispatch } from 'src/app/store';


interface GetRatingParams {
    dispatch: AppDispatch,
    axiosClient: Axios,
    pagination: Pagination,
    navigate: NavigateFunction,
    toast: CreateToastFnReturn,
    id: number
}

interface CreateRatingParams extends Omit<GetRatingParams, "pagination" | "id" | "axiosClient"> {
    rating: RatingCreate
    refresh: boolean
    axiosClientJwt: AxiosInstance,
    setRefresh: (refresh: boolean) => void
}

interface RatingCreate {
    product_id: number
    title: string
    stars: number
    content: string
}

export const getListRating = async ({ pagination, dispatch, axiosClient, toast, id }: GetRatingParams) => {
    try {
        const { skip, take } = pagination;
        dispatch(getListRatingStart());
        const res: IAxiosResponse<{}> = await axiosClient.get(`/rate/list/${id}`, {
            params: {
                take,
                skip,
            },
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(getListRatingSuccess(res.response.data));
            }, 1000)
        } else {
            dispatch(getListRatingFailed(null));
        }
    } catch (error: any) {
        toast({
            status: 'error',
            title: 'Something went wrong!',
            isClosable: true,
            position: "top-right",
            variant: 'left-accent',
        })
    }
}

export const createRating = async ({ axiosClientJwt, dispatch, navigate, rating, toast, refresh, setRefresh }: CreateRatingParams) => {
    try {
        const { content, product_id, title, stars } = rating;
        dispatch(createRatingStart());
        const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<{}> = await axiosClientJwt.post(`/rate/create`, {
            content,
            product_id,
            title,
            stars
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(createRatingSuccess(res.response.data));
                toast({
                    status: 'success',
                    title: 'Rated successfully!',
                    isClosable: true,
                    position: "top-right"
                })
                setRefresh(!refresh)
            }, 1000)
        } else {
            dispatch(createRatingFailed(null));
        }
    } catch (error: any) {
        dispatch(createRatingFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            toast({
                status: 'warning',
                title: 'You do not have permission to perform this action!',
                isClosable: true,
                position: "top-right",
                variant: 'left-accent',
            })
            setTimeout(function () {
                navigate('/')
            }, 1000);
        } else {
            toast({
                status: 'error',
                title: 'Something went wrong!',
                isClosable: true,
                position: "top-right",
                variant: 'left-accent',
            })
        }
    }
}
