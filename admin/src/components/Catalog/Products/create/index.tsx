// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Inotification } from "src/common";
import React, { Fragment, useState } from "react";
import { Breadcrumb, Col, Row, Card, Form, Switch, Button, Divider, Table, message } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { columns, data } from "./columns";
import { default as ProductCreateBasic } from "./ProductCreate";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { createAxiosJwt } from "src/helper/axiosInstance";
import { createProduct } from "src/features/catalog/product/actions";
import { Box, Flex } from "@chakra-ui/react";
import ProductOptionsCreate from "./ProductOptionsCreate";
import { getValueByName, removeEmpty } from "src/hooks/catalog";
import SelectImage from "../SelectImage";
import { Asset } from "src/types";

const ProductCreate: React.FC = () => {
   const [enabled, setEnabled] = useState<boolean>(true);
   const [variantItem, setVariantItem] = useState<number[]>([]);
   const [productOptions, setProductOptions] = useState<number[]>([]);
   const [featuredAsset, setFeaturedAsset] = useState<Asset>();
   const [isModalAssetOpen, setIsModalAssetOpen] = useState<boolean>(false);

   //** Third party
   const navigate = useNavigate();
   let { id } = useParams();
   const { control, handleSubmit, setValue, setError, getValues, watch, clearErrors, formState: { errors } } = useForm({
      defaultValues: {
         name: "",
         slug: "",
         description: "",
         active: true,
         options: [],
         variant: [],
      },
   });

   //** Variables
   const dispatch = useAppDispatch();
   const axiosClientJwt = createAxiosJwt();
   const product = useAppSelector((state) => state.product);

   const onSubmit = async (data) => {
      const colorOption = data.option && getValueByName(data.option, "Color");
      const sizeOption = data.option && getValueByName(data.option, "Size");
      const options = Object.values(removeEmpty({ colorOption, sizeOption }));
      setProductOptions([...options]);
      if (productOptions.length > 0) {
         await createProduct({
            axiosClientJwt,
            dispatch,
            setError,
            navigate,
            message,
            product: {
               name: data.name,
               description: data.description,
               slug: data.slug,
               active: enabled,
               featured_asset_id: featuredAsset?.id,
               options,
               getValues,
            },
         });
      } else {
         Inotification({
            type: "warning",
            message: "Vui lòng tạo option!",
         });
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
                  <Breadcrumb.Item>Tạo mới</Breadcrumb.Item>
               </Breadcrumb>
            </Col>
            <Col span={24}>
               <Card>
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
                     {!id ? (
                        <Fragment>
                           <Row gutter={[24, 0]}>
                              <Col span={19}>
                                 <ProductCreateBasic control={control} errors={errors} setValue={setValue} />
                                 <ProductOptionsCreate
                                    errors={errors}
                                    control={control}
                                    setProductOptions={setProductOptions}
                                    setVariantItem={setVariantItem}
                                    setValue={setValue}
                                    watch={watch}
                                 />
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
                           <div style={{ marginTop: "1rem" }}>
                              <Table
                                 bordered
                                 columns={columns()}
                                 dataSource={data({
                                    control,
                                    errors,
                                    variantItem,
                                    setValue,
                                    clearErrors
                                 })}
                                 pagination={{ hideOnSinglePage: true }}
                              />
                           </div>
                        </Fragment>
                     ) : (
                        <ProductDetail />
                     )}
                  </Form>
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
