import { AppDispatch } from "src/app/store";
import { loginStart, loginSuccess, loginFailed, logOutSuccess, logOutFailed, logOutStart } from "./authSlice";
import { Inotification } from 'src/common';
import type { Axios, AxiosInstance } from "axios";
import { User } from "src/types/user";
import { IAxiosResponse } from "src/types/axiosResponse";

export const loginUser = async (user: { email: string, password: string }, dispatch: AppDispatch, navigate: Function, setError: Function, axiosClient: Axios) => {
    dispatch(loginStart());
    try {
        const res: IAxiosResponse<User> = await axiosClient.post('auth/login', user);
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(loginSuccess(res.response.data));
                localStorage.setItem("accessToken", res.response.access_token as string)
                localStorage.setItem("refreshToken", res.response.refresh_token as string)
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
        Inotification({
            type: 'error',
            message: 'Something went wrong!'
        })
    }
}

export const logOut = async (dispatch: AppDispatch, navigate: Function, axiosClientJwt: AxiosInstance) => {
    dispatch(logOutStart());
    try {
        const accessToken = localStorage.getItem("accessToken");
        await axiosClientJwt.get('auth/logout', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        dispatch(logOutSuccess());
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        navigate('/login');
    } catch (error) {
        dispatch(logOutFailed());
        Inotification({
            type: 'error',
            message: 'Something went wrong!'
        })
    }
}