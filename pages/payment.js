import CheckoutWizard from "@/components/CheckoutWizard";
import Layout from "@/components/Layout";
import { save_paymentmethod } from "@/features/cartSLice";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Payment() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedPaymentMethod, setselectedPaymentMethod] = useState("");
  const { paymentMethod, shippingAddress } = useSelector((state) => state.cart);
  console.log("PAYMENT", paymentMethod, shippingAddress);
  const paymentUrls = {
    // add other payment methods and their URLs here
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      return toast.error("Payment Method is Required");
    }
    dispatch(save_paymentmethod(selectedPaymentMethod));
    Cookies.set(
      "cart",
      JSON.stringify({
        paymentMethod: selectedPaymentMethod,
      })
    );

    router.push("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress) {
      router.push("/shipping");
    } else {
      setselectedPaymentMethod(paymentMethod || "");
    }
    console.log("useeffect");
  }, [paymentMethod, router, shippingAddress]);
  console.log("paymentmethod", paymentMethod);
  return (
    <Layout title="Payment">
      <CheckoutWizard activeStep={2} />
      <form className="mx-auto max-w-screen-md" onSubmit={handleSubmit}>
        <h1 className="mb-4 text-xl">Payment Method</h1>
        {["Khalti", "CashOnDelivery"].map((payment) => {
          return (
            <div key={payment} className="mb-4">
              <input
                name="paymentMethod"
                className="p-2 outline-none focus:ring-0"
                id={payment}
                type="radio"
                checked={selectedPaymentMethod === payment}
                onChange={() => setselectedPaymentMethod(payment)}
              />
              <label className="p-2" htmlFor={payment}>
                {payment}
              </label>
            </div>
          );
        })}

        <div className="mb-4 flex justify-between">
          <button
            onClick={() => router.push("/shipping")}
            type="button"
            className="default-button"
          >
            Back
          </button>
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
}

export default Payment;
Payment.auth = true;
