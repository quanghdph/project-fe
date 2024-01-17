import { Button, Tabs, TabsProps } from "antd";
import React, { Fragment, useState } from "react";
import { Inotification } from "src/common";
import OrderDetail from "./OrderDetail";

function generateRandomNumberString(length) {
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomDigit = Math.floor(Math.random() * 10);
    randomString += randomDigit;
  }

  return randomString;
}

function CreateOrder({ cart, setCart, setCustomerSelect, setOrderList, setCurrentTab, currentTab }) {
  const [listOrder, setListOrder] = useState([
    {
      orderCode: `HD${generateRandomNumberString(6)}`,
      cartId: 1,
    },
  ]);

  const onChange = (key: string) => {
    setCurrentTab(Number(key)+1)
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

  const items: TabsProps["items"] = listOrder.map((item, index) => {
    return {
      key: index.toString(),
      label: item.orderCode,
      children: (
        <OrderDetail
          orderCode={item.orderCode}
          cart={cart}
          setCart={setCart}
          setCustomerSelect={setCustomerSelect}
          currentTab={currentTab}
        />
      ),
    };
  });

  const handleCreateOrder = () => {
    const orderCode = `HD${generateRandomNumberString(6)}`;
    if (listOrder.length < 5) {
      const newCartId = listOrder.length + 1;
      setListOrder([
        ...listOrder,
        {
          orderCode: orderCode,
          cartId: newCartId,
        },
      ]);
      setOrderList([
        ...listOrder,
        {
          orderCode: orderCode,
          cartId: newCartId,
        },
      ]);
    } else {
      Inotification({
        type: "error",
        message: "Chỉ được tạo 5 đơn hàng!",
      });
    }
  };

  return (
    <Fragment>
      <Button type="primary" onClick={handleCreateOrder}>
        Tạo mới đơn hàng
      </Button>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </Fragment>
  );
}

export default CreateOrder;
