import { CHECKOUT_STEP_1 } from "@/constants/routes";
import { Form, Formik } from "formik";
import { displayActionMessage } from "@/helpers/utils";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import PropType from "prop-types";
import React from "react";
import { Redirect } from "react-router-dom";
import * as Yup from "yup";
import { StepTracker } from "../components";
import withCheckout from "../hoc/withCheckout";
import CreditPayment from "./CreditPayment";
import PayPalPayment from "./PayPalPayment";
import Total from "./Total";
import axios from 'axios'

export const createSellon = async ({ params }) => {
  try {
    console.log(params);
    const { phoneNumber, address, city, district, ward, sanPhams, note } = params;
    const accessToken = localStorage.getItem("access_token");
    const res = await axios.post(
      `/sellon`,
      {
        phoneNumber,
        address,
        city,
        district,
        ward,
        note,
        sanPhams,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (res?.status === 200 && res?.data) {
      setTimeout(function () {
        console.log(res.data);
        // message.success("Thanh toán thành công!");
        // navigate("/catalog/selloffs");
      }, 1000);
    } else {
    }
  } catch (error) {
    // Inotification({
    //   type: "error",
    //   message: error.response.data,
    // });
  }
};

const FormSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, "Name should be at least 4 characters.")
    .required("Name is required"),
  cardnumber: Yup.string()
    .min(13, "Card number should be 13-19 digits long")
    .max(19, "Card number should only be 13-19 digits long")
    .required("Card number is required."),
  expiry: Yup.date().required("Credit card expiry is required."),
  ccv: Yup.string()
    .min(3, "CCV length should be 3-4 digit")
    .max(4, "CCV length should only be 3-4 digit")
    .required("CCV is required."),
  type: Yup.string().required("Please select paymend mode"),
});

const Payment = ({ shipping, payment, subtotal, basket }) => {
  useDocumentTitle("Check Out Final Step | YoungBoy");
  useScrollTop();

  const initFormikValues = {
    name: payment.name || "",
    cardnumber: payment.cardnumber || "",
    expiry: payment.expiry || "",
    ccv: payment.ccv || "",
    type: payment.type || "paypal",
  };

  const onConfirm = () => {
    // displayActionMessage('Feature not ready yet :)', 'info');
    console.log(123132);
    const cartArr = basket.map((item) => {
      return {
        id: item.productDetail.id,
        quantity: item.productDetail.cartQuantity,
      };
    });
    createSellon({
      params: {
        phoneNumber: "0988373635",
        address: shipping.address,
        city: shipping.province,
        district: shipping.district,
        ward: shipping.ward,
        paymentType: 1,
        note: shipping.note,
        sanPhams: cartArr,
      },
    });
    console.log(shipping);
    console.log(basket);
  };

  // if (!shipping || !shipping.isDone) {
  //   return <Redirect to={CHECKOUT_STEP_1} />;
  // }

  return (
    <div className="checkout">
      <StepTracker current={3} />
      <Formik
        initialValues={initFormikValues}
        validateOnChange
        // validationSchema={FormSchema}
        // validate={(form) => {
        //   if (form.type === "paypal") {
        //     displayActionMessage("Feature not ready yet :)", "info");
        //   }
        // }}
        onSubmit={onConfirm}
      >
        {() => (
          <Form className="checkout-step-3">
            <CreditPayment />
            <PayPalPayment />
            <Total
              isInternational={shipping.isInternational}
              subtotal={subtotal}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

Payment.propTypes = {
  shipping: PropType.shape({
    isDone: PropType.bool,
    isInternational: PropType.bool,
  }).isRequired,
  payment: PropType.shape({
    name: PropType.string,
    cardnumber: PropType.string,
    expiry: PropType.string,
    ccv: PropType.string,
    type: PropType.string,
  }).isRequired,
  subtotal: PropType.number.isRequired,
};

export default withCheckout(Payment);
