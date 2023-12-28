import {
  getListBrandStart,
  getListBrandSuccess,
  getListBrandFailed,
  deleteBrandStart,
  deleteBrandSuccess,
  deleteBrandFailed,
  getBrandStart,
  getBrandSuccess,
  getBrandFailed,
  createBrandStart,
  createBrandSuccess,
  createBrandFailed,
  updateBrandStart,
  updateBrandSuccess,
  updateBrandFailed,
} from "./brandSlice";
import { Inotification } from "src/common";
import { IAxiosResponse } from "src/types/axiosResponse";

export const getListBrand = async ({
  params,
  dispatch,
  axiosClientJwt,
  navigate,
}: any) => {
  try {
    const { page, limit, filter } = params;
    const accessToken = localStorage.getItem("accessToken");
    dispatch(getListBrandStart());
    const url = page || limit || filter ? `/brand?page=${page}&limit=${limit}&filter=${filter}` : '/brand'
    const res: any = await axiosClientJwt.get(url,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (res?.status === 200 && res?.data && res?.data) {
      setTimeout(function () {
        dispatch(getListBrandSuccess(res.data));
      }, 1000);
    } else {
      dispatch(getListBrandFailed(null));
    }
  } catch (error: any) {
    dispatch(getListBrandFailed(null));
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

export const deleteBrand = async ({
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
    dispatch(deleteBrandStart());
    // const accessToken = localStorage.getItem("accessToken")
    const res: IAxiosResponse<{}> = await axiosClientJwt.delete(
      `/brand/${id}`,
      // , {
      //     headers: {
      //         Authorization: `Bearer ${accessToken}`
      //     }
      // }
    );

    if (res.data.operationResult == "ERROR") {
      dispatch(deleteBrandFailed(res.data.operationMessage));
      setTimeout(function () {
        setIsModalOpen(false);
      }, 300);
      Inotification({
        type: "error",
        message: res.data.operationMessage,
      });
    }

    if (res.data.operationResult == "SUCCESS") {
      dispatch(deleteBrandFailed(res.data.operationMessage));
      setTimeout(function () {
        setIsModalOpen(false);
      }, 300);
      message.success(res.data.operationMessage);
      setIsModalOpen(false);
      setRefresh(!refresh);
    }

    // if (res?.response?.code === 200 && res?.response?.success) {
    //     setTimeout(function () {
    //         dispatch(deleteBrandSuccess(res.response.data))
    //         message.success('Xóa màu thành công!')
    //         setIsModalOpen(false)
    //         setRefresh(!refresh)
    //     }, 1000);
    // } else {
    //     dispatch(deleteBrandFailed(null));
    //     setTimeout(function () {
    //         setIsModalOpen(false)
    //     }, 1000)

    // }
  } catch (error: any) {
    dispatch(deleteBrandFailed(null));
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

export const createBrand = async ({
  brand,
  dispatch,
  axiosClientJwt,
  navigate,
  message,
  setError,
}: any) => {
  try {
    const { brandName, status } = brand;
    dispatch(createBrandStart());
    const accessToken = localStorage.getItem("accessToken")
    const res: IAxiosResponse<{}> = await axiosClientJwt.post(
      `/brand`,
      {
        brandName,
        status: status
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (res?.status === 200 && res?.data) {
      setTimeout(function () {
        dispatch(createBrandSuccess(res.data));
        message.success("Tạo thương hiệu thành công!");
        navigate("/catalog/brands");
      }, 1000);
    }
    // else if (res?.response?.code === 400 && !res?.response?.success) {
    //     dispatch(createBrandFailed(null));
    //     setError(res?.response?.fieldError as keyof FormValuesBrand, { message: res?.response?.message })
    // }
    else {
      dispatch(createBrandFailed(null));
    }
  } catch (error: any) {
    dispatch(createBrandFailed(null));
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

export const getBrand = async ({
  id,
  dispatch,
  axiosClientJwt,
  navigate,
}: any) => {
  try {
    // const accessToken = localStorage.getItem("accessToken")
    dispatch(getBrandStart());
    const res: IAxiosResponse<{}> = await axiosClientJwt.get(
      `/brand/${id}`,
      // , {
      //     headers: {
      //         Authorization: `Bearer ${accessToken}`
      //     }
      // }
    );
    if (res?.status === 200) {
      setTimeout(function () {
        dispatch(getBrandSuccess(res.data));
      }, 1000);
    } else {
      dispatch(getBrandFailed(null));
    }
  } catch (error: any) {
    dispatch(getBrandFailed(null));
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

export const updateBrand = async ({
  brand,
  axiosClientJwt,
  dispatch,
  navigate,
  setError,
  message,
  id,
}: any) => {
  try {
    const { brandName, status } = brand;
    const accessToken = localStorage.getItem("accessToken");
    dispatch(updateBrandStart());
    const [res]: [IAxiosResponse<{}>] = await Promise.all([
      await axiosClientJwt.put(
        `/brand/${id}`,
        {
          brandName,
          status,
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
      ),
    ]);
    if (res?.status === 200 && res?.data) {
      setTimeout(function () {
        dispatch(updateBrandSuccess(res.data));
        message.success("Cập nhật thương hiệu thành công");
        navigate("/catalog/brands");
      }, 1000);
    }

    // else if (res?.response?.code === 400 && !res?.response?.success) {
    //     dispatch(updateBrandFailed(null));
    //     setError(res?.response?.fieldError as keyof FormValuesBrand, { message: res?.response?.message })
    // }
    else {
      dispatch(updateBrandFailed(null));
    }
  } catch (error: any) {
    dispatch(updateBrandFailed(null));
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
