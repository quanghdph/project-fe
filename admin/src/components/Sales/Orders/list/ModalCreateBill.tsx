import { Modal } from 'antd'
import React from 'react'

function ModalCreateBill({visibleBill, handleBillOk, handleBillCancel}: any) {
  return (
    <Modal
        title="Sample Modal"
        open={visibleBill}
        onOk={handleBillOk}
        onCancel={handleBillCancel}
      >
        <p>This is a sample modal content.</p>
      </Modal>
  )
}

export default ModalCreateBill