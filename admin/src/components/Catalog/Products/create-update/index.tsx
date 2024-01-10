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
} from "src/features/catalog/product/actions";
import { Box, Flex } from "@chakra-ui/react";
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
// import {
//   getListSearchWaistband,
//   getListWaistband,
// } from "src/features/catalog/waistband/action";
import ProductDetail from "../detail-update";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useDebounce } from "use-debounce";
import { getListColor } from "src/features/catalog/color/action";
import { getListSize } from "src/features/catalog/size/action";
import ProductVariant from "./ProductVariant";
import ImgCrop from "antd-img-crop";
import { UploadOutlined } from "@ant-design/icons";
import shortid from "shortid";

const props: UploadProps = {
  name: "file",
  multiple: true,
  action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const ProductCreateUpdate: React.FC = () => {
  const [enabled, setEnabled] = useState<boolean>(true);
  const [variantItem, setVariantItem] = useState<number[]>([]);
  const [productOptions, setProductOptions] = useState<number[]>([]);
  const [featuredAsset, setFeaturedAsset] = useState<Asset>();
  const [isModalAssetOpen, setIsModalAssetOpen] = useState<boolean>(false);

  const [files, setFiles] = useState();
  //search
  const [categorySearch, setCategorySearch] = useState<string>("");
  const [categoryValue] = useDebounce(categorySearch, 1000);
  const [brandSearch, setBrandSearch] = useState<string>("");
  const [brandValue] = useDebounce(brandSearch, 1000);
  const [waistbandSearch, setWaistbandSSearch] = useState<string>("");
  const [waistbandValue] = useDebounce(waistbandSearch, 1000);
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
      // waistband: {
      //   value: 0,
      //   label: "Chọn cạp quần",
      // },
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
  const product = useAppSelector((state) => state.product);
  const category = useAppSelector((state) => state.category);
  const brand = useAppSelector((state) => state.brand);
  const material = useAppSelector((state) => state.material);
  // const waistband = useAppSelector((state) => state.waistband);
  const color = useAppSelector((state) => state.color);
  const size = useAppSelector((state) => state.size);

  //upload
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [selectedfile, SetSelectedFile] = useState([]);
  const [Files, SetFiles] = useState([]);

  const filesizes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const InputChange = (e) => {
    // --For Multiple File Input
    let images = [];
    for (let i = 0; i < e.target.files.length; i++) {
      images.push(e.target.files[i]);
      let reader = new FileReader();
      let file = e.target.files[i];
      reader.onloadend = () => {
        SetSelectedFile((preValue) => {
          return [
            ...preValue,
            {
              id: shortid.generate(),
              filename: e.target.files[i].name,
              filetype: e.target.files[i].type,
              fileimage: reader.result,
              datetime:
                e.target.files[i].lastModifiedDate.toLocaleString("en-IN"),
              filesize: filesizes(e.target.files[i].size),
            },
          ];
        });
      };
      if (e.target.files[i]) {
        reader.readAsDataURL(file);
      }
    }
  };

  const DeleteSelectFile = (id) => {
    if (window.confirm("Are you sure you want to delete this Image?")) {
      const result = selectedfile.filter((data) => data.id !== id);
      SetSelectedFile(result);
    } else {
      // alert('No');
    }
  };

  const FileUploadSubmit = async (e) => {
    e.preventDefault();

    // form reset on submit
    e.target.reset();
    if (selectedfile.length > 0) {
      for (let index = 0; index < selectedfile.length; index++) {
        SetFiles((preValue) => {
          return [...preValue, selectedfile[index]];
        });
      }
      SetSelectedFile([]);
    } else {
      alert("Please select file");
    }
  };

  const DeleteFile = async (id) => {
    if (window.confirm("Are you sure you want to delete this Image?")) {
      const result = Files.filter((data) => data.id !== id);
      SetFiles(result);
    } else {
      // alert('No');
    }
  };

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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const fetchFunction = waistbandValue
  //       ? getListSearchWaistband
  //       : getListWaistband;

  //     try {
  //       const params = waistbandValue ? { value: waistbandValue } : {};
  //       await fetchFunction({
  //         params,
  //         navigate,
  //         axiosClientJwt,
  //         dispatch,
  //       });
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [waistbandSearch, waistbandValue]);

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
      getProductDetail({
        id: +id,
        dispatch,
        axiosClientJwt,
        navigate,
      });
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
      console.log(data);
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
          // waistband: {
          //   id: data.waistband,
          // },
          category: {
            id: data.category,
          },
          images: Files,
          productDetails: tableData,
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
  const onWaistbandSearch = (value: string) => {
    setWaistbandSSearch(value);
  };

  useEffect(() => {
    if (!category.list.loading && category.list.result) {
      const listOption = category.list.result.listCategories
        ? category.list.result.listCategories.map((item) => ({
            value: item.id,
            label: item.categoryName,
          }))
        : category.list.result.map((item) => ({
            value: item.id,
            label: item.categoryName,
          }));

      if (!categoryValue) {
        setCategorySelect(listOption);
      } else {
        listOption && setCategorySelect(listOption);
      }
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

  const filterColorOption = (
    input: string,
    option?: { label: string; value: string },
  ) => {
    return colorSelect;
  };

  // useEffect(() => {
  //   if (!waistband.list.loading && waistband.list.result) {
  //     const listOption = waistband.list.result.listWaistbands
  //       ? waistband.list.result.listWaistbands.map((item) => ({
  //           value: item.id,
  //           label: item.waistbandName,
  //         }))
  //       : waistband.list.result.map((item) => ({
  //           value: item.id,
  //           label: item.waistbandName,
  //         }));
  //     if (!waistbandValue) {
  //       setWaistbandSelect(listOption);
  //     } else {
  //       listOption && setWaistbandSelect(listOption);
  //     }
  //   }
  // }, [waistband.list.result, waistband.list.loading, waistbandValue]);

  // const filterWaistbandOption = (
  //   input: string,
  //   option?: { label: string; value: string },
  // ) => {
  //   return waistbandSelect;
  // };

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

  const filterSizeOption = (
    input: string,
    option?: { label: string; value: string },
  ) => {
    return sizeSelect;
  };

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

  useEffect(() => {
    const sizes = product.variant.result && [
      ...new Set(
        product.variant.result.listProductDetail.map((product) => product.size),
      ),
    ];
    const colors = product.variant.result && [
      ...new Set(
        product.variant.result.listProductDetail.map(
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
  }, [product.variant.result, product.variant.loading]);

  useEffect(() => {
    console.log(product);
    if (id && product?.detail?.result && !product?.detail.loading) {
      setValue("productName", product?.detail?.result?.product?.productName);
      setValue("description", product?.detail?.result?.product?.description);
      setValue("category", product?.detail?.result?.product?.category.id);
      setValue("brand", product?.detail?.result?.product?.brand.id);
      setValue("material", product?.detail?.result?.product?.material.id);
      // setSizeSelect({})
    }
  }, [id, product.detail.loading, product.detail.result]);

  // useEffect(() => {
  //   if(uniqueSizes) {
  //     const listOption = uniqueSizes?.map(item => {
  //       return {
  //         value: item.id,
  //         label: item.sizeName
  //       }
  //     })
  //     setSizeSelect(listOption)
  //   }
  //   if(uniqueColors) {
  //     const listOption = uniqueColors?.map(item => {
  //       return {
  //         value: item.id,
  //         label: item.colorName
  //       }
  //     })
  //     setColorSelect(listOption)
  //   }
  // }, [id, product.variant.loading, product.variant.result])

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
              <Flex justifyContent="space-between" alignItems="center">
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
                <Button type="primary" htmlType="submit" loading={false}>
                  {!id ? "Tạo" : "Cập nhật"}
                </Button>
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
                      render={({ field: { value, ...other } }) => {
                        return (
                          <Select
                            showSearch
                            onSearch={onCategorySearch}
                            optionFilterProp="children"
                            // onChange={onCategorySearchChange}
                            onChange={(selectedOption) => {
                              setValue("category", selectedOption); // Update 'category' field
                            }}
                            value={value}
                            filterOption={filterCategoryOption}
                            style={{ width: "100%" }}
                            options={categorySelect}
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
                {/* <Box mb={3} width={"49%"}>
                  <Flex direction={"column"}>
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
                            showSearch
                            optionFilterProp="children"
                            onSearch={onWaistbandSearch}
                            onChange={(selectedOption) => {
                              setValue("waistband", selectedOption);
                            }}
                            filterOption={filterWaistbandOption}
                            style={{ width: "100%" }}
                            options={waistbandSelect}
                          />
                        );
                      }}
                    />
                  </Flex>
                </Box> */}
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

            <ProductVariant
              tableData={tableData}
              setTableData={setTableData}
              sizes={sizeSelect}
              colors={colorSelect}
            />

            <Box mt={5}>
              {/* <Upload
                action="http://localhost:8080/product/add"
                customRequest={customRequest}
                fileList={fileList}
                onChange={handleChange}
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
              </Upload> */}
              <form onSubmit={FileUploadSubmit}>
                <div className="kb-file-upload">
                  <div className="file-upload-box">
                    <input
                      type="file"
                      id="fileupload"
                      className="file-upload-input"
                      onChange={InputChange}
                      multiple
                    />
                    <span>
                      Drag and drop or{" "}
                      <span className="file-link">Choose your files</span>
                    </span>
                  </div>
                </div>
                <div className="kb-attach-box mb-3">
                  {selectedfile.map((data, index) => {
                    const {
                      id,
                      filename,
                      filetype,
                      fileimage,
                      datetime,
                      filesize,
                    } = data;
                    return (
                      <div className="file-atc-box" key={id}>
                        {filename.match(/.(jpg|jpeg|png|gif|svg)$/i) ? (
                          <div className="file-image">
                            {" "}
                            <img src={fileimage} alt="" />
                          </div>
                        ) : (
                          <div className="file-image">
                            <i className="far fa-file-alt"></i>
                          </div>
                        )}
                        <div className="file-detail">
                          <h6>{filename}</h6>
                          <p></p>
                          <p>
                            <span>Size : {filesize}</span>
                            <span className="ml-2">
                              Modified Time : {datetime}
                            </span>
                          </p>
                          <div className="file-actions">
                            <button
                              type="button"
                              className="file-action-btn"
                              onClick={() => DeleteSelectFile(id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* <div className="kb-buttons-box">
                  <button type="submit" className="btn btn-primary form-submit">
                    Upload
                  </button>
                </div> */}
              </form>
              {Files.length > 0 ? (
                <div className="kb-attach-box">
                  <hr />
                  {Files.map((data, index) => {
                    const {
                      id,
                      filename,
                      filetype,
                      fileimage,
                      datetime,
                      filesize,
                    } = data;
                    return (
                      <div className="file-atc-box" key={index}>
                        {filename.match(/.(jpg|jpeg|png|gif|svg)$/i) ? (
                          <div className="file-image">
                            {" "}
                            <img src={fileimage} alt="" />
                          </div>
                        ) : (
                          <div className="file-image">
                            <i className="far fa-file-alt"></i>
                          </div>
                        )}
                        <div className="file-detail">
                          <h6>{filename}</h6>
                          <p>
                            <span>Size : {filesize}</span>
                            <span className="ml-3">
                              Modified Time : {datetime}
                            </span>
                          </p>
                          <div className="file-actions">
                            <button
                              className="file-action-btn"
                              onClick={() => DeleteFile(id)}
                            >
                              Delete
                            </button>
                            <a
                              href={fileimage}
                              className="file-action-btn"
                              download={filename}
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                ""
              )}
            </Box>
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
    </Fragment>
  );
};
export default ProductCreateUpdate;
