import React from 'react';
import { Result, Button } from 'antd';
// import "antd/dist/antd.css";
import "antd-button-color/dist/css/style.css";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const PaymentSuccess = () => {
    const history = useHistory();
  return (
    <Result
        style={{padding: "150px 32px"}}
      status="success"
      title="Payment Successful"
      subTitle="Your payment has been successfully processed."
      extra={[
        <Button onClick={() =>  history.push('/')} type="primary" key="home">
          Về trang chủ
        </Button>
      ]}
    />
  );
};

export default PaymentSuccess;
