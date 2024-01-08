import { AppDispatch } from "src/app/store";
import { loginStart, loginSuccess, loginFailed, logOutSuccess, logOutFailed, logOutStart } from "./authSlice";
import { Inotification } from 'src/common';
import type { Axios, AxiosInstance } from "axios";
import { User } from "src/types/user";
import { IAxiosResponse } from "src/types/axiosResponse";

export const loginUser = async (user: { username: string, password: string }, dispatch: AppDispatch, navigate: Function, setError: Function, axiosClient: Axios) => {
    dispatch(loginStart());
    try {
        const res: IAxiosResponse<User> = await axiosClient.post('api/auth/login', user);
        if (res.status == 200 && res?.data.data) {
            setTimeout(function () {
                dispatch(loginSuccess(res.data.data));
                localStorage.setItem("accessToken", res.data.data.token as string)
                navigate('/');
            }, 1000);
        } else {
            setTimeout(function () {
                dispatch(loginFailed(null));
                // setError(res.response.fieldError, { message: res.response.message })
            }, 1000);
        }
    } catch (error) {
        dispatch(loginFailed(null));
        console.log(error);
        if(error.response.status == 400) {
                 Inotification({
                type: 'error',
                message: error.response.data.meta.message
            })
        }
        // if(error.meta.code == "400 BAD_REQUEST") {
        //     Inotification({
        //         type: 'error',
        //         message: error.meta.message
        //     })
        // }
       
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