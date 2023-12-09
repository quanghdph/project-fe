// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @ts-nocheck
import { Box, Flex } from "@chakra-ui/react";
import React, { Fragment, useEffect } from "react";
import { Input, Select } from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import Button from "antd-button-color";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { getValueByName } from "src/hooks/catalog";

const ProductOptionsCreate = ({ control, setVariantItem, setValue, watch, errors }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "option",
    });
    //watch change option
    const watchOption = useWatch({ name: "option", control });
    const watchNameProduct = watch('name');

    useEffect(() => {
        //create input to clien type sku,price, stock, auto fill variant
        if (watchOption?.length > 0) {
            const colorOption = getValueByName(watchOption, "Color")?.value
            const sizeOption = getValueByName(watchOption, "Size")?.value
            const variantArr = []

            if (colorOption && sizeOption) {
                colorOption?.map((color) => {
                    const sizeMap = sizeOption?.map((size) => {
                        const variantCode = `${watchNameProduct}-${color}-${size}`
                        return {
                            variantCode: variantCode,
                        }
                    })
                    sizeMap && variantArr.push(...sizeMap);
                })
            } else if (colorOption) {
                colorOption && colorOption?.map((color) => {
                    const variantCode = `${watchNameProduct}-${color}`
                    return variantArr.push({
                        variantCode: variantCode,
                    })
                })
            } else {
                sizeOption && sizeOption?.map((color) => {
                    const variantCode = `${watchNameProduct}-${color}`
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
    }, [watchOption, watchNameProduct])

    return (
        <Fragment>
            <Flex mb={3} flexDirection={"column"}>
                <Box as="span" fontWeight="semibold" mb={1} sx={{ display: "inline-block" }}>Options</Box>
                {fields.map((field, index) => {
                    return (
                        <Box mb={2}>
                            <Flex key={index} alignItems="center" gap={2} justifyContent="flex-start">
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
                                                <Fragment>
                                                    <Input {...other} value={value || ""} />
                                                </Fragment>
                                            );
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <MinusCircleOutlined onClick={() => remove(index)} />
                                </Box>
                            </Flex>
                            {'option' in errors && errors?.option[index] ? <Box as="span" textColor="red.500">{errors.option[index]?.value?.type === 'required' ? "Vui lòng tạo option!" : errors.option[index].value.message}</Box> : null}
                        </Box>
                    );
                })}
                <Button onClick={() => { append({ name: "", value: "" }) }}>Thêm Option</Button>
            </Flex>
        </Fragment>
    );
};

export default ProductOptionsCreate;