import { Modal } from 'antd'
import React from 'react'
import { useForm } from 'react-hook-form';

function ModalCreateBill({visibleBill, onCreate, onCancel, onOk, reset}: any) {

  const handleCreate = (data) => {
    onCreate(data);
    reset(); // Reset the form after successful submission
  };

  const onSubmit = (data) => {
    handleCreate(data);
    
  };

  return (
    <Modal
    title="Hóa đơn"
    okText="Đồng ý"
    cancelText="Hủy"
    onOk={handleOk}
    onCancel={handleCancel}
      >
        <p>Bạn có muốn thanh toán hóa đơn không?</p>
      </Modal>
  )
}

export default ModalCreateBill