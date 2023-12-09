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
    updateProductVariantStart,
    updateProductVariantSuccess,
    updateProductVariantFailed,
    updateProductOptionStart,
    updateProductOptionSuccess,
    updateProductOptionFailed,
    deleteProductVariantStart,
    deleteProductVariantSuccess,
    deleteProductVariantFailed,
    createProductVariantOptionStart,
    createProductVariantOptionSuccess,
    createProductVariantOptionFailed
} from "./productSlice";
import { IAxiosResponse } from "src/types/axiosResponse";
import { FormValuesProduct } from "src/components/Catalog/Products/detail-update/ProductDetail";
import { CreateProductOptionParams, CreateProductParams, CreateProductVariantOptionParams, CreateProductVariantParams, DeleteProductParams, DeleteProductVariantParams, GetListProductParams, GetProductParams, UpdateProductOptionParams, UpdateProductParams, UpdateProductVariantParams } from "./type";
import { Product, ProductOption } from "src/types";
import { FormValuesProductVariant } from "src/components/Catalog/Products/detail-update/ModalUpdateProductVariant";

export const createProduct = async ({ product, dispatch, axiosClientJwt, setError, navigate, message }: CreateProductParams) => {
    try {
        const { active, description, name, featured_asset_id, options, getValues } = product;
        dispatch(createProductStart());
        const accessToken = localStorage.getItem("accessToken");
        const resCreateProduct: IAxiosResponse<Product> = await axiosClientJwt.post(`/product/create`,
            {
                active,
                description,
                name,
                featured_asset_id
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        if (resCreateProduct?.response?.code === 200 && resCreateProduct?.response?.success) {
            const resCreateProductOption = await createProductOption({ options, axiosClientJwt, productId: resCreateProduct.response.data?.id })
            if (resCreateProductOption?.response?.code === 200 && resCreateProductOption?.response?.success) {
                const colorValue = resCreateProductOption.response.data?.filter((item) => item.name === "Color")
                const sizeValue = resCreateProductOption.response.data?.filter((item) => item.name === "Size")
                let result: { name: string, option_ids: number[], product_id: number }[] = [];
                if (colorValue.length > 0 && sizeValue.length > 0) {
                    colorValue.map((item) => {
                        const all = sizeValue.map((size) => {
                            return {
                                name: `${item.value}-${size.value}`,
                                option_ids: [item.id, size.id],
                                product_id: resCreateProduct.response.data?.id,
                            };
                        });
                        result.push(...all);
                    });
                } else if (colorValue.length > 0) {
                    colorValue.length > 0 && colorValue.map((item) => {
                        return result.push({
                            name: `${item.value}`,
                            option_ids: [item.id],
                            product_id: resCreateProduct.response.data?.id
                        });
                    });
                } else {
                    sizeValue.length > 0 && sizeValue.map((item) => {
                        return result.push({
                            name: `${item.value}`,
                            option_ids: [item.id],
                            product_id: resCreateProduct.response.data?.id
                        });
                    });
                }
                const variants = result.map((item, index) => {
                    return {
                        sku: getValues("sku") && getValues("sku")[index] as string,
                        name: `${getValues("name")}-${item.name}`,
                        option_ids: item.option_ids,
                        product_id: item.product_id,
                        stock: getValues("stock") && getValues("stock")[index] as number,
                        origin_price: getValues("originPrice") && getValues("originPrice")[index] as number,
                        price: getValues("price") && getValues("price")[index] as number
                    };
                });
                const resCreateProductVariant = await createProductVariant({ axiosClientJwt, variants })
                if (resCreateProductVariant?.response?.code === 200 && resCreateProductVariant?.response?.success) {
                    setTimeout(function () {
                        dispatch(createProductSuccess(resCreateProduct.response.data));
                        message.success('Tạo sản phẩm thành công!');
                        navigate("/catalog/products")
                    }, 1000);
                } else if (resCreateProductVariant?.response?.code === 400 && !resCreateProductVariant?.response?.success) {
                    dispatch(createProductFailed(null));
                    const indexValuesError = resCreateProductVariant.response?.valuesError!.map((value) => {
                        return getValues("sku").indexOf(value);
                    })
                    indexValuesError.map((i) => {
                        setError(`${resCreateProductVariant?.response?.fieldError}[${i}]` as keyof FormValuesProductVariant, { message: resCreateProductVariant?.response?.message })
                    })
                } else {
                    dispatch(createProductFailed(null));
                }
            } else {
                dispatch(createProductFailed(null));
            }
        } else {
            dispatch(createProductFailed(null));
        }
    } catch (error: any) {
        dispatch(createProductFailed(null));
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
};

export const createProductOption = async ({ options, axiosClientJwt, productId }: CreateProductOptionParams) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const res: IAxiosResponse<ProductOption[]> = await axiosClientJwt.post(`/product/option/bulk-create`,
            {
                options: options.map((option) => {
                    return {
                        ...option,
                        product_id: productId
                    }
                })
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        return res;
    } catch (error) {
        Inotification({
            type: "error",
            message: "Something went wrong!",
        });
    }
};

export const createProductVariant = async ({ variants, axiosClientJwt }: CreateProductVariantParams) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const res: IAxiosResponse<{}> = await axiosClientJwt.post(`/product/variant/bulk-create`,
            { variants },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        return res
    } catch (error) {
        Inotification({
            type: "error",
            message: "Something went wrong!",
        });
    }
};

export const getListProduct = async ({ pagination, dispatch, axiosClientJwt, navigate }: GetListProductParams) => {
    try {
        const { skip, take, search, status } = pagination;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getListProductStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.get('/product', {
            params: {
                ...pagination?.take && { take },
                ...pagination?.skip && { skip },
                ...pagination?.search && { search },
                ...pagination?.status && { status },
            },
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(getListProductSuccess(res.response.data));
            }, 1000)
        } else {
            dispatch(getListProductFailed(null));
        }
    } catch (error: any) {
        dispatch(getListProductFailed(null));
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

export const deleteProduct = async ({ id, dispatch, axiosClientJwt, navigate, message, refresh, setIsModalOpen, setRefresh }: DeleteProductParams) => {
    try {
        dispatch(deleteProductStart());
        const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<{}> = await axiosClientJwt.delete(`/product/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(deleteProductSuccess(res.response.data))
                message.success('Xóa sản phẩm thành công!')
                setIsModalOpen(false)
                setRefresh(!refresh)
            }, 1000);
        } else {
            dispatch(deleteProductFailed(null));
            message.warning('Sản phẩm này không thể xóa!')
            setIsModalOpen(false)
        }
    } catch (error: any) {
        dispatch(deleteProductFailed(null));
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

export const getProduct = async ({ id, dispatch, axiosClientJwt, navigate }: GetProductParams) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getProductStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.get(`/product/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(getProductSuccess(res.response.data));
            }, 1000)
        } else {
            dispatch(getProductFailed(null));
        }
    } catch (error: any) {
        dispatch(getProductFailed(null));
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

export const updateProduct = async ({ product, axiosClientJwt, dispatch, navigate, setError, message, id, refresh, setRefresh }: UpdateProductParams) => {
    try {
        const { active, name, description, featured_asset_id, category_id } = product;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(updateProductStart());
        const [res]: [IAxiosResponse<{}>] = await Promise.all([
            await axiosClientJwt.put(`/product/update/${id}`, {
                active,
                name,
                description,
                featured_asset_id,
                category_id
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }),
        ])
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(updateProductSuccess(res.response.data));
                message.success('Cập nhật sản phẩm thành công!');
                setRefresh(!refresh)
            }, 1000)
        } else if (res?.response?.code === 400 && !res?.response?.success) {
            dispatch(updateProductFailed(null));
            setError(res?.response?.fieldError as keyof FormValuesProduct, { message: res?.response?.message })
        } else {
            dispatch(updateProductFailed(null));
        }
    } catch (error: any) {
        dispatch(updateProductFailed(null));
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

export const updateProductVariant = async ({ productVariant, setIsModalOpen, axiosClientJwt, dispatch, navigate, setError, message, id, refresh, setRefresh }: UpdateProductVariantParams) => {
    try {
        const { name, price, sku, stock, featured_asset_id, origin_price } = productVariant;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(updateProductVariantStart());
        const [res]: [IAxiosResponse<{}>] = await Promise.all([
            await axiosClientJwt.put(`/product/variant/update/${id}`, {
                name,
                price,
                sku,
                stock,
                origin_price,
                featured_asset_id

            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }),
        ])
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(updateProductVariantSuccess(res.response.data));
                message.success('Cập nhật biến thể sản phẩm thành công!');
                setIsModalOpen(false)
                setRefresh(!refresh)
            }, 1000)
        } else if (res?.response?.code === 400 && !res?.response?.success) {
            dispatch(updateProductVariantFailed(null));
            setError(res?.response?.fieldError as keyof FormValuesProductVariant, { message: res?.response?.message })
        } else {
            dispatch(updateProductVariantFailed(null));
        }
    } catch (error: any) {
        dispatch(updateProductVariantFailed(null));
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

export const updateProductOption = async ({ productOption, setIsModalOpen, axiosClientJwt, dispatch, navigate, message, id, refresh, setRefresh }: UpdateProductOptionParams) => {
    try {
        const { value } = productOption;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(updateProductOptionStart());
        const [res]: [IAxiosResponse<{}>] = await Promise.all([
            await axiosClientJwt.put(`/product/option/update/${id}`, {
                value

            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }),
        ])
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(updateProductOptionSuccess(res.response.data));
                message.success('Cập nhật option sản phẩm thành công!');
                setIsModalOpen(false)
                setRefresh(!refresh)
            }, 1000)
        } else {
            dispatch(updateProductOptionFailed(null));
        }
    } catch (error: any) {
        dispatch(updateProductOptionFailed(null));
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

export const deleteProductVariant = async ({ id, dispatch, axiosClientJwt, navigate, message, refresh, setIsModalOpen, setRefresh }: DeleteProductVariantParams) => {
    try {
        dispatch(deleteProductVariantStart());
        const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<{}> = await axiosClientJwt.delete(`/product/variant/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(deleteProductVariantSuccess(res.response.data))
                message.success('Xóa sản phẩm biến thể thành công!')
                setIsModalOpen(false)
                setRefresh(!refresh)
            }, 1000);
        } else {
            dispatch(deleteProductVariantFailed(null));
            message.warning('Sản phẩm biến thể này không thể xóa!')
            setIsModalOpen(false)
        }
    } catch (error: any) {
        dispatch(deleteProductVariantFailed(null));
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

export const createProductVariantOption = async ({ axiosClientJwt, dispatch, getValues, message, navigate, options, setError, productId, productName }: CreateProductVariantOptionParams) => {
    try {
        dispatch(createProductVariantOptionStart());
        const resCreateProductOption = await createProductOption({ options, axiosClientJwt, productId })
        if (resCreateProductOption?.response?.code === 200 && resCreateProductOption?.response?.success) {
            const colorValue = resCreateProductOption.response.data?.filter((item) => item.name === "Color")
            const sizeValue = resCreateProductOption.response.data?.filter((item) => item.name === "Size")
            let result: { name: string, option_ids: number[], product_id: number }[] = [];
            if (colorValue.length > 0 && sizeValue.length > 0) {
                colorValue.map((item) => {
                    const all = sizeValue.map((size) => {
                        return {
                            name: `${item.value}-${size.value}`,
                            option_ids: [item.id, size.id],
                            product_id: productId
                        };
                    });
                    result.push(...all);
                });
            } else if (colorValue.length > 0) {
                colorValue.length > 0 && colorValue.map((item) => {
                    return result.push({
                        name: `${item.value}`,
                        option_ids: [item.id],
                        product_id: productId
                    });
                });
            } else {
                sizeValue.length > 0 && sizeValue.map((item) => {
                    return result.push({
                        name: `${item.value}`,
                        option_ids: [item.id],
                        product_id: productId
                    });
                });
            }
            const variants = result.map((item, index) => {
                return {
                    sku: getValues("sku") && getValues("sku")[index] as string,
                    name: `${productName}-${item.name}`,
                    option_ids: item.option_ids,
                    product_id: item.product_id,
                    stock: getValues("stock") && getValues("stock")[index] as number,
                    origin_price: getValues("originPrice") && getValues("originPrice")[index] as number,
                    price: getValues("price") && getValues("price")[index] as number
                };
            });
            const resCreateProductVariant = await createProductVariant({ axiosClientJwt, variants })
            if (resCreateProductVariant?.response?.code === 200 && resCreateProductVariant?.response?.success) {
                setTimeout(function () {
                    dispatch(createProductVariantOptionFailed(null));
                    message.success('Tạo biến thể thành công!');
                    navigate(`/catalog/products`)
                }, 1000);
            } else if (resCreateProductVariant?.response?.code === 400 && !resCreateProductVariant?.response?.success) {
                dispatch(createProductVariantOptionFailed(null));
                const indexValuesError = resCreateProductVariant.response?.valuesError!.map((value) => {
                    return getValues("sku").indexOf(value);
                })
                indexValuesError.map((i) => {
                    setError(`${resCreateProductVariant?.response?.fieldError}[${i}]` as keyof FormValuesProductVariant, { message: resCreateProductVariant?.response?.message })
                })
            } else {
                dispatch(createProductVariantOptionFailed(null));
            }
        } else {
            dispatch(createProductVariantOptionFailed(null));
        }
    } catch (error: any) {
        dispatch(createProductVariantOptionFailed(null));
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
