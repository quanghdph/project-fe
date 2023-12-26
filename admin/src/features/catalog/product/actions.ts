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
    // const { active, description, name, featured_asset_id, opti } = product;
    const {
      productName,
      mainImage,
      description,
      createDate,
      updateDate,
      status,
      productCode,
    } = product;
    dispatch(createProductStart());
    const accessToken = localStorage.getItem("accessToken");
    console.log(product);
    const res: IAxiosResponse<Product> = await axiosClientJwt.post(
      `/product`,
      {
        productName,
        mainImage,
        description,
        createDate,
        updateDate,
        status,
        productCode,
      },
      // {
      //     headers: {
      //         Authorization: `Bearer ${accessToken}`,
      //     },
      // },
    );
    return res;
    // if (resCreateProduct?.response?.code === 200 && resCreateProduct?.response?.success) {
    //     const resCreateProductOption = await createProductOption({ options, axiosClientJwt, productId: resCreateProduct.response.data?.id })
    //     if (resCreateProductOption?.response?.code === 200 && resCreateProductOption?.response?.success) {
    //         const colorValue = resCreateProductOption.response.data?.filter((item) => item.name === "Color")
    //         const sizeValue = resCreateProductOption.response.data?.filter((item) => item.name === "Size")
    //         let result: { name: string, option_ids: number[], product_id: number }[] = [];
    //         if (colorValue.length > 0 && sizeValue.length > 0) {
    //             colorValue.map((item) => {
    //                 const all = sizeValue.map((size) => {
    //                     return {
    //                         name: `${item.value}-${size.value}`,
    //                         option_ids: [item.id, size.id],
    //                         product_id: resCreateProduct.response.data?.id,
    //                     };
    //                 });
    //                 result.push(...all);
    //             });
    //         } else if (colorValue.length > 0) {
    //             colorValue.length > 0 && colorValue.map((item) => {
    //                 return result.push({
    //                     name: `${item.value}`,
    //                     option_ids: [item.id],
    //                     product_id: resCreateProduct.response.data?.id
    //                 });
    //             });
    //         } else {
    //             sizeValue.length > 0 && sizeValue.map((item) => {
    //                 return result.push({
    //                     name: `${item.value}`,
    //                     option_ids: [item.id],
    //                     product_id: resCreateProduct.response.data?.id
    //                 });
    //             });
    //         }
    //         const variants = result.map((item, index) => {
    //             return {
    //                 sku: getValues("sku") && getValues("sku")[index] as string,
    //                 name: `${getValues("name")}-${item.name}`,
    //                 option_ids: item.option_ids,
    //                 product_id: item.product_id,
    //                 stock: getValues("stock") && getValues("stock")[index] as number,
    //                 origin_price: getValues("originPrice") && getValues("originPrice")[index] as number,
    //                 price: getValues("price") && getValues("price")[index] as number
    //             };
    //         });
    //         const resCreateProductVariant = await createProductVariant({ axiosClientJwt, variants })
    //         if (resCreateProductVariant?.response?.code === 200 && resCreateProductVariant?.response?.success) {
    //             setTimeout(function () {
    //                 dispatch(createProductSuccess(resCreateProduct.response.data));
    //                 message.success('Tạo sản phẩm thành công!');
    //                 navigate("/catalog/products")
    //             }, 1000);
    //         } else if (resCreateProductVariant?.response?.code === 400 && !resCreateProductVariant?.response?.success) {
    //             dispatch(createProductFailed(null));
    //             const indexValuesError = resCreateProductVariant.response?.valuesError!.map((value) => {
    //                 return getValues("sku").indexOf(value);
    //             })
    //             indexValuesError.map((i) => {
    //                 setError(`${resCreateProductVariant?.response?.fieldError}[${i}]` as keyof FormValuesProductVariant, { message: resCreateProductVariant?.response?.message })
    //             })
    //         } else {
    //             dispatch(createProductFailed(null));
    //         }
    //     } else {
    //         dispatch(createProductFailed(null));
    //     }
    // } else {
    //     dispatch(createProductFailed(null));
    // }
  } catch (error: any) {
    dispatch(createProductFailed(null));
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
    // console.log(res)
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
}: GetProductParams) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    dispatch(getProductStart());
    const res: IAxiosResponse<{}> = await axiosClientJwt.get(`/product/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res?.response?.code === 200 && res?.response?.success) {
      setTimeout(function () {
        dispatch(getProductSuccess(res.response.data));
      }, 1000);
    } else {
      dispatch(getProductFailed(null));
    }
  } catch (error: any) {
    dispatch(getProductFailed(null));
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
    const { active, name, description, featured_asset_id, category_id } =
      product;
    const accessToken = localStorage.getItem("accessToken");
    dispatch(updateProductStart());
    const [res]: [IAxiosResponse<{}>] = await Promise.all([
      await axiosClientJwt.put(
        `/product/update/${id}`,
        {
          active,
          name,
          description,
          featured_asset_id,
          category_id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    ]);
    if (res?.response?.code === 200 && res?.response?.success) {
      setTimeout(function () {
        dispatch(updateProductSuccess(res.response.data));
        message.success("Cập nhật sản phẩm thành công!");
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