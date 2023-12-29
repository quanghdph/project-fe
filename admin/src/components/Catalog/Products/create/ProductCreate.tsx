import { DatePicker, Input, Select } from 'antd';
import React, { Fragment } from 'react';
import { Control, Controller, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Box, Flex } from '@chakra-ui/react';

interface ProductCreateProps {
    control: Control<any>
    errors: FieldErrors<{ name: string }>
    setValue: UseFormSetValue<any>
    categorySelect: any, 
    materialSelect: any, 
    waistbandSelect: any, 
    brandSelect: any
}
const ProductCreate = ({ control, errors, setValue, categorySelect, materialSelect, waistbandSelect, brandSelect }: ProductCreateProps) => {
    return (
        <Fragment>
            <Box mb={3}>
                <Box as="label" htmlFor='productName' fontWeight="semibold">Tên sản phẩm</Box>
                <Controller
                    name="productName"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, ...other } }) => {
                        return (
                            <Box my={1}>
                                <Input
                                    status={errors?.name ? 'error' : ''}
                                    id='productName'
                                    placeholder='Ví dụ: Bags'
                                    {...other}
                                    value={value || ''}
                                />
                                {errors?.name ? <Box as="span" textColor="red.500">{errors.name?.type === 'required' ? "Vui lòng điền tên sản phẩm!" : errors.name.message}</Box> : null}
                            </Box>
                        )
                    }}
                />
            </Box>
            <Box mb={3}>
                <Box as="span" fontWeight="semibold" mb={1} sx={{ display: "inline-block" }}>Mô tả</Box>
                <Controller
                    name="description"
                    control={control}
                    render={({ field: { value, ...other } }) => {
                        return (
                            <CKEditor
                                editor={ClassicEditor}
                                data={value || ''}
                                onChange={(_event, editor) => {
                                    setValue('description', editor.getData())
                                }}
                            />
                        )
                    }}
                />
            </Box>
            <Box mb={3}>
                <Box as="span" fontWeight="semibold" mb={1} sx={{ display: "inline-block" }}>Danh mục</Box>
                <Controller
                    name="category"
                    control={control}
                    render={({ field: { value, ...other } }) => {
                        return (
                            <Select
                            value={value}
                            onChange={(selectedOption) => {
                                setValue('category', selectedOption); // Update 'category' field
                              }}
                            options={categorySelect}
                          />
                        )
                    }}
                />
            </Box>
            <Box mb={3}>
                <Box as="span" fontWeight="semibold" mb={1} sx={{ display: "inline-block" }}>Thương hiệu</Box>
                <Controller
                    name="brand"
                    control={control}
                    render={({ field: { value, ...other } }) => {
                        return (
                            <Select
                            value={value}
                            onChange={(selectedOption) => {
                                setValue('brand', selectedOption); // Update 'category' field
                              }}
                            options={brandSelect}
                          />
                        )
                    }}
                />
            </Box>
            <Box mb={3}>
                <Box as="span" fontWeight="semibold" mb={1} sx={{ display: "inline-block" }}>Cạp quần</Box>
                <Controller
                    name="waistband"
                    control={control}
                    render={({ field: { value, ...other } }) => {
                        return (
                            <Select
                            value={value}
                            onChange={(selectedOption) => {
                                setValue('waistband', selectedOption); // Update 'category' field
                              }}
                            options={waistbandSelect}
                          />
                        )
                    }}
                />
            </Box>
            <Box mb={3}>
                <Box as="span" fontWeight="semibold" mb={1} sx={{ display: "inline-block" }}>Chất liệu</Box>
                <Controller
                    name="material"
                    control={control}
                    render={({ field: { value, ...other } }) => {
                        return (
                            <Select
                            value={value}
                            onChange={(selectedOption) => {
                                setValue('material', selectedOption); // Update 'category' field
                              }}
                            options={materialSelect}
                          />
                        )
                    }}
                />
            </Box>
         
        </Fragment>
    );
};

export default ProductCreate;