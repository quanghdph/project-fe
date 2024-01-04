import {
  getListCategoryStart,
  getListCategorySuccess,
  getListCategoryFailed,
  deleteCategoryStart,
  deleteCategorySuccess,
  deleteCategoryFailed,
  getCategoryStart,
  getCategorySuccess,
  getCategoryFailed,
  createCategoryStart,
  createCategorySuccess,
  createCategoryFailed,
  updateCategoryStart,
  updateCategorySuccess,
  updateCategoryFailed,
} from "./categorySlice";
import { Inotification } from "src/common";
import { IAxiosResponse } from "src/types/axiosResponse";

export const getListCategory = async ({
  params,
  dispatch,
  axiosClientJwt,
  navigate,
}: any) => {
  try {
    const { page, limit, filter } = params;
    const accessToken = localStorage.getItem("accessToken");
    dispatch(getListCategoryStart());
    const url = page || limit || filter ? `/category?page=${page}&limit=${limit}&filter=${filter}` : '/category'
    const res: any = await axiosClientJwt.get(url,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (res?.status === 200 && res?.data && res?.data) {
      setTimeout(function () {
        dispatch(getListCategorySuccess(res.data));
      }, 1000);
    } else {
      dispatch(getListCategoryFailed(null));
    }
  } catch (error: any) {
    dispatch(getListCategoryFailed(null));
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

export const deleteCategory = async ({
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
    dispatch(deleteCategoryStart());
    // const accessToken = localStorage.getItem("accessToken")
    const res: IAxiosResponse<{}> = await axiosClientJwt.delete(
      `/category/${id}`,
      // , {
      //     headers: {
      //         Authorization: `Bearer ${accessToken}`
      //     }
      // }
    );

    if (res.data.operationResult == "ERROR") {
      dispatch(deleteCategoryFailed(res.data.operationMessage));
      setTimeout(function () {
        setIsModalOpen(false);
      }, 300);
      Inotification({
        type: "error",
        message: res.data.operationMessage,
      });
    }

    if (res.data.operationResult == "SUCCESS") {
      dispatch(deleteCategoryFailed(res.data.operationMessage));
      setTimeout(function () {
        setIsModalOpen(false);
      }, 300);
      message.success(res.data.operationMessage);
      setIsModalOpen(false);
      setRefresh(!refresh);
    }

    // if (res?.response?.code === 200 && res?.response?.success) {
    //     setTimeout(function () {
    //         dispatch(deleteCategorySuccess(res.response.data))
    //         message.success('Xóa màu thành công!')
    //         setIsModalOpen(false)
    //         setRefresh(!refresh)
    //     }, 1000);
    // } else {
    //     dispatch(deleteCategoryFailed(null));
    //     setTimeout(function () {
    //         setIsModalOpen(false)
    //     }, 1000)

    // }
  } catch (error: any) {
    dispatch(deleteCategoryFailed(null));
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

export const createCategory = async ({
  category,
  dispatch,
  axiosClientJwt,
  navigate,
  message,
  setError,
}: any) => {
  try {
    const { categoryName, status } = category;
    dispatch(createCategoryStart());
    const accessToken = localStorage.getItem("accessToken")
    const res: IAxiosResponse<{}> = await axiosClientJwt.post(
      `/category`,
      {
        categoryName,
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
        dispatch(createCategorySuccess(res.data));
        message.success("Tạo danh mục thành công!");
        navigate("/catalog/categories");
      }, 1000);
    }
    // else if (res?.response?.code === 400 && !res?.response?.success) {
    //     dispatch(createCategoryFailed(null));
    //     setError(res?.response?.fieldError as keyof FormValuesCategory, { message: res?.response?.message })
    // }
    else {
      dispatch(createCategoryFailed(null));
    }
  } catch (error: any) {
    dispatch(createCategoryFailed(null));
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

export const getCategory = async ({
  id,
  dispatch,
  axiosClientJwt,
  navigate,
}: any) => {
  try {
    // const accessToken = localStorage.getItem("accessToken")
    dispatch(getCategoryStart());
    const res: IAxiosResponse<{}> = await axiosClientJwt.get(
      `/category/${id}`,
      // , {
      //     headers: {
      //         Authorization: `Bearer ${accessToken}`
      //     }
      // }
    );
    if (res?.status === 200) {
      setTimeout(function () {
        dispatch(getCategorySuccess(res.data));
      }, 1000);
    } else {
      dispatch(getCategoryFailed(null));
    }
  } catch (error: any) {
    dispatch(getCategoryFailed(null));
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

export const updateCategory = async ({
  category,
  axiosClientJwt,
  dispatch,
  navigate,
  setError,
  message,
  id,
}: any) => {
  try {
    const { categoryName, status } = category;
    const accessToken = localStorage.getItem("accessToken");
    dispatch(updateCategoryStart());
    const [res]: [IAxiosResponse<{}>] = await Promise.all([
      await axiosClientJwt.put(
        `/category/${id}`,
        {
          categoryName,
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
        dispatch(updateCategorySuccess(res.data));
        message.success("Cập nhật danh mục thành công");
        navigate("/catalog/categories");
      }, 1000);
    }

    // else if (res?.response?.code === 400 && !res?.response?.success) {
    //     dispatch(updateCategoryFailed(null));
    //     setError(res?.response?.fieldError as keyof FormValuesCategory, { message: res?.response?.message })
    // }
    else {
      dispatch(updateCategoryFailed(null));
    }
  } catch (error: any) {
    dispatch(updateCategoryFailed(null));
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

export const getListSearchCategory = async ({
  params,
  dispatch,
  axiosClientJwt,
  navigate,
}: any) => {
  try {
    const { value } = params;
    const accessToken = localStorage.getItem("accessToken");
    dispatch(getListCategoryStart());
    // const url = page || limit || filter ? `/categoryName={?page=${page}&limit=${limit}&filter=${filter}` : '/category'
    const res: any = await axiosClientJwt.get( `/category/search?categoryName=${value}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (res?.status === 200 && res?.data && res?.data) {
      dispatch(getListCategorySuccess(res.data));
    } else {
      dispatch(getListCategoryFailed(null));
    }
  } catch (error: any) {
    dispatch(getListCategoryFailed(null));
    Inotification({
      type: "error",
      message: "Something went wrong!",
    });
  }
};
