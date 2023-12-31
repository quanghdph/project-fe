import { Button, Tabs, TabsProps } from 'antd'
import React, { Fragment, useState } from 'react'
import { Inotification } from 'src/common';
import OrderDetail from './OrderDetail';

function generateRandomNumberString(length) {
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomDigit = Math.floor(Math.random() * 10);
    randomString += randomDigit;
  }

  return randomString;
}

function CreateOrder({cart, setCart}) {
  const [listOrder, setListOrder] = useState(["HD15030032"])
  
  const onChange = (key: string) => {
    console.log(key);
  };
  
  // const items: TabsProps['items'] = [
  //   {
  //     key: '1',
  //     label: 'Tạo mới',
  //     children: 123,
  //   },
  //   {
  //     key: '2',
  //     label: 'Danh sách hóa đơn',
  //     children: 123,
  //   },
  // ];  

  const items: TabsProps['items'] = listOrder.map((item, index) => {
    return {
      key: index.toString(),
      label: item,
      children: <OrderDetail orderCode={item} cart={cart} setCart={setCart} />
    }
  })

  const handleCreateOrder = () => {
    const orderCode = `HD${generateRandomNumberString(6)}`
    if (listOrder.length < 1) {
      setListOrder([...listOrder, orderCode]);
    } else {
      Inotification({
        type: "error",
        message: "Chỉ được tạo 1 đơn hàng!",
      });
    }
  }

  return (
    <Fragment>
          <Button type="primary" onClick={handleCreateOrder}>Tạo mới đơn hàng</Button>
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </Fragment>
  )
}

export default CreateOrder