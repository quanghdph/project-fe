// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Box, Flex } from "@chakra-ui/react";
import React, { Fragment, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Table, Select, Input, Form, Button, message } from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import { getValueByName, removeEmpty } from "src/hooks/catalog";
import { Inotification } from "src/common";
import { columns, data } from "../create/columns";
import { createProductVariantOption } from "src/features/catalog/product/actions";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { createAxiosJwt } from "src/helper/axiosInstance";

function ManageVariant() {
  const [variantItem, setVariantItem] = useState<number[]>([]);

  const { control, setValue, clearErrors, handleSubmit, getValues, setError, formState: { errors } } = useForm({
    defaultValues: {
      option: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "option" });

  const navigate = useNavigate()
  const params = useParams()

  const dispatch = useAppDispatch();
  const axiosClientJwt = createAxiosJwt();
  const store = useAppSelector((state) => state.product);

  const watchOption = useWatch({ name: "option", control });

  useEffect(() => {
    //create input to clien type sku,price, stock, auto fill variant
    if (watchOption?.length > 0) {
      const colorOption = getValueByName(watchOption, "Color")?.value
      const sizeOption = getValueByName(watchOption, "Size")?.value
      const variantArr = []

      if (colorOption && sizeOption) {
        colorOption?.map((color) => {
          const sizeMap = sizeOption?.map((size) => {
            const variantCode = `${store.single.result?.name}-${color}-${size}`
            return {
              variantCode: variantCode,
            }
          })
          sizeMap && variantArr.push(...sizeMap);
        })
      } else if (colorOption) {
        colorOption && colorOption?.map((color) => {
          const variantCode = `${store.single.result?.name}-${color}`
          return variantArr.push({
            variantCode: variantCode,
          })
        })

      } else {
        sizeOption && sizeOption?.map((color) => {
          const variantCode = `${store.single.result?.name}-${color}`
          return variantArr.push({
            variantCode: variantCode,
          })
        })
      }
      if (variantArr?.length > 0) {
        setVariantItem(variantArr)
        variantArr.forEach((item, index) => {
          setValue(`variant[${index}].name`, item.variantCode);
          setValue(`originPrice[${index}]`, 0);
          setValue(`price[${index}]`, 0);
          setValue(`stock[${index}]`, 0);
        })
      }
    } else {
      setVariantItem([])
    }
  }, [watchOption])

  const onSubmit = async (data) => {
    if (params?.id) {
      const colorOption = data.option && getValueByName(data.option, "Color");
      const sizeOption = data.option && getValueByName(data.option, "Size");
      const options = Object.values(removeEmpty({ colorOption, sizeOption }));
      if (options.length > 0) {
        await createProductVariantOption({
          axiosClientJwt,
          dispatch,
          getValues,
          message,
          navigate,
          options,
          productId: +params?.id,
          setError,
          productName: store.single.result?.name
        })
      } else {
        Inotification({
          type: "warning",
          message: "Vui lòng tạo option!",
        });
      }
    }
  };

  return (
    <Fragment>
      <Form onFinish={handleSubmit(onSubmit)} autoComplete="off">
        <Flex justifyContent='flex-end'>
          <Button type="primary" htmlType="submit" loading={store.createProductVariantOption.loading}>Tạo</Button>
        </Flex>
        <Flex mb={3} flexDirection={"column"}>
          <Box as="span" fontWeight="semibold" mb={1} sx={{ display: "inline-block" }}>Options</Box>
          {fields.map((field, index) => {
            return (
              <Box mb={2}>
                <Flex key={index} alignItems="center" gap={2} justifyContent="flex-start" mb={2}>
                  <Box>
                    <Controller
                      name={`option[${index}].name`}
                      control={control}
                      render={({ field: { value, ...other } }) => {
                        return (
                          <Box>
                            <Select style={{ width: 120 }} value={value} {...other}>
                              <Select.Option value="Size">Kích cỡ</Select.Option>
                              <Select.Option value="Color">Màu</Select.Option>
                            </Select>
                          </Box>
                        );
                      }}
                    />
                  </Box>
                  <Box>
                    <Controller
                      name={`option[${index}].value`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, ...other } }) => {
                        return (
                          <Box>
                            <Input {...other} value={value || ""} />
                          </Box>
                        );
                      }}
                    />
                  </Box>
                  <Box>
                    <MinusCircleOutlined onClick={() => remove(index)} />
                  </Box>
                </Flex>
                {'option' in errors && errors?.option[index] ? <Box as="span" textColor="red.500">{errors.option[index]?.value?.type === 'required' ? "This field is required!" : errors.option[index].value.message}</Box> : null}
              </Box>
            );
          })}
          <Button onClick={() => { append({ name: "", value: "" }) }}>Add Option</Button>
        </Flex>
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
      </Form>
    </Fragment>
  );
}

export default ManageVariant;
