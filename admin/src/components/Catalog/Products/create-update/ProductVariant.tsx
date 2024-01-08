import React, { useState, useEffect } from "react";
import { Button, Form, InputNumber, Select, Table } from "antd";
import { Controller, useForm } from "react-hook-form";
import { Flex } from "@chakra-ui/react";
import { set } from "lodash";

const { Option } = Select;

const ProductVariant = (props: any) => {
  const { sizes, colors ,setTableData,tableData} = props;
  const { control, setValue, watch } = useForm();


  const handleQuantityChange = (key, value) => {
    const updatedData = tableData.map((item) =>
      item.key === key ? { ...item, quantity: value } : item
    );
    setTableData(updatedData);
  };

  const handlePriceChange = (key, value) => {
    const updatedData = tableData.map((item) =>
      item.key === key ? { ...item, price: value } : item
    );
    setTableData(updatedData);
  };

  const handleStatusChange = (key, value) => {
    const updatedData = tableData.map((item) =>
      item.key === key ? { ...item, status: value } : item
    );
    setTableData(updatedData);
  };

  const renderVariations = () => {
 
    const selectedSizes = watch("sizes");
    const selectedColors = watch("colors");

    if (!selectedSizes || !selectedColors) return [];

    let data = selectedSizes.flatMap((size) =>
      selectedColors.map((color) => {
        const existingItem = tableData.find(
          (item) => item.key === `${size.label}-${color.label}`
        );

        if (existingItem) {
          return existingItem;
        } else {
          return {
            key: `${size.label}-${color.label}`,
            size,
            color,
            quantity: 0,
            price: 0,
            status: 1,
          };
        }
      })
    );
    setTableData(data)
  };


  const onDeleteVariant = (keyToDelete) => {
    setTableData((prevData) =>
      prevData.filter((item) => item.key !== keyToDelete)
    );
  };

  const columns = [
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      render: (text, record) => <div>{record.color.label}</div>,
    },
    {
      title: "Kích thước",
      dataIndex: "size",
      key: "size",
      render: (text, record) => <div>{record.size.label}</div>,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) => (
        <InputNumber
          min={0}
          value={record.quantity}
          onChange={(value) => handleQuantityChange(record.key, value)}
        />
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text, record) => (
        <InputNumber
          min={0}
          value={record.price}
          onChange={(value) => handlePriceChange(record.key, value)}
        />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Select
          name="status"
          defaultValue={{ value: 1, label: "Hoạt động" }}
          onChange={(value) => handleStatusChange(record.key, value)}
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
        <Button onClick={() => onDeleteVariant(record.key)} danger>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <Form layout="vertical">
      <Flex gap={3}>
        <Form.Item
          label={<div style={{ fontWeight: 600 }}>Kích thước</div>}
          name="sizes"
          style={{ width: "49%" }}
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
                  setValue("sizes",value);
                  renderVariations();
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
          style={{ width: "49%" }}
        >
          <Controller
            control={control}
            name="colors"
            render={({ field }) => (
              <Select
                mode="multiple"
                labelInValue
                placeholder="Chọn màu sắc"
                onChange={(value) => {setValue("colors",value);renderVariations()}}
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

      <Table columns={columns} dataSource={tableData} pagination={false} />
    </Form>
  );
};

export default ProductVariant;
