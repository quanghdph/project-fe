import {
    getListCustomerStart,
    getListCustomerSuccess,
    getListCustomerFailed,
    deleteCustomerStart,
    deleteCustomerSuccess,
    deleteCustomerFailed,
    getCustomerStart,
    getCustomerSuccess,
    getCustomerFailed,
    createCustomerStart,
    createCustomerSuccess,
    createCustomerFailed,
    updateCustomerStart,
    updateCustomerSuccess,
    updateCustomerFailed,
    getAddressCustomerStart,
    getAddressCustomerSuccess,
    getAddressCustomerFailed
} from "./customerSlice";
import { Inotification } from 'src/common';
import { IAxiosResponse } from "src/types/axiosResponse";
import { User } from "src/types/user";
import { FormValuesCustomer } from "src/components/Customers/create-update";
import { CreateCustomerParams, DeleteCustomerParams, GetCustomerParams, GetListCustomerParams, UpdateCustomerParams } from "./type";

export const getListCustomer = async ({ params, dispatch, axiosClientJwt, navigate }: any) => {
    try {
        const { page, limit, filter } = params;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getListCustomerStart());
        const url = page || limit || filter ? `/customer?page=${page}&limit=${limit}&filter=${filter}` : '/customer'
        const res: IAxiosResponse<User> = await axiosClientJwt.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.status === 200 && res?.data) {
            setTimeout(function () {
                dispatch(getListCustomerSuccess(res.data));
            }, 1000)
        } else {
            dispatch(getListCustomerFailed(null));
        }
    } catch (error: any) {
        dispatch(getListCustomerFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            Inotification({
                type: 'error',
                message: 'Bạn không có quyền để thực hiện hành động này!'
            })
            setTimeout(function () {
                navigate('/')
            }, 1000);
        } else {
            Inotification({
                type: 'error',
                message: 'Something went wrong!'
            })
        }
    }
}

export const deleteCustomer = async ({ id, dispatch, axiosClientJwt, navigate, message, refresh, setIsModalOpen, setRefresh }: DeleteCustomerParams) => {
    try {
        dispatch(deleteCustomerStart());
        const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<User> = await axiosClientJwt.delete(`/user/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(deleteCustomerSuccess(res.response.data))
                message.success('Xóa khách hàng thành công!')
                setIsModalOpen(false)
                setRefresh(!refresh)
            }, 1000);
        } else {
            dispatch(deleteCustomerFailed(null));
            setTimeout(function () {
                setIsModalOpen(false)
            }, 1000)

        }
    } catch (error: any) {
        dispatch(deleteCustomerFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            Inotification({
                type: 'error',
                message: 'Bạn không có quyền để thực hiện hành động này!'
            })
            setTimeout(function () {
                setIsModalOpen(false)
                navigate('/')
            }, 1000);
        } else {
            Inotification({
                type: 'error',
                message: 'Something went wrong!'
            })
        }
    }
}

export const createCustomer = async ({ customer, axiosClientJwt, dispatch, navigate, setError, message }: any) => {
    try {
        const { email, firstName, lastName, dateOfBirth, gender, phoneNumber, encryptedPassword } = customer;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(createCustomerStart());
        const res: IAxiosResponse<User> = await axiosClientJwt.post('/customer', {
            email,
            firstName,
            lastName,
            dateOfBirth,
            gender,
            phoneNumber,
            encryptedPassword
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.status === 200 && res?.data) {
            setTimeout(function () {
                dispatch(createCustomerSuccess(res.data));
                message.success('Tạo khách hàng thành công!');
                navigate("/customers")
            }, 1000)
        } else if (res?.status === 400 && !res?.data) {
            dispatch(createCustomerFailed(null));
            setError(res?.response?.fieldError as keyof FormValuesCustomer, { message: res?.response?.message })
        } else {
            dispatch(createCustomerFailed(null));
        }
    } catch (error: any) {
        dispatch(createCustomerFailed(null));
        Inotification({
            type: 'error',
            message: 'Something went wrong!'
        })
    }
}

export const getCustomer = async ({ id, dispatch, axiosClientJwt, navigate }: GetCustomerParams) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getCustomerStart());
        const res: IAxiosResponse<User> = await axiosClientJwt.get(`/customer/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.status === 200 && res?.data) {
            setTimeout(function () {
                dispatch(getCustomerSuccess(res.data));
            }, 1000)
        } else {
            dispatch(getCustomerFailed(null));
        }
    } catch (error: any) {
        dispatch(getCustomerFailed(null));
        Inotification({
            type: 'error',
            message: 'Something went wrong!'
        })
    }
}

export const updateCustomer = async ({ customer, axiosClientJwt, dispatch, navigate, setError, message, id }: any) => {
    try {
        const { email, firstName, lastName, dateOfBirth, gender, phoneNumber, encryptedPassword } = customer;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(updateCustomerStart());
        const [res]: [IAxiosResponse<User>] = await Promise.all([
            await axiosClientJwt.put(`customer/${id}`, {
                email,
                firstName,
                lastName,
                dateOfBirth,
                gender,
                phoneNumber,
                encryptedPassword
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }),
        ])
        if (res?.status === 200 && res?.data) {
            setTimeout(function () {
                dispatch(updateCustomerSuccess(res.data));
                message.success('Cập nhật khách hàng thành công!');
                navigate("/customers")
            }, 1000)
        } else if (res?.status === 400 && !res?.data) {
            dispatch(updateCustomerFailed(null));
            setError(res?.response?.fieldError as keyof Omit<FormValuesCustomer, "password">, { message: res?.response?.message })
        } else {
            dispatch(updateCustomerFailed(null));
        }
    } catch (error: any) {
        dispatch(updateCustomerFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            Inotification({
                type: 'error',
                message: 'Bạn không có quyền để thực hiện hành động này!'
            })
            setTimeout(function () {
                navigate('/')
            }, 1000);
        } else {
            Inotification({
                type: 'error',
                message: 'Something went wrong!'
            })
        }
    }
}

export const getListSearchCustomer = async ({
    params,
    dispatch,
    axiosClientJwt,
    navigate,
  }: any) => {
    try {
      const { value } = params;
      const accessToken = localStorage.getItem("accessToken");
      dispatch(getListCustomerStart());
      const res: any = await axiosClientJwt.get(
        `/customer/search?customerName=${value}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res?.status === 200 && res?.data) {
        setTimeout(function () {
          dispatch(getListCustomerSuccess(res.data));
        }, 1000);
      } else {
        dispatch(getListCustomerFailed(null));
      }
    } catch (error: any) {
      dispatch(getListCustomerFailed(null));
      Inotification({
        type: "error",
        message: "Something went wrong!",
      });
    }
  };

export const getListSearchPhoneNumberCustomer = async ({
    params,
    dispatch,
    axiosClientJwt,
    navigate,
  }: any) => {
    try {
      const { value } = params;
      const accessToken = localStorage.getItem("accessToken");
      dispatch(getListCustomerStart());
      const res: any = await axiosClientJwt.get(
        `/customer/phone-number?phoneNumber=${value}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res?.status === 200 && res?.data) {
        setTimeout(function () {
          dispatch(getListCustomerSuccess(res.data));
        }, 1000);
      } else {
        dispatch(getListCustomerFailed(null));
      }
    } catch (error: any) {
      dispatch(getListCustomerFailed(null));
      Inotification({
        type: "error",
        message: "Something went wrong!",
      });
    }
};

export const getListAddressCustomer = async ({ params, dispatch, axiosClientJwt, navigate }: any) => {
    try {
        const { page, limit, filter } = params;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getAddressCustomerStart());
        const url = page || limit || filter ? `/address?page=${page}&limit=${limit}&filter=${filter}` : '/address'
        const res: IAxiosResponse<User> = await axiosClientJwt.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.status === 200 && res?.data) {
            setTimeout(function () {
                dispatch(getAddressCustomerSuccess(res.data));
            }, 1000)
        } else {
            dispatch(getAddressCustomerFailed(null));
        }
    } catch (error: any) {
        dispatch(getAddressCustomerFailed(null));
        // if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
        //     Inotification({
        //         type: 'error',
        //         message: 'Bạn không có quyền để thực hiện hành động này!'
        //     })
        //     setTimeout(function () {
        //         navigate('/')
        //     }, 1000);
        // } else {
        //     Inotification({
        //         type: 'error',
        //         message: 'Something went wrong!'
        //     })
        // }
        Inotification({
            type: "error",
            message: error.response.data,
          });
    }
}


export const createCustomerFast = async ({ customer, axiosClientJwt, dispatch, navigate, setError, message }: any) => {
    try {
        const { email, firstName, lastName, gender, phoneNumber } = customer;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(createCustomerStart());
        const res: IAxiosResponse<User> = await axiosClientJwt.post('/customer/fast', {
            email,
            firstName,
            lastName,
            gender,
            phoneNumber,
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.status === 200 && res?.data) {
            setTimeout(function () {
                dispatch(createCustomerSuccess(res.data));
                message.success('Tạo khách hàng thành công!');
            }, 1000)
        } else if (res?.status === 400 && !res?.data) {
            dispatch(createCustomerFailed(null));
            setError(res?.response?.fieldError as keyof FormValuesCustomer, { message: res?.response?.message })
        } else {
            dispatch(createCustomerFailed(null));
        }
    } catch (error: any) {
        dispatch(createCustomerFailed(null));
        Inotification({
            type: 'error',
            message: 'Something went wrong!'
        })
    }
}