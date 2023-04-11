import CheckoutWizard from "@/components/CheckoutWizard";
import Layout from "@/components/Layout";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { save_shipping } from "@/features/cartSLice";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

function Shipping() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { shippingAddress } = useSelector((state) => state.cart);
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();
  const SubmitForm = () => {
    const { fullName, district, city, ward, postalcode } = getValues();
    dispatch(save_shipping({ fullName, district, city, ward, postalcode }));
    Cookies.set(
      "cart",
      JSON.stringify({
        shippingAddress: { fullName, district, city, ward, postalcode },
      })
    );
    router.push("/payment");
  };
  const valueSet = () => {
    if (shippingAddress) {
      setValue("fullName", shippingAddress.fullName);
      setValue("district", shippingAddress.district);
      setValue("city", shippingAddress.city);
      setValue("ward", shippingAddress.ward);
      setValue("postalcode", shippingAddress.postalcode);
    }
  };
  useEffect(() => {
    console.log("useEffect called");
    valueSet();
    console.log("shippingAddress", shippingAddress);
  }, [setValue, shippingAddress]);

  console.log("shippingAddress", shippingAddress);

  return (
    <Layout title="shipping">
      <CheckoutWizard activeStep={1} />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(SubmitForm)}
      >
        <h1 className="mb-4 text-xl">Shipping Address</h1>
        <div className="mb-4">
          <label htmlFor="fullname">Full Name</label>
          <input
            className="w-full rounded"
            autoFocus
            type="text"
            id="fullname"
            {...register("fullName", {
              required: "Please Enter Full Name",
              minLength: {
                value: 8,
                message: "Name Should Be More Than 8 Characters",
              },
            })}
          />
          {errors.fullName && (
            <div className="text-red-500">{errors.fullName.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="district">District</label>
          <input
            className="w-full rounded"
            autoFocus
            type="text"
            id="district"
            {...register("district", {
              required: "Please Enter Valid District",
            })}
          />
          {errors.district && (
            <div className="text-red-500">{errors.district.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="city">City/Town/Nagarpalika/Gaunpalika</label>
          <input
            className="w-full rounded"
            autoFocus
            type="text"
            id="city"
            {...register("city", {
              required: "Please Enter Valid city",
            })}
          />
          {errors.city && (
            <div className="text-red-500">{errors.city.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="ward">Ward</label>
          <input
            className="w-full rounded"
            autoFocus
            type="number"
            id="ward"
            {...register("ward", {
              required: "Please Enter Valid ward",
              maxLength: {
                value: 2,
                message: "Ward Should Be Less Than 2 digits",
              },
            })}
          />
          {errors.ward && (
            <div className="text-red-500">{errors.ward.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="postalcode">Postal Code</label>
          <input
            className="w-full rounded"
            autoFocus
            type="text"
            id="postalcode"
            {...register("postalcode", {
              required: "Please Enter Valid postalcode",
            })}
          />
          {errors.postalcode && (
            <div className="text-red-500">{errors.postalcode.message}</div>
          )}
        </div>
        <div className="mb-4 flex justify-between">
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
}

export default Shipping;
Shipping.auth = true;
