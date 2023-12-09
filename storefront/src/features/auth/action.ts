import { AppDispatch } from "src/app/store";
import {
    loginStart,
    loginSuccess,
    loginFailed,
    logOutSuccess,
    logOutFailed,
    logOutStart,
    registerStart,
    registerSuccess,
    registerFailed,
    meStart,
    meSuccess,
    meFailed
} from "./authSlice";
import type { Axios, AxiosInstance } from "axios";
import { IAxiosResponse } from "src/shared/types/axiosResponse";
import { CreateToastFnReturn } from "@chakra-ui/react";

interface GetMeParams {
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    toast: CreateToastFnReturn
}

export const loginUser = async (user: { email: string, password: string }, dispatch: AppDispatch, navigate: Function, setError: Function, axiosClient: Axios, toast: CreateToastFnReturn) => {
    try {
        dispatch(loginStart());
        const res: IAxiosResponse<{}> = await axiosClient.post('auth/login', user);
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(loginSuccess(res.response.data));
                localStorage.setItem("accessToken", res.response.access_token as string)
                localStorage.setItem("refreshToken", res.response.refresh_token as string)
                toast({
                    status: 'success',
                    title: "Logged in successfully!",
                    position: "top-right",
                    isClosable: true,
                })
                navigate('/');
            }, 1000);
        } else if (res?.response?.code === 400 && !res?.response?.success) {
            setTimeout(function () {
                dispatch(loginFailed(null));
                setError(res.response.fieldError, { message: res.response.message })
            }, 1000);
        }
    } catch (error) {
        dispatch(loginFailed(null));
        toast({
            status: 'error',
            title: "Something went wrong!",
            isClosable: true,
        })
    }
}

export const logOut = async (dispatch: AppDispatch, navigate: Function, axiosClientJwt: AxiosInstance, toast: CreateToastFnReturn) => {
    try {
        dispatch(logOutStart());
        const accessToken = localStorage.getItem("accessToken");
        await axiosClientJwt.get('auth/logout', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        dispatch(logOutSuccess());
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        navigate('/');
    } catch (error) {
        dispatch(logOutFailed());
        toast({
            status: 'error',
            title: "Something went wrong!",
            isClosable: true,
        })
    }
}

export const registeUser = async (user: { email: string, password: string, first_name: string, last_name: string }, dispatch: AppDispatch, navigate: Function, setError: Function, axiosClient: Axios, toast: CreateToastFnReturn) => {
    try {
        dispatch(registerStart());
        const res: IAxiosResponse<{}> = await axiosClient.post('auth/customer/register', user);
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(registerSuccess(res.response.data));
                localStorage.setItem("accessToken", res.response.access_token as string)
                localStorage.setItem("refreshToken", res.response.refresh_token as string)
                toast({
                    status: 'success',
                    title: "Register customer successfully!",
                    variant: 'left-accent',
                    isClosable: true,
                })
                navigate('/');
            }, 1000);
        } else if (res?.response?.code === 400 && !res?.response?.success) {
            setTimeout(function () {
                dispatch(registerFailed(null));
                setError(res.response.fieldError, { message: res.response.message })
            }, 1000);
        }
    } catch (error) {
        dispatch(registerFailed(null));
        toast({
            status: 'error',
            title: "Something went wrong!",
            isClosable: true,
        })
    }
}

export const getMe = async ({ axiosClientJwt, dispatch, toast }: GetMeParams) => {
    try {
        dispatch(meStart());
        const accessToken = localStorage.getItem("accessToken");
        const res: IAxiosResponse<{}> = await axiosClientJwt.get('auth/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        if (res?.response?.code === 200 && res?.response?.success) {
            dispatch(meSuccess(res.response.data));
        } else {
            dispatch(meFailed(null));
        }
    } catch (error) {
        dispatch(meFailed(null));
        toast({
            status: 'error',
            title: "Something went wrong!",
            isClosable: true,
        })
    }
}
