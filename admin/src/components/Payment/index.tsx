import { Button } from 'antd';
import React, { useEffect } from 'react';
import { data } from '../Catalog/Products/create/columns';

const Payment = () => {
    return (
        <div>
            <Button
                onClick={() => {
                    const accessToken = localStorage.getItem("accessToken")
                    fetch("http://localhost:1234/order/payment", {
                        method: "Post",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`
                        },
                        body: JSON.stringify({
                            "address_id": 1,
                            "payment_method": "Card",
                            "product_variant_id": 2,
                            "quantity": 2,
                            "promotion_id": 1
                        })
                    }).then((response) => response.json()).then((data) => {
                        window.location.replace(data.paymentUrl);
                    });
                }}
            >Payment
            </Button>
        </div>
    );
};

export default Payment;