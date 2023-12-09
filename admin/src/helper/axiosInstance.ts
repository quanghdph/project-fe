import axios from 'axios';
import queryString from "query-string";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { IAxiosResponse } from 'src/types/axiosResponse';

export const createAxiosJwt = () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const newInstance = axios.create({
        baseURL: import.meta.env.VITE_BACKEND_URL,
        headers: {
            "content-type": "application/json",
        },
        paramsSerializer: (params) => queryString.stringify(params),
    });
    newInstance.interceptors.request.use(
        async (config) => {
            let date = new Date();
            const decoedToken: JwtPayload = jwtDecode(accessToken || '');
            const axiosClient = createAxiosClient();
            if (decoedToken?.exp && decoedToken?.exp < date.getTime() / 1000) {
                const res: IAxiosResponse<{}> = await axiosClient.post(`${import.meta.env.VITE_BACKEND_URL}/auth/refreshToken`, {}, {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`
                    }
                })
                if (!config?.headers) {
                    throw new Error(`Expected 'config' and 'config.headers' not to be undefined`);
                }
                localStorage.setItem("accessToken", res?.response?.access_token as string)
                localStorage.setItem("refreshToken", res?.response?.refresh_token as string)
                config.headers.Authorization = `Bearer ${res?.response?.access_token}`;
            }
            return config;
        },
        (error: any) => {
            return Promise.reject(error);
        }
    );
    newInstance.interceptors.response.use(
        (response) => {
            if (response && response.data) {
                return response.data;
            }
            return response;
        },
        (error) => {
            throw error;
        }
    );
    return newInstance;
}

export const createAxiosClient = () => {
    const newInstance = axios.create({
        baseURL: import.meta.env.VITE_BACKEND_URL,
        headers: {
            "content-type": "application/json",
        },
        paramsSerializer: (params) => queryString.stringify(params),
    });
    newInstance.interceptors.request.use(
        (config) => {
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    newInstance.interceptors.response.use(
        (response) => {
            if (response && response.data) {
                return response.data;
            }
            return response;
        },
        (error) => {
            throw error;
        }
    );
    return newInstance;
}