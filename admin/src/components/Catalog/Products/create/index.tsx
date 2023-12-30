// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Inotification } from "src/common";
import React, { Fragment, useEffect, useState } from "react";
import { Breadcrumb, Col, Row, Card, Form, Switch, Button, Divider, Table, message, Upload } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { columns, data } from "./columns";
import { default as ProductCreateBasic } from "./ProductCreate";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { createAxiosJwt } from "src/helper/axiosInstance";
import { createProduct, getProduct } from "src/features/catalog/product/actions";
import { Box, Flex } from "@chakra-ui/react";
import { getBrandSelectName, getCategorySelectName, getMaterialSelectName, getSelectName, getValueByName, getWaistbandSelectName, removeEmpty } from "src/hooks/catalog";
import SelectImage from "../SelectImage";
import { Asset } from "src/types";
import { getListCategory } from "src/features/catalog/category/action";
import { getListBrand } from "src/features/catalog/brand/action";
import { getListMaterial } from "src/features/catalog/material/action";
import { getListWaistband } from "src/features/catalog/waistband/action";
import ProductDetail from "../detail-update";

const ProductCreate: React.FC = () => {
   const [enabled, setEnabled] = useState<boolean>(true);
   const [variantItem, setVariantItem] = useState<number[]>([]);
   const [productOptions, setProductOptions] = useState<number[]>([]);
   const [featuredAsset, setFeaturedAsset] = useState<Asset>();
   const [isModalAssetOpen, setIsModalAssetOpen] = useState<boolean>(false);
   const [categorySelect, setCategorySelect] = useState()
   const [brandSelect, setBrandSelect] = useState()
   const [waistbandSelect, setWaistbandSelect] = useState()
   const [materialSelect, setMaterialSelect] = useState()

   //** Third party
   const navigate = useNavigate();
   let { id } = useParams();
   const { control, handleSubmit, setValue, setError, formState: { errors } } = useForm({
      defaultValues: {
         productName: "",
         mainImage: "",
         description: "",
         status: 1,
         category: {
            value: 0,
            label: "Select category"
         },
         brand: {
            value: 0,
            label: "Select brand"
         },
         waistband: {
            value: 0,
            label: "Select waistband"
         },
         material: {
            value: 0,
            label: "Select material"
         }
      },
   });

   //** Variables
   const dispatch = useAppDispatch();
   const axiosClientJwt = createAxiosJwt();
   const product = useAppSelector((state) => state.product);
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
       })
       getListMaterial({
        params: {},
        navigate,
        axiosClientJwt,
        dispatch,
       })
       getListWaistband({
        params: {},
        navigate,
        axiosClientJwt,
        dispatch,
       })
   }, [])

   useEffect(() => {
      if(category && category.list.result?.listCategories && !category.list.loading) {
         const optionArray = getCategorySelectName(category.list.result.listCategories)
         setCategorySelect(optionArray)
      } 
      if(brand && brand.list.result?.listBrand && !brand.list.loading) {
         const optionArray = getBrandSelectName(brand.list.result.listBrand)
         setBrandSelect(optionArray)
      }
      if(waistband && waistband.list.result?.listWaistbands && !waistband.list.loading) {
         const optionArray = getWaistbandSelectName(waistband.list.result.listWaistbands)
         setWaistbandSelect(optionArray)
      }
      if(material && material.list.result?.listMaterials && !material.list.loading) {
         const optionArray = getMaterialSelectName(material.list.result.listMaterials)
         setMaterialSelect(optionArray)
      }
   }, [category, material, waistband, brand])

   useEffect(() => {
      if (id) {
         getProduct({
              axiosClientJwt,
              dispatch,
              id: +id,
              navigate
          })
      }
  }, [id])

   const onSubmit = async (data) => {
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
               id: data.brand
            },
            material: {
               id: data.material
            },
            waistband: {
               id: data.waistband
            },
            category: {
               id: data.category
            }
         },
      });
   };

   const handleChange = (info: UploadChangeParam) => {
      if (info.file.status === 'done') {
        // You can access the file path or URL here
      }
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
                  {
                     !id ? (
                        <Form onFinish={handleSubmit(onSubmit)} autoComplete="off">
                        <Flex justifyContent="space-between" alignItems="center">
                           <Flex justifyContent="center" alignItems="center">
                              <Switch checked={enabled} size="small" onChange={() => setEnabled(!enabled)} />
                              <Box as="span" ml={2} fontWeight="semibold">Hoạt động</Box>
                           </Flex>
                           <Button type="primary" htmlType="submit" loading={product.createProduct.loading}>
                              {!id ? "Tạo" : "Cập nhật"}
                           </Button>
                        </Flex>
                        <Divider />
                        <Fragment>
                              <Row gutter={[24, 0]}>
                                 <Col span={19}>
                                    <ProductCreateBasic control={control} errors={errors} setValue={setValue} categorySelect={categorySelect} brandSelect={brandSelect} waistbandSelect={waistbandSelect} materialSelect={materialSelect} />
                                 </Col>
                                 {/* Image */}
                                 <Col span={5}>
                                    <Flex flexDirection={"column"} alignItems={"center"}>
                                       <Box border={"1px solid #dbdbdb"} borderRadius={"10px"} w={"100%"}>
                                          <img
                                             style={{ width: "100%", padding: "10px", height: "300px", objectFit: "contain" }}
                                             src={featuredAsset ? featuredAsset.url : "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132484366.jpg"}
                                          />
                                       </Box>
                                       <Button onClick={() => setIsModalAssetOpen(true)} style={{ marginTop: "10px" }}>
                                          Chọn ảnh
                                       </Button>
                                    </Flex>
                                 </Col>
                              </Row>
                           </Fragment>
                           
                     </Form>
                     ) :   <ProductDetail  />
                  }
                
               </Card>
            </Col>
         </Row>
         <SelectImage
            isModalAssetOpen={isModalAssetOpen}
            setIsModalAssetOpen={setIsModalAssetOpen}
            setFeaturedAsset={setFeaturedAsset}
            featuredAsset={featuredAsset as Asset}
         />
      </Fragment>
   );
};
export default ProductCreate;
