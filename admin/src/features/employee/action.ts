import {
    getListEmployeeStart,
    getListEmployeeSuccess,
    getListEmployeeFailed,
    deleteEmployeeStart,
    deleteEmployeeSuccess,
    deleteEmployeeFailed,
    getEmployeeStart,
    getEmployeeSuccess,
    getEmployeeFailed,
    createEmployeeStart,
    createEmployeeSuccess,
    createEmployeeFailed,
    updateEmployeeStart,
    updateEmployeeSuccess,
    updateEmployeeFailed,
} from "./employeeSlice";
import { Inotification } from "src/common";
import { IAxiosResponse } from "src/types/axiosResponse";

export const getListEmployee = async ({ params, dispatch, axiosClientJwt, navigate }: any) => {
    try {
        const {page, limit, filter} = params
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getListEmployeeStart());
        const res: any = await axiosClientJwt.get(`/employee?page=${page}&limit=${limit}&filter=${filter}`
        // , {
        //     params: {
        //         take,
        //         skip,
        //         search,
        //         status
        //     },
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`
        //     }
        // }
        );
        
        if (res?.status === 200 && res?.data && res?.data.listEmployees) {
            setTimeout(function () {
                dispatch(getListEmployeeSuccess(res.data));
            }, 1000)
        } else {
            dispatch(getListEmployeeFailed(null));
        }
    } catch (error: any) {
        dispatch(getListEmployeeFailed(null));
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

export const deleteEmployee = async ({ id, dispatch, axiosClientJwt, navigate, message, refresh, setIsModalOpen, setRefresh }: any) => {
    try {
        dispatch(deleteEmployeeStart());
        // const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<{}> = await axiosClientJwt.delete(`/employee/${id}`
        // , {
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`
        //     }
        // }
        );

        if(res.data.operationResult == "ERROR") {
            dispatch(deleteEmployeeFailed(res.data.operationMessage));
                setTimeout(function () {
                setIsModalOpen(false)
            }, 300)
            Inotification({
                type: 'error',
                message: res.data.operationMessage
            })
        }

        if(res.data.operationResult == "SUCCESS") {
            dispatch(deleteEmployeeFailed(res.data.operationMessage));
                setTimeout(function () {
                setIsModalOpen(false)
            }, 300)
            message.success(res.data.operationMessage);
            setIsModalOpen(false)
            setRefresh(!refresh)
        }


        // if (res?.response?.code === 200 && res?.response?.success) {
        //     setTimeout(function () {
        //         dispatch(deleteEmployeeSuccess(res.response.data))
        //         message.success('Xóa màu thành công!')
        //         setIsModalOpen(false)
        //         setRefresh(!refresh)
        //     }, 1000);
        // } else {
        //     dispatch(deleteEmployeeFailed(null));
        //     setTimeout(function () {
        //         setIsModalOpen(false)
        //     }, 1000)

        // }
    } catch (error: any) {
        dispatch(deleteEmployeeFailed(null));
        // if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
        //     Inotification({
        //         type: 'error',
        //         message: 'Bạn không có quyền để thực hiện hành động này!'
        //     })
        //     setTimeout(function () {
        //         setIsModalOpen(false)
        //         navigate('/')
        //     }, 1000);
        // } else {
        //     Inotification({
        //         type: 'error',
        //         message: 'Something went wrong!'
        //     })
        // }
        Inotification({
                type: 'error',
                message: 'Something went wrong!'
        })
    }
}

export const createEmployee = async ({ employee, dispatch, axiosClientJwt, navigate, message, setError }: any) => {
    try {
        const { employeeName, employeeCode } = employee
        dispatch(createEmployeeStart());
        // const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<{}> = await axiosClientJwt.post(`/employee`, {
            employeeName,
            employeeCode,
        }
        // , {
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`
        //     }
        // }
        );
        if (res?.status === 200 && res?.data) {
            setTimeout(function () {
                dispatch(createEmployeeSuccess(res.data));
                message.success('Tạo kích thước thành công!');
                navigate("/catalog/employees")
            }, 1000);
        }
        // else if (res?.response?.code === 400 && !res?.response?.success) {
        //     dispatch(createEmployeeFailed(null));
        //     setError(res?.response?.fieldError as keyof FormValuesEmployee, { message: res?.response?.message })
        // } 
        else {
            dispatch(createEmployeeFailed(null));
        }
    } catch (error: any) {
        dispatch(createEmployeeFailed(null));
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
            type: 'error',
            message: 'Something went wrong!'
        })
    }
}

export const getEmployee= async ({ id, dispatch, axiosClientJwt, navigate }: any) => {
    try {
        // const accessToken = localStorage.getItem("accessToken")
        dispatch(getEmployeeStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.get(`/employee/${id}`
        // , {
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`
        //     }
        // }
        );
        if (res?.status === 200) {
            setTimeout(function () {
                dispatch(getEmployeeSuccess(res.data));
            }, 1000)
        } else {
            dispatch(getEmployeeFailed(null));
        }
    } catch (error: any) {
        dispatch(getEmployeeFailed(null));
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
            type: 'error',
            message: 'Something went wrong!'
        })
    }
}

export const updateEmployee = async ({ employee, axiosClientJwt, dispatch, navigate, setError, message, id }: any) => {
    try {
        const { employeeName, employeeCode } = employee
        const accessToken = localStorage.getItem("accessToken")
        dispatch(updateEmployeeStart());
        const [res]: [IAxiosResponse<{}>] = await Promise.all([
            await axiosClientJwt.put(`/employee/${id}`, {
                employeeName,
                employeeCode,
            }
            // , {
            //     headers: {
            //         Authorization: `Bearer ${accessToken}`
            //     }
            // }
            ),
        ])
        if (res?.status === 200 && res?.data) {
            setTimeout(function () {
                dispatch(updateEmployeeSuccess(res.data));
                message.success('Cập nhật kích thước thành công');
                navigate("/catalog/employees")
            }, 1000)
        }
        
        // else if (res?.response?.code === 400 && !res?.response?.success) {
        //     dispatch(updateEmployeeFailed(null));
        //     setError(res?.response?.fieldError as keyof FormValuesEmployee, { message: res?.response?.message })
        // } 
        
        else {
            dispatch(updateEmployeeFailed(null));
        }
    } catch (error: any) {
        dispatch(updateEmployeeFailed(null));
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
            type: 'error',
            message: 'Something went wrong!'
        })
    }
}
