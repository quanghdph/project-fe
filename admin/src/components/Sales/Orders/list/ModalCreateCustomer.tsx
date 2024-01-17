import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal, Form, Input, Select, Button } from "antd";

const { Option } = Select;

const ModalCreateCustomer = ({ visible, onCreate, onCancel }) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const handleCreate = (data) => {
    onCreate(data);
    reset(); // Reset the form after successful submission
  };

  const onSubmit = (data) => {
    handleCreate(data);
  };

  return (
    <Modal
      open={visible}
      title="Thêm mới khách hàng"
      okText="Xác nhận"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={handleSubmit(onSubmit)}
    >
      <Form layout="vertical">
        <Form.Item
          label="Họ"
          validateStatus={errors.firstName ? "error" : ""}
          help={errors.firstName && errors.firstName.message}
        >
          <Controller
            name="firstName"
            control={control}
            rules={{ required: "Vui lòng điền họ" }}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="Tên"
          validateStatus={errors.lastName ? "error" : ""}
          help={errors.lastName && errors.lastName.message}
        >
          <Controller
            name="lastName"
            control={control}
            rules={{ required: "Vui lòng điền tên!" }}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="Email"
          // validateStatus={errors.email ? 'error' : ''}
          // help={errors.email && errors.email.message}
        >
          <Controller
            name="email"
            control={control}
            // rules={{
            //   required: 'Vui lòng điền email!',
            //   pattern: {
            //     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            //     message: 'Invalid email address',
            //   },
            // }}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="Giới tính"
          validateStatus={errors.gender ? "error" : ""}
          help={errors.gender && errors.gender.message}
        >
          <Controller
            name="gender"
            control={control}
            rules={{ required: "Vui lòng chọn giới tính!" }}
            render={({ field }) => (
              <Select {...field}>
                <Option value="1">Nam</Option>
                <Option value="0">Nữ</Option>
              </Select>
            )}
          />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          validateStatus={errors.phoneNumber ? "error" : ""}
          help={errors.phoneNumber && errors.phoneNumber.message}
        >
          <Controller
            name="phoneNumber"
            control={control}
            rules={{
              required: "Vui lòng nhập số điện thoại!",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Số điện thoại không hợp lệ",
              },
            }}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateCustomer;
