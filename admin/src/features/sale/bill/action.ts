import {
  getListBillStart,
  getListBillSuccess,
  getListBillFailed,
  deleteBillStart,
  deleteBillSuccess,
  deleteBillFailed,
  getBillStart,
  getBillSuccess,
  getBillFailed,
  createBillStart,
  createBillSuccess,
  createBillFailed,
  updateBillStart,
  updateBillSuccess,
  updateBillFailed,
} from "./billSlice";
import { Inotification } from "src/common";
import { IAxiosResponse } from "src/types/axiosResponse";

export const getListBill = async ({
  params,
  dispatch,
  axiosClientJwt,
  navigate,
}: any) => {
  try {
    const { page, limit, filter } = params;
    const accessToken = localStorage.getItem("accessToken");
    dispatch(getListBillStart());
    const url =
      page || limit || filter
        ? `/bill?page=${page}&limit=${limit}&filter=${filter}`
        : "/bill";
    const res: any = await axiosClientJwt.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res?.status === 200 && res?.data && res?.data) {
      setTimeout(function () {
        dispatch(getListBillSuccess(res.data));
      }, 1000);
    } else {
      dispatch(getListBillFailed(null));
    }
  } catch (error: any) {
    dispatch(getListBillFailed(null));
    if (
      error?.response?.status === 403 &&
      error?.response?.statusText === "Forbidden"
    ) {
      Inotification({
        type: "error",
        message: "Bạn không có quyền để thực hiện hành động này!",
      });
      setTimeout(function () {
        navigate("/");
      }, 1000);
    } else {
      Inotification({
        type: "error",
        message: "Something went wrong!",
      });
    }
  }
};

export const deleteBill = async ({
  id,
  dispatch,
  axiosClientJwt,
  navigate,
  message,
  refresh,
  setIsModalOpen,
  setRefresh,
}: any) => {
  try {
    dispatch(deleteBillStart());
    // const accessToken = localStorage.getItem("accessToken")
    const res: IAxiosResponse<{}> = await axiosClientJwt.delete(
      `/bill/${id}`,
      // , {
      //     headers: {
      //         Authorization: `Bearer ${accessToken}`
      //     }
      // }
    );

    if (res.data.operationResult == "ERROR") {
      dispatch(deleteBillFailed(res.data.operationMessage));
      setTimeout(function () {
        setIsModalOpen(false);
      }, 300);
      Inotification({
        type: "error",
        message: res.data.operationMessage,
      });
    }

    if (res.data.operationResult == "SUCCESS") {
      dispatch(deleteBillFailed(res.data.operationMessage));
      setTimeout(function () {
        setIsModalOpen(false);
      }, 300);
      message.success(res.data.operationMessage);
      setIsModalOpen(false);
      setRefresh(!refresh);
    }

    // if (res?.response?.code === 200 && res?.response?.success) {
    //     setTimeout(function () {
    //         dispatch(deleteBillSuccess(res.response.data))
    //         message.success('Xóa màu thành công!')
    //         setIsModalOpen(false)
    //         setRefresh(!refresh)
    //     }, 1000);
    // } else {
    //     dispatch(deleteBillFailed(null));
    //     setTimeout(function () {
    //         setIsModalOpen(false)
    //     }, 1000)

    // }
  } catch (error: any) {
    dispatch(deleteBillFailed(null));
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
      type: "error",
      message: "Something went wrong!",
    });
  }
};

export const createBill = async ({
  bill,
  dispatch,
  axiosClientJwt,
  navigate,
  message,
  setError,
}: any) => {
  try {
    const {
      customer,
      employee,
      address,
      phoneNumber,
      transportFee,
      note,
      status,
    } = bill;
    dispatch(createBillStart());
    const accessToken = localStorage.getItem("accessToken");
    const res: IAxiosResponse<{}> = await axiosClientJwt.post(
      `/bill`,
      {
        customer,
        employee,
        address,
        phoneNumber,
        transportFee,
        note,
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (res?.status === 200 && res?.data) {
      setTimeout(function () {
        dispatch(createBillSuccess(res.data));
        message.success("Tạo hóa đơn thành công!");
        navigate("/bills");
      }, 1000);
    }
    // else if (res?.response?.code === 400 && !res?.response?.success) {
    //     dispatch(createBillFailed(null));
    //     setError(res?.response?.fieldError as keyof FormValuesBill, { message: res?.response?.message })
    // }
    else {
      dispatch(createBillFailed(null));
    }
  } catch (error: any) {
    dispatch(createBillFailed(null));
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
      message: "Something went wrong!",
    });
  }
};

export const getBill = async ({
  id,
  dispatch,
  axiosClientJwt,
  navigate,
}: any) => {
  try {
    // const accessToken = localStorage.getItem("accessToken")
    dispatch(getBillStart());
    const res: IAxiosResponse<{}> = await axiosClientJwt.get(
      `/bill/${id}`,
      // , {
      //     headers: {
      //         Authorization: `Bearer ${accessToken}`
      //     }
      // }
    );
    if (res?.status === 200) {
      setTimeout(function () {
        dispatch(getBillSuccess(res.data));
      }, 1000);
    } else {
      dispatch(getBillFailed(null));
    }
  } catch (error: any) {
    dispatch(getBillFailed(null));
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
      message: "Something went wrong!",
    });
  }
};

export const updateBill = async ({
  bill,
  axiosClientJwt,
  dispatch,
  navigate,
  setError,
  message,
  id,
}: any) => {
  try {
    const {
      customer,
      employee,
      address,
      phoneNumber,
      transportFee,
      note,
      status,
    } = bill;
    const accessToken = localStorage.getItem("accessToken");
    dispatch(updateBillStart());
    const [res]: [IAxiosResponse<{}>] = await Promise.all([
      await axiosClientJwt.put(
        `/bill/${id}`,
        {
          customer,
          employee,
          address,
          phoneNumber,
          transportFee,
          note,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    ]);
    if (res?.status === 200 && res?.data) {
      setTimeout(function () {
        dispatch(updateBillSuccess(res.data));
        message.success("Cập nhật danh mục thành công");
        navigate("/sales/bills");
      }, 1000);
    }

    // else if (res?.response?.code === 400 && !res?.response?.success) {
    //     dispatch(updateBillFailed(null));
    //     setError(res?.response?.fieldError as keyof FormValuesBill, { message: res?.response?.message })
    // }
    else {
      dispatch(updateBillFailed(null));
    }
  } catch (error: any) {
    dispatch(updateBillFailed(null));
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
      message: "Something went wrong!",
    });
  }
};
