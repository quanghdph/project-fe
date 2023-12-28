import { Box, Flex } from "@chakra-ui/react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import autoAnimate from "@formkit/auto-animate";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Switch,
  message,
} from "antd";
import React, { Fragment, useState, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import {
  getProduct,
  updateProduct,
} from "src/features/catalog/product/actions";
import { createAxiosJwt } from "src/helper/axiosInstance";
import { Asset } from "src/types/asset";
import SelectImage from "../SelectImage";
import { getListCategory } from "src/features/catalog/category/action";
import { getListBrand } from "src/features/catalog/brand/action";
import { getListMaterial } from "src/features/catalog/material/action";
import { getListWaistband } from "src/features/catalog/waistband/action";
import {
  getBrandSelectName,
  getCategorySelectName,
  getMaterialSelectName,
  getWaistbandSelectName,
} from "src/hooks/catalog";

export interface FormValuesProduct {
  name: string;
}

const ProductDetail = () => {
  // ** State
  const [refresh, setRefresh] = useState<boolean>(false);
  const [featuredAsset, setFeaturedAsset] = useState<Asset>();
  const [isModalAssetOpen, setIsModalAssetOpen] = useState<boolean>(false);

  const [categorySelect, setCategorySelect] = useState();
  const [brandSelect, setBrandSelect] = useState();
  const [waistbandSelect, setWaistbandSelect] = useState();
  const [materialSelect, setMaterialSelect] = useState();

  // ** Third party
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      productName: "",
      category: {
        value: 0,
        label: "Chọn danh mục",
      },
      brand: {
        value: 0,
        label: "Chọn thương hiệu",
      },
      mainImage: null,
      description: "",
      createDate: "",
      updateDate: "",
      status: 0,
      waistband: {
        value: 0,
        label: "Chọn cạp quần",
      },
      productCode: "",
      material: {
        value: 0,
        label: "Chọn chất liệu",
      },
    },
  });

  // ** Variables
  const product = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();
  const axiosClientJwt = createAxiosJwt();

  const category = useAppSelector((state) => state.category);
  const brand = useAppSelector((state) => state.brand);
  const material = useAppSelector((state) => state.material);
  const waistband = useAppSelector((state) => state.waistband);

  useEffect(() => {
    getListCategory({
      params: {},
      navigate,
      axiosClientJwt,
      dispatch,
    });
    getListBrand({
      params: {},
      navigate,
      axiosClientJwt,
      dispatch,
    });
    getListMaterial({
      params: {},
      navigate,
      axiosClientJwt,
      dispatch,
    });
    getListWaistband({
      params: {},
      navigate,
      axiosClientJwt,
      dispatch,
    });
  }, []);

  // ** Effect

  useEffect(() => {
    if (id && !product.single.loading && product.single.result) {
      setValue("productName", product.single.result.productName);
      setValue("description", product.single.result.description);
      setValue("category", {
        value: product.single.result.category.id,
        label: product.single.result.category.categoryName,
      });
      setValue("material", {
        value: product.single.result.material.id,
        label: product.single.result.material.materialName,
      });
      setValue("waistband", {
        value: product.single.result.waistband.id,
        label: product.single.result.waistband.waistbandName,
      });
      setValue("brand", {
        value: product.single.result.brand.id,
        label: product.single.result.brand.brandName,
      });
    }
  }, [id, product.single.loading, product.single.result]);

  const onSubmit = async (data: any) => {
    if (id) {
      await updateProduct({
        product: {
          productName: data.productName,
          description: data.description,
          status: 1,
          brand: {
            id: data.brand.label ? data.brand.value : data.brand,
          },
          material: {
            id: data.material.label ? data.material.value : data.material,
          },
          waistband: {
            id: data.waistband.label ? data.waistband.value : data.waistband,
          },
          category: {
            id: data.category.label ? data.category.value : data.category,
          },
        },
        axiosClientJwt,
        dispatch,
        id: +id,
        message,
        navigate,
        setError,
        refresh,
        setRefresh,
      });
    }
  };

  useEffect(() => {
    if (
      category &&
      category.list.result?.listCategories &&
      !category.list.loading
    ) {
      const optionArray = getCategorySelectName(
        category.list.result.listCategories,
      );
      setCategorySelect(optionArray);
    }
    if (brand && brand.list.result?.listBrand && !brand.list.loading) {
      const optionArray = getBrandSelectName(brand.list.result.listBrand);
      setBrandSelect(optionArray);
    }
    if (
      waistband &&
      waistband.list.result?.listWaistbands &&
      !waistband.list.loading
    ) {
      const optionArray = getWaistbandSelectName(
        waistband.list.result.listWaistbands,
      );
      setWaistbandSelect(optionArray);
    }
    if (
      material &&
      material.list.result?.listMaterials &&
      !material.list.loading
    ) {
      const optionArray = getMaterialSelectName(
        material.list.result.listMaterials,
      );
      setMaterialSelect(optionArray);
    }
  }, [category, material, waistband, brand]);

  return (
    <Fragment>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex justifyContent="center" alignItems="center">
            <Switch checked={true} size="small" onChange={() => {}} />
            <Box as="span" ml={2} fontWeight="semibold">
              Hoạt động
            </Box>
          </Flex>
          <Button
            type="primary"
            htmlType="submit"
            loading={product.createProduct.loading}
          >
            Cập nhật
          </Button>
        </Flex>
        <Spin spinning={product.single.loading}>
          <Row>
            <Flex direction={"column"}>
              <Box mb={3}>
                <Box as="label" htmlFor="productName" fontWeight="semibold">
                  Tên sản phẩm
                </Box>
                <Controller
                  name="productName"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, ...other } }) => {
                    return (
                      <Box my={1}>
                        <Input
                          status={errors?.name ? "error" : ""}
                          id="productName"
                          placeholder="Ví dụ: Bags"
                          {...other}
                          value={value || ""}
                        />
                        {errors?.name ? (
                          <Box as="span" textColor="red.500">
                            {errors.name?.type === "required"
                              ? "Vui lòng điền tên sản phẩm!"
                              : errors.name.message}
                          </Box>
                        ) : null}
                      </Box>
                    );
                  }}
                />
              </Box>
              <Box mb={3}>
                <Box
                  as="span"
                  fontWeight="semibold"
                  mb={1}
                  sx={{ display: "inline-block" }}
                >
                  Mô tả
                </Box>
                <Controller
                  name="description"
                  control={control}
                  render={({ field: { value, ...other } }) => {
                    return (
                      <CKEditor
                        editor={ClassicEditor}
                        data={value || ""}
                        onChange={(_event, editor) => {
                          setValue("description", editor.getData());
                        }}
                      />
                    );
                  }}
                />
              </Box>
              <Box mb={3}>
                <Box
                  as="span"
                  fontWeight="semibold"
                  mb={1}
                  sx={{ display: "inline-block" }}
                >
                  Danh mục
                </Box>
                <Controller
                  name="category"
                  control={control}
                  render={({ field: { value, ...other } }) => {
                    return (
                      <Select
                        value={value}
                        onChange={(selectedOption) => {
                          console.log(selectedOption);
                          setValue("category", selectedOption); // Update 'category' field
                        }}
                        options={categorySelect}
                      />
                    );
                  }}
                />
              </Box>
              <Box mb={3}>
                <Box
                  as="span"
                  fontWeight="semibold"
                  mb={1}
                  sx={{ display: "inline-block" }}
                >
                  Thương hiệu
                </Box>
                <Controller
                  name="brand"
                  control={control}
                  render={({ field: { value, ...other } }) => {
                    return (
                      <Select
                        value={value}
                        onChange={(selectedOption) => {
                          setValue("brand", selectedOption); // Update 'category' field
                        }}
                        options={brandSelect}
                      />
                    );
                  }}
                />
              </Box>
              <Box mb={3}>
                <Box
                  as="span"
                  fontWeight="semibold"
                  mb={1}
                  sx={{ display: "inline-block" }}
                >
                  Cạp quần
                </Box>
                <Controller
                  name="waistband"
                  control={control}
                  render={({ field: { value, ...other } }) => {
                    return (
                      <Select
                        value={value}
                        onChange={(selectedOption) => {
                          setValue("waistband", selectedOption); // Update 'category' field
                        }}
                        options={waistbandSelect}
                      />
                    );
                  }}
                />
              </Box>
              <Box mb={3}>
                <Box
                  as="span"
                  fontWeight="semibold"
                  mb={1}
                  sx={{ display: "inline-block" }}
                >
                  Chất liệu
                </Box>
                <Controller
                  name="material"
                  control={control}
                  render={({ field: { value, ...other } }) => {
                    return (
                      <Select
                        value={value}
                        onChange={(selectedOption) => {
                          setValue("material", selectedOption); // Update 'category' field
                        }}
                        options={materialSelect}
                      />
                    );
                  }}
                />
              </Box>
            </Flex>
          </Row>
        </Spin>
      </Form>
      <SelectImage
        isModalAssetOpen={isModalAssetOpen}
        setIsModalAssetOpen={setIsModalAssetOpen}
        setFeaturedAsset={setFeaturedAsset}
        featuredAsset={featuredAsset as Asset}
      />
    </Fragment>
  );
};

export default ProductDetail;
