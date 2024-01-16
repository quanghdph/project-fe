// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import axios from "axios";
import { Inotification } from "src/common";
import React, { Fragment, useEffect, useState } from "react";
import {
  Breadcrumb,
  Col,
  Row,
  Card,
  Form,
  Switch,
  Button,
  Divider,
  Table,
  message,
  Upload,
  Select,
  Input,
  Grid,
  UploadFile,
  Image,
  Modal,
} from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { columns, data } from "./columns";
import { default as ProductCreateBasic } from "./ProductCreate";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { createAxiosJwt } from "src/helper/axiosInstance";
import {
  createProduct,
  getProduct,
  getProductDetail,
  getVariantProductDetail,
  updateMainImageProduct,
  updateProduct,
} from "src/features/catalog/product/actions";
import { Box, Flex, Text } from "@chakra-ui/react";
import SelectImage from "../SelectImage";
import { Asset } from "src/types";
import {
  getListCategory,
  getListSearchCategory,
} from "src/features/catalog/category/action";
import {
  getListBrand,
  getListSearchBrand,
} from "src/features/catalog/brand/action";
import {
  getListMaterial,
  getListSearchMaterial,
} from "src/features/catalog/material/action";
import ProductDetail from "../detail-update";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useDebounce } from "use-debounce";
import {
  getListColor,
  getListSearchColor,
} from "src/features/catalog/color/action";
import { getListSize } from "src/features/catalog/size/action";
import ProductVariant from "./ProductVariant";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const ProductCreateUpdate: React.FC = () => {
  const [enabled, setEnabled] = useState<boolean>(true);
  const [featuredAsset, setFeaturedAsset] = useState<Asset>();
  const [isModalAssetOpen, setIsModalAssetOpen] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<boolean>(false);

  const [files, setFiles] = useState();
  //search
  const [categorySearch, setCategorySearch] = useState<string>("");
  const [categoryValue] = useDebounce(categorySearch, 1000);
  const [brandSearch, setBrandSearch] = useState<string>("");
  const [brandValue] = useDebounce(brandSearch, 1000);
  const [materialSearch, setMaterialSearch] = useState<string>("");
  const [materialValue] = useDebounce(materialSearch, 1000);
  const [colorSearch, setColorSearch] = useState<string>("");
  const [colorValue] = useDebounce(colorSearch, 1000);
  const [sizeSearch, setSizeSearch] = useState<string>("");
  const [sizeValue] = useDebounce(sizeSearch, 1000);

  const [categorySelect, setCategorySelect] = useState([]);
  const [brandSelect, setBrandSelect] = useState([]);
  const [materialSelect, setMaterialSelect] = useState([]);
  const [waistbandSelect, setWaistbandSelect] = useState([]);
  const [colorSelect, setColorSelect] = useState([]);
  const [sizeSelect, setSizeSelect] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [uniqueSizes, setUniqueSizes] = useState([]);
  const [uniqueColors, setUniqueColors] = useState([]);

  //** Third party
  const navigate = useNavigate();
  let { id } = useParams();
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    register,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productName: "",
      mainImage: "",
      description: "",
      status: 1,
      category: {
        value: 0,
        label: "Chọn danh mục",
      },
      brand: {
        value: 0,
        label: "Chọn thương hiệu",
      },
      material: {
        value: 0,
        label: "Chọn chất liệu",
      },
      color: {
        value: 0,
        label: "Chọn màu sắc",
      },
      size: {
        value: 0,
        label: "Chọn kích thước",
      },
    },
  });

  //** Variables
  const dispatch = useAppDispatch();
  const axiosClientJwt = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
      // "Content-Type": "application/json",
    },
  });
  const { product, category, brand, material, color, size } = useSelector(
    (state) => state,
  );
  //upload
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileMainList, setFileMainList] = useState<UploadFile[]>([]);
  const [fileMainImageList, setFileMainImageList] = useState<UploadFile[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = categoryValue ? { value: categoryValue } : {};
        const fetchFunction = categoryValue
          ? getListSearchCategory
          : getListCategory;

        await fetchFunction({
          params,
          navigate,
          axiosClientJwt,
          dispatch,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [categorySearch, categoryValue]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchFunction = brandValue ? getListSearchBrand : getListBrand;

      try {
        const params = brandValue ? { value: brandValue } : {};
        await fetchFunction({
          params,
          navigate,
          axiosClientJwt,
          dispatch,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [brandSearch, brandValue]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchFunction = materialValue
        ? getListSearchMaterial
        : getListMaterial;

      try {
        const params = materialValue ? { value: materialValue } : {};
        await fetchFunction({
          params,
          navigate,
          axiosClientJwt,
          dispatch,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [materialSearch, materialValue]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchFunction = colorValue ? getListSearchColor : getListColor;

      try {
        const params = colorValue ? { value: colorValue } : {};
        await fetchFunction({
          params,
          navigate,
          axiosClientJwt,
          dispatch,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [colorSearch, colorValue]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchFunction = sizeValue ? getListSearchSize : getListSize;

      try {
        const params = sizeValue ? { value: sizeValue } : {};
        await fetchFunction({
          params,
          navigate,
          axiosClientJwt,
          dispatch,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [sizeSearch, sizeValue]);

  useEffect(() => {
    if (id) {
      getVariantProductDetail({
        axiosClientJwt,
        dispatch,
        id: +id,
        navigate,
      });
    }
  }, [id]);

  const onSubmit = async (data) => {
    if (id) {
      await updateProduct({
        axiosClientJwt,
        dispatch,
        navigate,
        setError,
        message,
        id,
        product: {
          productName: data.productName,
          description: data.description,
          status: enabled ? 1 : 0,
          brand: {
            id: data.brand.value,
          },
          material: {
            id: data.material.value,
          },
          category: {
            id: data.category.value,
          },
          // images: fileList,
          // productDetails: tableData,
          // mainImage: fileMainList,
        },
      });
    } else {
      await createProduct({
        axiosClientJwt,
        dispatch,
        setError,
        navigate,
        message,
        product: {
          productName: data.productName,
          description: data.description,
          status: enabled ? 1 : 0,
          brand: {
            id: data.brand,
          },
          material: {
            id: data.material,
          },
          category: {
            id: data.category,
          },
          images: fileList,
          productDetails: tableData,
          mainImage: fileMainList,
        },
      });
    }
  };

  const onMaterialSearch = (value: string) => {
    setMaterialSearch(value);
  };
  const onBrandSearch = (value: string) => {
    setBrandSearch(value);
  };

  const onCategorySearch = (value: string) => {
    setCategorySearch(value);
  };

  // useEffect(() => {
  //   if (!category.list.loading && category.list.result) {
  //     const listOption = category.list.result.listCategories
  //       ? category.list.result.listCategories.map((item) => ({
  //           value: item.id,
  //           label: item.categoryName,
  //         }))
  //       : category.list.result.map((item) => ({
  //           value: item.id,
  //           label: item.categoryName,
  //         }));

  //     if (!categoryValue) {
  //       setCategorySelect(listOption);
  //     } else {
  //       listOption && setCategorySelect(listOption);
  //     }
  //   }
  // }, [category.list.result, category.list.loading, categoryValue]);

  useEffect(() => {
    if (!category.list.loading && category.list.result) {
      const listOption = (
        category.list.result.listCategories ?? category.list.result
      ).map((item) => ({
        value: item.id,
        label: item.categoryName,
      }));

      !categoryValue && setCategorySelect(listOption);

      listOption && setCategorySelect(listOption);
    }
  }, [category.list.result, category.list.loading, categoryValue]);

  const filterCategoryOption = (
    input: string,
    option?: { label: string; value: string },
  ) => {
    return categorySelect;
  };

  useEffect(() => {
    if (!brand.list.loading && brand.list.result) {
      const listOption = brand.list.result.listBrand
        ? brand.list.result.listBrand.map((item) => ({
            value: item.id,
            label: item.brandName,
          }))
        : brand.list.result.map((item) => ({
            value: item.id,
            label: item.brandName,
          }));

      if (!brandValue) {
        setBrandSelect(listOption);
      } else {
        listOption && setBrandSelect(listOption);
      }
    }
  }, [brand.list.result, brand.list.loading, brandValue]);

  const filterBrandOption = (
    input: string,
    option?: { label: string; value: string },
  ) => {
    return brandSelect;
  };

  useEffect(() => {
    if (!color.list.loading && color.list.result) {
      const listOption = color.list.result.listColors
        ? color.list.result.listColors.map((item) => ({
            value: item.id,
            label: item.colorName,
          }))
        : color.list.result.map((item) => ({
            value: item.id,
            label: item.colorName,
          }));

      if (!colorValue) {
        setColorSelect(listOption);
      } else {
        listOption && setColorSelect(listOption);
      }
    }
  }, [color.list.result, color.list.loading, colorValue]);

  useEffect(() => {
    if (!material.list.loading && material.list.result) {
      const listOption = material.list.result.listMaterials
        ? material.list.result.listMaterials.map((item) => ({
            value: item.id,
            label: item.materialName,
          }))
        : material.list.result.map((item) => ({
            value: item.id,
            label: item.materialName,
          }));

      if (!materialValue) {
        setMaterialSelect(listOption);
      } else {
        listOption && setMaterialSelect(listOption);
      }
    }
  }, [material.list.result, material.list.loading, materialValue]);

  const filterMaterialOption = (
    input: string,
    option?: { label: string; value: string },
  ) => {
    return materialSelect;
  };

  useEffect(() => {
    if (!size.list.loading && size.list.result) {
      const listOption = size.list.result.listSizes
        ? size.list.result.listSizes.map((item) => ({
            value: item.id,
            label: item.sizeName,
          }))
        : size.list.result.map((item) => ({
            value: item.id,
            label: item.sizeName,
          }));

      if (!sizeValue) {
        setSizeSelect(listOption);
      } else {
        listOption && setSizeSelect(listOption);
      }
    }
  }, [size.list.result, size.list.loading, sizeValue]);

  const onUploadChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileList(Array.from(newFileList));
  };

  const onUploadPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleChange = (e) => {
    // setFileList(Array.from(fileList));
    setFileList(URL.createObjectURL(e.target.files));
  };

  const customRequest = ({ file, onSuccess, onError }) => {
    console.log(file);
    setTimeout(() => {
      onSuccess();
    }, 1000);
  };

  const handleRemove = (file) => {
    // Remove the file from the fileList
    setFileList((prevList) =>
      Array.from(prevList).filter((item) => item.uid !== file.uid),
    );
  };

  const customMainRequest = ({ file, onSuccess, onError }) => {
    setTimeout(() => {
      onSuccess();
    }, 1000);
  };

  const onUploadMainChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileMainList(Array.from(newFileList));
  };

  const onUploadMainPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const handleMainRemove = (file) => {
    // Remove the file from the fileList
    setFileMainList((prevList) =>
      Array.from(prevList).filter((item) => item.uid !== file.uid),
    );
  };

  //Main image
  const customMainImageRequest = ({ file, onSuccess, onError }) => {
    setTimeout(() => {
      onSuccess();
    }, 1000);
  };

  const onUploadMainImageChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileMainImageList(Array.from(newFileList));
  };

  const onUploadMainImagePreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const handleMainImageRemove = (file) => {
    // Remove the file from the fileList
    setFileMainImageList((prevList) =>
      Array.from(prevList).filter((item) => item.uid !== file.uid),
    );
  };

  useEffect(() => {
    const sizes = product?.variant?.result && [
      ...new Set(
        product?.variant?.result.listProductDetail.map(
          (product) => product.size,
        ),
      ),
    ];
    const colors = product?.variant?.result && [
      ...new Set(
        product?.variant?.result.listProductDetail.map(
          (product) => product.color,
        ),
      ),
    ];

    const sizeIds = sizes && sizes.map(({ id }) => id);
    const sizeFiltered =
      sizes &&
      sizes.filter(({ id }, index) => !sizeIds.includes(id, index + 1));

    const colorsIds = colors && colors.map(({ id }) => id);
    const colorsFiltered =
      colors &&
      colors.filter(({ id }, index) => !colorsIds.includes(id, index + 1));

    setUniqueSizes(sizeFiltered);
    setUniqueColors(colorsFiltered);
  }, [product?.variant?.result, product?.variant?.loading]);

  useEffect(() => {
    if (id && product?.variant?.result && !product?.variant.loading) {
      setValue(
        "productName",
        product?.variant?.result?.listProductDetail[0]?.product?.productName,
      );
      setValue(
        "description",
        product?.variant?.result?.listProductDetail[0]?.product?.description,
      );
      setValue(
        "category",
       {
        label:  product?.variant?.result?.listProductDetail[0]?.product?.category.categoryName,
        value:  product?.variant?.result?.listProductDetail[0]?.product?.category.id,
       }
      );
      setValue(
        "brand",
        {
          label:  product?.variant?.result?.listProductDetail[0]?.product?.brand.brandName,
          value:   product?.variant?.result?.listProductDetail[0]?.product?.brand.id,
         }
       
      );
      setValue(
        "material",
        {
          label:  product?.variant?.result?.listProductDetail[0]?.product?.material.materialName,
          value:   product?.variant?.result?.listProductDetail[0]?.product?.material?.id,
         }
       
      );
      // setSizeSelect({})
    }
  }, [id, product.variant.loading, product.variant.result]);

  useEffect(() => {
    if (id && fileMainList.length == 0) {
      setFileMainList([
        ...fileMainList,
        { url: `${import.meta.env.VITE_BACKEND_URL}/product/${id}/image-main` },
      ]);
    }

    if (id && tableData.length == 0) {
      uniqueSizes &&
        uniqueSizes?.map((size) => {
          uniqueColors &&
            uniqueColors?.map((color) => {
              setTableData([
                ...tableData,
                {
                  color: {
                    label: color.colorName,
                    value: color.id,
                    disable: null,
                    title: null,
                  },
                  key: `${size.sizeName}-${color.colorName}`,
                  price: 0,
                  quantity: 0,
                  size: {
                    label: size.sizeName,
                    value: size.id,
                    disable: null,
                    title: null,
                  },
                  status: 1,
                },
              ]);
            });
        });
    }
  }, [id, product.variant.loading, product.variant.result]);

  const handleUpdateMainImage = () => {
    setModalImage(true);
  };

  const handleMainImageUpload = () => {
    if (id) {
      updateMainImageProduct({
        id,
        dispatch,
        axiosClientJwt,
        image: fileMainImageList,
        setModalImage,
        navigate
      });
    }
  };

  const handleMainImageCancel = () => {
    setFileMainImageList([]); // Clear the file list when the modal is canceled
    setModalImage(false)
  };

  return (
    <Fragment>
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/">Trang chủ</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/catalog/products">Sản phẩm</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{id ? id : "Tạo mới"}</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={24}>
          <Card>
            <Form onFinish={handleSubmit(onSubmit)} autoComplete="off">
              <Flex
                justifyContent={`${id ? "space-between" : "flex-end"}`}
                alignItems="center"
              >
                {id && (
                  <Flex justifyContent="center" alignItems="center">
                    <Switch
                      checked={enabled}
                      size="small"
                      onChange={() => setEnabled(!enabled)}
                    />
                    <Box as="span" ml={2} fontWeight="semibold">
                      Hoạt động
                    </Box>
                  </Flex>
                )}
                <Flex gap={3}>
                  {id && (
                    <Button
                      type="ghost"
                      // htmlType="submit"
                      onClick={handleUpdateMainImage}
                      loading={false}
                    >
                      Cập nhật ảnh chính
                    </Button>
                  )}
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={product.variant.loading && true}
                    loading={
                      !id
                        ? product.createProduct.loading
                        : product.update.loading
                    }
                  >
                    {!id ? "Tạo" : "Cập nhật"}
                  </Button>
                </Flex>
              </Flex>
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
                        {errors?.productName ? (
                          <Box as="span" textColor="red.500">
                            {errors.productName?.type === "required"
                              ? "Vui lòng điền tên sản phẩm!"
                              : errors.productName.message}
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
              <Flex wrap={"wrap"} gap={3}>
                <Box mb={3} width={"49%"}>
                  <Flex direction={"column"}>
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
                      rules={{ required: true }}
                      render={({ field: { value, ...other } }) => {
                        return (
                          <>
                            <Select
                              showSearch
                              onSearch={onCategorySearch}
                              optionFilterProp="children"
                              // onChange={onCategorySearchChange}
                              onChange={(selectedOption) => {
                                setValue("category", selectedOption); // Update 'category' field
                              }}
                              value={value}
                              placeholder={"Chọn danh mục"}
                              filterOption={filterCategoryOption}
                              style={{ width: "100%" }}
                              options={categorySelect}
                            />
                            {errors?.category ? (
                              <Box as="span" textColor="red.500">
                                {errors.category?.type === "required"
                                  ? "Vui lòng điền tên sản phẩm!"
                                  : errors.category.message}
                              </Box>
                            ) : null}
                          </>
                        );
                      }}
                    />
                  </Flex>
                </Box>
                <Box mb={3} width={"49%"}>
                  <Flex direction={"column"}>
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
                            showSearch
                            onSearch={onBrandSearch}
                            onChange={(selectedOption) => {
                              setValue("brand", selectedOption); // Update 'category' field
                            }}
                            filterOption={filterBrandOption}
                            style={{ width: "100%" }}
                            options={brandSelect}
                          />
                        );
                      }}
                    />
                  </Flex>
                </Box>
                <Box mb={3} width={"49%"}>
                  <Flex direction={"column"}>
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
                            showSearch
                            onSearch={onMaterialSearch}
                            onChange={(selectedOption) => {
                              setValue("material", selectedOption); // Update 'category' field
                            }}
                            style={{ width: "100%" }}
                            options={materialSelect}
                          />
                        );
                      }}
                    />
                  </Flex>
                </Box>
              </Flex>
            </Form>

            {!id && (
              <ProductVariant
                tableData={tableData}
                setTableData={setTableData}
                sizes={sizeSelect}
                colors={colorSelect}
              />
            )}
            {id && (
              <Image
                style={{ width: "100%", maxWidth: "150px", maxHeight: "75%" }}
                onError={(e) => {
                  e.target.src =
                    "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg";
                }}
                preview={false}
                src={`${
                  import.meta.env.VITE_BACKEND_URL
                }/product/${id}/image-main`}
              />
            )}

            {!id && (
              <Box mt={5}>
                <Text>Chọn ảnh chính</Text>
                <Upload
                  action="http://localhost:8080/product/add"
                  customRequest={customMainRequest}
                  fileList={fileMainList}
                  onChange={onUploadMainChange}
                  onRemove={handleMainRemove}
                  listType="picture-card"
                  onPreview={onUploadMainPreview}
                  showUploadList={{
                    showPreviewIcon: true,
                    showRemoveIcon: true,
                  }}
                  multiple={true}
                >
                  {fileMainList.length >= 1 ? null : uploadButton}
                </Upload>
                {/* {!id && (
                <>
                  <Text>Chọn biến thể</Text>
                  <Upload
                    action="http://localhost:8080/product/add"
                    customRequest={customRequest}
                    fileList={fileList}
                    onChange={onUploadChange}
                    onRemove={handleRemove}
                    listType="picture-card"
                    onPreview={onUploadPreview}
                    showUploadList={{
                      showPreviewIcon: true,
                      showRemoveIcon: true,
                    }}
                    multiple={true}
                  >
                    {fileList.length >= 5 ? null : uploadButton}
                  </Upload>
                </>
              )} */}
              </Box>
            )}
          </Card>
        </Col>
      </Row>
      <SelectImage
        isModalAssetOpen={isModalAssetOpen}
        setIsModalAssetOpen={setIsModalAssetOpen}
        setFeaturedAsset={setFeaturedAsset}
        setFiles={setFiles}
        featuredAsset={featuredAsset as Asset}
      />
      {id && (
        <Modal
          title="Upload Images"
          open={modalImage}
          onCancel={handleMainImageCancel}
          footer={[
            <Button key="back" onClick={handleMainImageCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" loading={product.mainImage.loading} onClick={handleMainImageUpload}>
              {product.mainImage.loading ? 'Uploading..' : 'OK'}
            </Button>,
          ]}
        >
          <Upload
            action={`http://localhost:8080/product/image-main/${id}`}
            customRequest={customMainImageRequest}
            fileList={fileMainImageList}
            onChange={onUploadMainImageChange}
            onRemove={handleMainImageRemove}
            listType="picture-card"
            onPreview={onUploadMainImagePreview}
            showUploadList={{
              showPreviewIcon: true,
              showRemoveIcon: true,
            }}
            multiple={true}
          >
            {fileMainImageList.length >= 1 ? null : uploadButton}
          </Upload>
        </Modal>
      )}
    </Fragment>
  );
};
export default React.memo(ProductCreateUpdate);
