import { Input } from 'antd';
import React, { Fragment } from 'react';
import { Control, Controller, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Box } from '@chakra-ui/react';

interface ProductCreateProps {
    control: Control<any>
    errors: FieldErrors<{ name: string }>
    setValue: UseFormSetValue<any>
}
const ProductCreate = ({ control, errors, setValue }: ProductCreateProps) => {
    return (
        <Fragment>
            <Box mb={3}>
                <Box as="label" htmlFor='name' fontWeight="semibold">Tên sản phẩm</Box>
                <Controller
                    name="name"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, ...other } }) => {
                        return (
                            <Box my={1}>
                                <Input
                                    status={errors?.name ? 'error' : ''}
                                    id='name'
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
        </Fragment>
    );
};

export default ProductCreate;