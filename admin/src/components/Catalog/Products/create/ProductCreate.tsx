import { DatePicker, Input } from 'antd';
import React, { Fragment } from 'react';
import { Control, Controller, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Box, Flex } from '@chakra-ui/react';

interface ProductCreateProps {
    control: Control<any>
    errors: FieldErrors<{ name: string }>
    setValue: UseFormSetValue<any>
}
const ProductCreate = ({ control, errors, setValue }: ProductCreateProps) => {
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
                <Box as="label" htmlFor='productCode' fontWeight="semibold">Mã sản phẩm</Box>
                <Controller
                    name="productCode"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, ...other } }) => {
                        return (
                            <Box my={1}>
                                <Input
                                    status={errors?.name ? 'error' : ''}
                                    id='productCode'
                                    placeholder='EST359'
                                    {...other}
                                    value={value || ''}
                                />
                                {errors?.name ? <Box as="span" textColor="red.500">{errors.name?.type === 'required' ? "Vui lòng điền tên sản phẩm!" : errors.name.message}</Box> : null}
                            </Box>
                        )
                    }}
                />
            </Box>
           <Flex gap={4}>
           <Box mb={3}>
                <Box as="label" htmlFor='createDate' fontWeight="semibold">Ngày Tạo</Box>
                <Controller
                    name="createDate"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, ...other } }) => {
                        return (
                            <Box my={1}>
                                <DatePicker
                                  id='createDate    '
                                  value={value || ''}
                                  {...other}
                                />
                                {errors?.name ? <Box as="span" textColor="red.500">{errors.name?.type === 'required' ? "Vui lòng điền tên sản phẩm!" : errors.name.message}</Box> : null}
                            </Box>
                        )
                    }}
                />
            </Box>
            <Box mb={3}>
                <Box as="label" htmlFor='updateDate' fontWeight="semibold">Ngày Sửa</Box>
                <Controller
                    name="updateDate"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, ...other } }) => {
                        return (
                            <Box my={1}>
                                <DatePicker
                                  id='updateDate'
                                  value={value || ''}
                                  {...other}
                                />
                                {errors?.name ? <Box as="span" textColor="red.500">{errors.name?.type === 'required' ? "Vui lòng điền tên sản phẩm!" : errors.name.message}</Box> : null}
                            </Box>
                        )
                    }}
                />
            </Box>
           </Flex>
        </Fragment>
    );
};

export default ProductCreate;