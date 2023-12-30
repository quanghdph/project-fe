import { Inotification } from "src/common";
import {
  createProductFailed,
  createProductStart,
  createProductSuccess,
  getListProductStart,
  getListProductSuccess,
  getListProductFailed,
  deleteProductStart,
  deleteProductSuccess,
  deleteProductFailed,
  getProductStart,
  getProductSuccess,
  getProductFailed,
  updateProductStart,
  updateProductSuccess,
  updateProductFailed,
  getImageSuccess,
  getImageStart,
  getImageFailed,
  getProductDetailSuccess,
  getProductDetailStart,
  getProductDetailFailed,
} from "./productSlice";
import { IAxiosResponse } from "src/types/axiosResponse";
import { FormValuesProduct } from "src/components/Catalog/Products/detail-update/ProductDetail";
import {
  DeleteProductParams,
  GetProductParams,
  UpdateProductParams,
} from "./type";
import { Product } from "src/types";

export const createProduct = async ({
  product,
  dispatch,
  axiosClientJwt,
  setError,
  navigate,
  message,
}: any) => {
  try {
    const {
      productName,
      description,
      material,
      category,
      waistband,
      brand,
      status,
    } = product;
    dispatch(createProductStart());
    const accessToken = localStorage.getItem("accessToken");
    const res: any = await axiosClientJwt.post(
      `/product`,
      {
        productName,
        description,
        status,
        material,
        category,
        waistband,
        brand,
        images: ""
      },
      {
          headers: {
              Authorization: `Bearer ${accessToken}`,
          },
      },
    );
    if (res?.status === 200 && res?.data) {
      setTimeout(function () {
          dispatch(createProductSuccess(res.data));
          message.success('Tạo sản phẩm thành công!');
          navigate("/catalog/products")
      }, 1000);
  }else {
    dispatch(createProductFailed(null));
}
   
  } catch (error: any) {
    dispatch(createProductFailed(null));
           Inotification({
            type: 'error',
            message: 'Something went wrong!'
        })
  }
};

export const getListProduct = async ({
  params,
  dispatch,
  axiosClientJwt,
  navigate,
}: GetListProductParams) => {
  try {
    const { page, limit, filter } = params;
    const accessToken = localStorage.getItem("accessToken");
    dispatch(getListProductStart());
    const res: any = await axiosClientJwt.get(
      `/product?page=${page}&limit=${limit}&filter=${filter}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (res?.status === 200 && res?.data && res?.data.list) {
      setTimeout(function () {
        dispatch(getListProductSuccess(res.data));
      }, 1000);
    } else {
      dispatch(getListProductFailed(null));
    }
  } catch (error: any) {
    dispatch(getListProductFailed(null));
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

export const getListSearchProduct = async ({
  params,
  dispatch,
  axiosClientJwt,
  navigate,
}: any) => {
  try {
    const { value } = params;
    const accessToken = localStorage.getItem("accessToken");
    dispatch(getListProductStart());
    const res: any = await axiosClientJwt.get(
      `/product/search?productName=${value}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (res?.status === 200 && res?.data) {
      setTimeout(function () {
        dispatch(getListProductSuccess(res.data));
      }, 1000);
    } else {
      dispatch(getListProductFailed(null));
    }
  } catch (error: any) {
    dispatch(getListProductFailed(null));
    Inotification({
      type: "error",
      message: "Something went wrong!",
    });
  }
};

export const deleteProduct = async ({
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
    dispatch(deleteProductStart());
    const accessToken = localStorage.getItem("accessToken");
    const res: IAxiosResponse<{}> = await axiosClientJwt.delete(
      `/product/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (res?.status === 200) {
      setTimeout(function () {
        dispatch(deleteProductSuccess(res.data));
        message.success("Xóa sản phẩm thành công!");
        setIsModalOpen(false);
        setRefresh(!refresh);
      }, 1000);
    } else {
      dispatch(deleteProductFailed(null));
      message.warning("Sản phẩm này không thể xóa!");
      setIsModalOpen(false);
    }
  } catch (error: any) {
    // dispatch(deleteProductFailed(null));
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

export const getProduct = async ({
  id,
  dispatch,
  axiosClientJwt,
  navigate,
}: any) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    dispatch(getProductStart());
    const res: IAxiosResponse<{}> = await axiosClientJwt.get(`/product/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res?.status === 200 && res?.data) {
      console.log(res);
      setTimeout(function () {
        dispatch(getProductSuccess(res.data));
      }, 1000);
    } else {
      dispatch(getProductFailed(null));
    }
  } catch (error: any) {
    dispatch(getProductFailed(null));
    // if (
    //   error?.response?.status === 403 &&
    //   error?.response?.statusText === "Forbidden"
    // ) {
    //   Inotification({
    //     type: "error",
    //     message: "Bạn không có quyền để thực hiện hành động này!",
    //   });
    //   setTimeout(function () {
    //     navigate("/");
    //   }, 1000);
    // } else {
    //   Inotification({
    //     type: "error",
    //     message: "Something went wrong!",
    //   });
    // }
    Inotification({
      type: "error",
      message: "Something went wrong!",
    });
  }
};

export const updateProduct = async ({
  product,
  axiosClientJwt,
  dispatch,
  navigate,
  setError,
  message,
  id,
  refresh,
  setRefresh,
}: any) => {
  try {
    const {
      productName,
      description,
      material,
      category,
      waistband,
      brand,
      status,
    } = product;
    const accessToken = localStorage.getItem("accessToken");
    dispatch(updateProductStart());
    const [res]: [IAxiosResponse<{}>] = await Promise.all([
      await axiosClientJwt.put(
        `/product/${id}`,
        {
          productName,
      description,
      material,
      category,
      waistband,
      brand,
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
        dispatch(updateProductSuccess(res.data));
        message.success("Cập nhật sản phẩm thành công!");
        navigate("/catalog/products");
        setRefresh(!refresh);
      }, 1000);
    } else if (res?.response?.code === 400 && !res?.response?.success) {
      dispatch(updateProductFailed(null));
      setError(res?.response?.fieldError as keyof FormValuesProduct, {
        message: res?.response?.message,
      });
    } else {
      dispatch(updateProductFailed(null));
    }
  } catch (error: any) {
    dispatch(updateProductFailed(null));
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

export const getProductImage = async ({
  id,
  dispatch,
  axiosClientJwt,
  navigate,
}: any) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    dispatch(getImageStart());
    const res: IAxiosResponse<{}> = await axiosClientJwt.get(`/product/${id}/image-main`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res?.status === 200) {
      setTimeout(function () {
        dispatch(getImageSuccess(res.data));
      }, 1000);
    } else {
      dispatch(getImageFailed(null));
    }
  } catch (error: any) {
    dispatch(getImageFailed(null));
    
    Inotification({
      type: "error",
      message: "Something went wrong!",
    });
  }
};


export const getProductDetail = async ({
  id,
  dispatch,
  axiosClientJwt,
  navigate,
}: any) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    dispatch(getProductDetailStart());
    const res: IAxiosResponse<{}> = await axiosClientJwt.get(`/product-detail/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(res);
    if (res?.status === 200 && res?.data) {
      setTimeout(function () {
        dispatch(getProductDetailSuccess(res.data));
      }, 1000);
    } else {
      dispatch(getProductDetailFailed(null));
    }
  } catch (error: any) {
    dispatch(getProductDetailFailed(null));
    Inotification({
      type: "error",
      message: "Something went wrong!",
    });
  }
};