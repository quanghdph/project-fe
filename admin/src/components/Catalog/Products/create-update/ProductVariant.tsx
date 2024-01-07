import React from "react";
import { Button, Form, InputNumber, Select, Table } from "antd";
import { Controller, useForm } from "react-hook-form";
import { Flex } from "@chakra-ui/react";

const { Option } = Select;

const columns: any = (onDeleteVariant) => [
  {
    title: "Màu sắc",
    dataIndex: "color",
    key: "color",
    render: (text, record) => (
      <div>{record.color.label}</div>
    ),
  },
  {
    title: "Kích thước",
    dataIndex: "size",
    key: "size",
    render: (text, record) => (
      <div>{record.size.label}</div>
    ),
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
    key: "quantity",
    render: (text, record) => (
      //   <Form.Item
      //     name={`quantity-${record.size}-${record.color}`}
      //     initialValue={0}
      //   >

      //   </Form.Item>
      <InputNumber min={0} />
    ),
  },
  {
    title: "Giá",
    dataIndex: "price",
    key: "price",
    render: (text, record) => (
      //   <Form.Item name={`price-${record.size}-${record.color}`} initialValue={0}>
      //     <InputNumber min={0} />
      //   </Form.Item>
      <InputNumber min={0} />
    ),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (text, record) => (
      <Select
        defaultValue={{ value: 1, label: "Hoạt động" }}
        options={[
          { value: 0, label: "Vô hiệu hóa" },
          { value: 1, label: "Hoạt động" },
        ]}
      />
    ),
  },
  {
    title: "Hành động",
    dataIndex: "action",
    key: "action",
    render: (text, record) => (
      <Button type="primary" danger>Xóa</Button>
    ),
  }
];

const ProductVariant = (props: any) => {
  const { sizes, colors } = props;
  const { control, handleSubmit, setValue, watch } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    // Add your logic to handle the form submission here
  };

  const renderVariations = () => {
    const selectedSizes = watch("sizes");
    const selectedColors = watch("colors");

    if (!selectedSizes || !selectedColors) return null;

    const data = selectedSizes.flatMap((size) =>
      selectedColors.map((color) => ({
        key: `${size.label}-${color.label}`,
        size,
        color,
      })),
    );

    const onDeleteVariant = (keyToDelete) => {
      // Add your logic to handle the deletion of the variant with the given key
      console.log(`Deleting variant with key: ${keyToDelete}`);
    };

    return <Table columns={columns(onDeleteVariant)} dataSource={data} pagination={false} />;
  };

  return (
    <Form layout="vertical">
      <Flex gap={3}>
        <Form.Item
          label={<div style={{ fontWeight: 600 }}>Kích thước</div>}
          name="sizes"
          style={{width: "49%"}}
        >
          <Controller
            control={control}
            name="sizes"
            render={({ field }) => (
              <Select
                mode="multiple"
                labelInValue
                placeholder="Chọn kích thước"
                onChange={(value) => {
                  return setValue("sizes", value);
                }}
              >
                {sizes.map((size: any) => (
                  <Option key={size.value} value={size.value}>
                    {size.label}
                  </Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>
        <Form.Item
          label={<div style={{ fontWeight: 600 }}>Màu sắc</div>}
          name="colors"
          style={{width: "49%"}}
        >
          <Controller
            control={control}
            name="colors"
            render={({ field }) => (
              <Select
                mode="multiple"
                labelInValue
                placeholder="Chọn màu sắc"
                onChange={(value) => setValue("colors", value)}
              >
                {colors.map((color: any) => (
                  <Option key={color.value} value={color.value}>
                    {color.label}
                  </Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>
      </Flex>

      {renderVariations()}
    </Form>
  );
};

export default ProductVariant;
