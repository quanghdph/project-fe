/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Boundary } from "@/components/common";
import { CHECKOUT_STEP_1, CHECKOUT_STEP_3 } from "@/constants/routes";
import { Form, Formik } from "formik";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import PropType from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setShippingDetails } from "@/redux/actions/checkoutActions";
import * as Yup from "yup";
import { StepTracker } from "../components";
import withCheckout from "../hoc/withCheckout";
import ShippingForm from "./ShippingForm";
import ShippingTotal from "./ShippingTotal";
import { useForm } from "react-hook-form";

// import "antd/dist/antd.css";
import "antd-button-color/dist/css/style.css";

const FormSchema = Yup.object().shape({
  fullname: Yup.string()
    .required("Full name is required.")
    .min(2, "Full name must be at least 2 characters long.")
    .max(60, "Full name must only be less than 60 characters."),
  email: Yup.string()
    .email("Email is not valid.")
    .required("Email is required."),
  address: Yup.string().required("Shipping address is required."),
  mobile: Yup.object()
    .shape({
      country: Yup.string(),
      countryCode: Yup.string(),
      dialCode: Yup.string().required("Mobile number is required"),
      value: Yup.string().required("Mobile number is required"),
    })
    .required("Mobile number is required."),
  isInternational: Yup.boolean(),
  isDone: Yup.boolean(),
});

const ShippingDetails = ({ profile, shipping, subtotal }) => {
  useDocumentTitle("Check Out Step 2 | YoungBoy");
  useScrollTop();
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    control,
    getValues,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      provinceOption: "",
      districtOption: "",
      wardOption: "",
    },
  });

  const initFormikValues = {
    fullname: "shipping.fullname",
    address: "",
    province: "",
    district: "",
    ward: "",
    note: "",
    phoneNumber: ""
  };

  const onSubmitForm = (form) => {
    dispatch(
      setShippingDetails({
        fullname: form.fullname,
        address: form.address,
        province: form.provinceOption,
        district: form.districtOption,
        ward: form.wardOption,
        note: form.note,
        phoneNumber: form.phoneNumber,
      })
    );
    history.push("/checkout/step3");
  };
  // const onSubmit = (data) => {
  //   console.log("Submitted data:", data);
  //   // Add your form submission logic here
  // };

  return (
    <Boundary>
      <div className="checkout">
        <StepTracker current={2} />
        <div className="checkout-step-2">
          <h3 className="text-center">Địa chỉ giao hàng</h3>
          <Formik
            initialValues={initFormikValues}
            // validateOnChange
            // validationSchema={FormSchema}
            onSubmit={handleSubmit(onSubmitForm)}
          >
            {() => (
              <Form
                layout="vertical"
                autoComplete="off"
                //  onFinish={handleSubmit(onSubmit)}
              >
                <ShippingForm
                  register={register}
                  handleSubmit={handleSubmit}
                  setValue={setValue}
                  watch={watch}
                  trigger={trigger}
                  control={control}
                  getValues={getValues}
                  reset={reset}
                  errors={errors}
                  isValid={isValid}
                  shipping={shipping}
                />
                <br />
                {/*  ---- TOTAL --------- */}
                {/* <ShippingTotal subtotal={subtotal} /> */}
                <br />
                {/*  ----- NEXT/PREV BUTTONS --------- */}
                <div className="checkout-shipping-action">
                  <button
                    className="button button-muted"
                    onClick={() => history.push(CHECKOUT_STEP_1)}
                    type="button"
                  >
                    <ArrowLeftOutlined />
                    &nbsp; Quay lại
                  </button>
                  <button className="button button-icon" type="submit">
                    Bước tiếp theo &nbsp;
                    <ArrowRightOutlined />
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Boundary>
  );
};

ShippingDetails.propTypes = {
  subtotal: PropType.number.isRequired,
  profile: PropType.shape({
    fullname: PropType.string,
    email: PropType.string,
    address: PropType.string,
    mobile: PropType.object,
  }).isRequired,
  shipping: PropType.shape({
    fullname: PropType.string,
    email: PropType.string,
    address: PropType.string,
    mobile: PropType.object,
    isInternational: PropType.bool,
    isDone: PropType.bool,
  }).isRequired,
};

export default withCheckout(ShippingDetails);
