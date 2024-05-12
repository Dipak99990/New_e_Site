import React, { useEffect, useState } from "react";
import CheckoutWizard from "@/components/CheckoutWizard";
import Layout from "@/components/Layout";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { getError } from "@/utils/error";
import { removeItem } from "@/features/cartSLice";

function PlaceOrder() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { cartItems } = useSelector((store) => store.cart);
  const { shippingAddress, paymentMethod } = useSelector((store) => store.cart);
  console.log(shippingAddress);
  console.log("full Name", shippingAddress.fullName);
  console.log(cartItems);
  const Amt = Number(Cookies.get("total"));
  console.log("amoyunt", Amt);
  const taxNumber = (Amt * 0.01).toFixed(2);
  const txAmt = Number(taxNumber);

  const psc = Amt * 0.05;
  const totalAmount = (Amt + txAmt + psc).toFixed(2);
  const totalAmt = Number(totalAmount);
  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment");
    }
  }, [paymentMethod, router]);
  const [loading, setloading] = useState(false);
  const placeOrderHandler = async () => {
    try {
      setloading(true);

      // Check for required fields
      if (
        !shippingAddress.fullName ||
        !shippingAddress.district ||
        !shippingAddress.city ||
        !shippingAddress.postalcode ||
        !paymentMethod ||
        !Amt ||
        !txAmt ||
        !psc ||
        !totalAmt
      ) {
        throw new Error("Please fill in all required fields.");
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          Amt,
          txAmt,
          psc,
          totalAmt,
        }),
      });

      const data = await response.json();
      console.log("data", data);

      setloading(false);

      console.log("data", data);
      router.push(`order/${data._id}`);
    } catch (err) {
      setloading(false);
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="place order">
      <CheckoutWizard activeStep={3} />
      <h1 className="mb-4 text-xl">Place Order</h1>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty <Link href="/">Go Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Shipping Address</h2>
              <div>
                {shippingAddress.fullName},{shippingAddress.district},
                {shippingAddress.city},{shippingAddress.ward},
                {shippingAddress.postalcode},
              </div>
              <div>
                <Link href="/shipping">Edit</Link>
              </div>
            </div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Payment Method</h2>
              <div>{paymentMethod}</div>
              <div>
                <Link href="/payment">Edit</Link>
              </div>
            </div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Order Sumamry</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items Total</div>
                    <div>Rs{Amt}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax Amount</div>
                    <div>Rs{txAmt}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping Cost</div>
                    <div>Rs{psc}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between primary-button">
                    <div>Total</div>
                    <div>Rs{totalAmt}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 mt-4 flex justify-between ">
                    <button className="default-button">
                      <Link href="/payment">Back</Link>
                    </button>
                    <button className="default-button">
                      <Link href="/cart">Edit Cart</Link>
                    </button>
                    <button
                      className="primary-button"
                      disabled={loading}
                      onClick={placeOrderHandler}
                    >
                      {loading ? "Loading..." : "Place Order"}
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default PlaceOrder;
PlaceOrder.auth = true;
