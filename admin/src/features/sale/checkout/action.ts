import {
  getListCheckoutStart,
  getListCheckoutSuccess,
  getListCheckoutFailed,
  deleteCheckoutStart,
  deleteCheckoutSuccess,
  deleteCheckoutFailed,
  getCheckoutStart,
  getCheckoutSuccess,
  getCheckoutFailed,
  createCheckoutStart,
  createCheckoutSuccess,
  createCheckoutFailed,
  updateCheckoutStart,
  updateCheckoutSuccess,
  updateCheckoutFailed,
  getCreateCheckoutStart,
  getCreateCheckoutFailed,
  getCreateCheckoutSuccess,
} from "./checkoutSlice";
import { Inotification } from "src/common";
import { IAxiosResponse } from "src/types/axiosResponse";

// export const getListCheckout = async ({
//   params,
//   dispatch,
//   axiosClientJwt,
//   navigate,
// }: any) => {
//   try {
//     const { page, limit, filter, status } = params;
//     const accessToken = localStorage.getItem("accessToken");
//     dispatch(getListCheckoutStart());
//     const url =
//       page || limit || filter
//         ? `/checkout?page=${page}&limit=${limit}&search=${filter}&status=${status}`
//         : "/checkout";
//     const res: any = await axiosClientJwt.get(url, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     if (res?.status === 200 && res?.data && res?.data) {
//       setTimeout(function () {
//         dispatch(getListCheckoutSuccess(res.data));
//       }, 1000);
//     } else {
//       dispatch(getListCheckoutFailed(null));
//     }
//   } catch (error: any) {
//     dispatch(getListCheckoutFailed(null));
//     if (
//       error?.response?.status === 403 &&
//       error?.response?.statusText === "Forbidden"
//     ) {
//       Inotification({
//         type: "error",
//         message: "Bạn không có quyền để thực hiện hành động này!",
//       });
//       setTimeout(function () {
//         navigate("/");
//       }, 1000);
//     } else {
//       Inotification({
//         type: "error",
//         message: "Something went wrong!",
//       });
//     }
//   }
// };

// export const deleteCheckout = async ({
//   id,
//   dispatch,
//   axiosClientJwt,
//   navigate,
//   message,
//   refresh,
//   setIsModalOpen,
//   setRefresh,
// }: any) => {
//   try {
//     dispatch(deleteCheckoutStart());
//     // const accessToken = localStorage.getItem("accessToken")
//     const res: IAxiosResponse<{}> = await axiosClientJwt.delete(
//       `/checkout/${id}`,
//       // , {
//       //     headers: {
//       //         Authorization: `Bearer ${accessToken}`
//       //     }
//       // }
//     );

//     if (res.data.operationResult == "ERROR") {
//       dispatch(deleteCheckoutFailed(res.data.operationMessage));
//       setTimeout(function () {
//         setIsModalOpen(false);
//       }, 300);
//       Inotification({
//         type: "error",
//         message: res.data.operationMessage,
//       });
//     }

//     if (res.data.operationResult == "SUCCESS") {
//       dispatch(deleteCheckoutFailed(res.data.operationMessage));
//       setTimeout(function () {
//         setIsModalOpen(false);
//       }, 300);
//       message.success(res.data.operationMessage);
//       setIsModalOpen(false);
//       setRefresh(!refresh);
//     }

//     // if (res?.response?.code === 200 && res?.response?.success) {
//     //     setTimeout(function () {
//     //         dispatch(deleteCheckoutSuccess(res.response.data))
//     //         message.success('Xóa màu thành công!')
//     //         setIsModalOpen(false)
//     //         setRefresh(!refresh)
//     //     }, 1000);
//     // } else {
//     //     dispatch(deleteCheckoutFailed(null));
//     //     setTimeout(function () {
//     //         setIsModalOpen(false)
//     //     }, 1000)

//     // }
//   } catch (error: any) {
//     dispatch(deleteCheckoutFailed(null));
//     // if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
//     //     Inotification({
//     //         type: 'error',
//     //         message: 'Bạn không có quyền để thực hiện hành động này!'
//     //     })
//     //     setTimeout(function () {
//     //         setIsModalOpen(false)
//     //         navigate('/')
//     //     }, 1000);
//     // } else {
//     //     Inotification({
//     //         type: 'error',
//     //         message: 'Something went wrong!'
//     //     })
//     // }
//     Inotification({
//       type: "error",
//       message: "Something went wrong!",
//     });
//   }
// };

// export const createCheckout = async ({
//   checkout,
//   dispatch,
//   axiosClientJwt,
//   navigate,
//   message,
//   setError,
// }: any) => {
//   try {
//     const {
//       customer,
//       employee,
//       address,
//       phoneNumber,
//       transportFee,
//       note,
//       status,
//     } = checkout;
//     dispatch(createCheckoutStart());
//     const accessToken = localStorage.getItem("accessToken");
//     const res: IAxiosResponse<{}> = await axiosClientJwt.post(
//       `/checkout`,
//       {
//         customer,
//         employee,
//         address,
//         phoneNumber,
//         transportFee,
//         note,
//         status,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       },
//     );
//     if (res?.status === 200 && res?.data) {
//       setTimeout(function () {
//         dispatch(createCheckoutSuccess(res.data));
//         message.success("Tạo hóa đơn thành công!");
//         navigate("/checkouts");
//       }, 1000);
//     }
//     // else if (res?.response?.code === 400 && !res?.response?.success) {
//     //     dispatch(createCheckoutFailed(null));
//     //     setError(res?.response?.fieldError as keyof FormValuesCheckout, { message: res?.response?.message })
//     // }
//     else {
//       dispatch(createCheckoutFailed(null));
//     }
//   } catch (error: any) {
//     dispatch(createCheckoutFailed(null));
//     // if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
//     //     Inotification({
//     //         type: 'error',
//     //         message: 'Bạn không có quyền để thực hiện hành động này!'
//     //     })
//     //     setTimeout(function () {
//     //         navigate('/')
//     //     }, 1000);
//     // } else {
//     //     Inotification({
//     //         type: 'error',
//     //         message: 'Something went wrong!'
//     //     })
//     // }
//     Inotification({
//       type: "error",
//       message: "Something went wrong!",
//     });
//   }
// };

// export const getCheckout = async ({
//   id,
//   dispatch,
//   axiosClientJwt,
//   navigate,
// }: any) => {
//   try {
//     // const accessToken = localStorage.getItem("accessToken")
//     dispatch(getCheckoutStart());
//     const res: IAxiosResponse<{}> = await axiosClientJwt.get(
//       `/checkout/${id}`,
//       // , {
//       //     headers: {
//       //         Authorization: `Bearer ${accessToken}`
//       //     }
//       // }
//     );
//     if (res?.status === 200) {
//       setTimeout(function () {
//         dispatch(getCheckoutSuccess(res.data));
//       }, 1000);
//     } else {
//       dispatch(getCheckoutFailed(null));
//     }
//   } catch (error: any) {
//     dispatch(getCheckoutFailed(null));
//     // if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
//     //     Inotification({
//     //         type: 'error',
//     //         message: 'Bạn không có quyền để thực hiện hành động này!'
//     //     })
//     //     setTimeout(function () {
//     //         navigate('/')
//     //     }, 1000);
//     // } else {
//     //     Inotification({
//     //         type: 'error',
//     //         message: 'Something went wrong!'
//     //     })
//     // }
//     Inotification({
//       type: "error",
//       message: "Something went wrong!",
//     });
//   }
// };

// export const updateCheckout = async ({
//   checkout,
//   axiosClientJwt,
//   dispatch,
//   navigate,
//   setError,
//   message,
//   id,
// }: any) => {
//   try {
//     const {
//       customer,
//       employee,
//       address,
//       phoneNumber,
//       transportFee,
//       note,
//       status,
//     } = checkout;
//     const accessToken = localStorage.getItem("accessToken");
//     dispatch(updateCheckoutStart());
//     const [res]: [IAxiosResponse<{}>] = await Promise.all([
//       await axiosClientJwt.put(
//         `/checkout/${id}`,
//         {
//           customer,
//           employee,
//           address,
//           phoneNumber,
//           transportFee,
//           note,
//           status,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         },
//       ),
//     ]);
//     if (res?.status === 200 && res?.data) {
//       setTimeout(function () {
//         dispatch(updateCheckoutSuccess(res.data));
//         message.success("Cập nhật danh mục thành công");
//         navigate("/sales/checkouts");
//       }, 1000);
//     }

//     // else if (res?.response?.code === 400 && !res?.response?.success) {
//     //     dispatch(updateCheckoutFailed(null));
//     //     setError(res?.response?.fieldError as keyof FormValuesCheckout, { message: res?.response?.message })
//     // }
//     else {
//       dispatch(updateCheckoutFailed(null));
//     }
//   } catch (error: any) {
//     dispatch(updateCheckoutFailed(null));
//     // if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
//     //     Inotification({
//     //         type: 'error',
//     //         message: 'Bạn không có quyền để thực hiện hành động này!'
//     //     })
//     //     setTimeout(function () {
//     //         navigate('/')
//     //     }, 1000);
//     // } else {
//     //     Inotification({
//     //         type: 'error',
//     //         message: 'Something went wrong!'
//     //     })
//     // }
//     Inotification({
//       type: "error",
//       message: "Something went wrong!",
//     });
//   }
// };


export const createCheckout = async ({
  billID,
  dispatch,
  axiosClientJwt,
  navigate,
  message,
  setError,
}: any) => {
  try {
  
    dispatch(getCreateCheckoutStart());
    const accessToken = localStorage.getItem("accessToken");
    const res: IAxiosResponse<{}> = await axiosClientJwt.get(
      `/api-vnp/vnpay/${billID}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (res?.status === 200 && res?.data) {
      setTimeout(function () {
        dispatch(getCreateCheckoutSuccess(res.data));
        window.open(`${res?.data}`)
      }, 1000);
    }
    // else if (res?.response?.code === 400 && !res?.response?.success) {
    //     dispatch(createCheckoutFailed(null));
    //     setError(res?.response?.fieldError as keyof FormValuesCheckout, { message: res?.response?.message })
    // }
    else {
      dispatch(getCreateCheckoutFailed(null));
    }
  } catch (error: any) {
    dispatch(getCreateCheckoutFailed(null));
    Inotification({
      type: "error",
      message: "Lỗi thanh toán!",
    });
  }
};