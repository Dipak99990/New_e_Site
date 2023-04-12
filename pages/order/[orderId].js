import Layout from "@/components/Layout";
import { getError } from "@/utils/error";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useReducer, useState } from "react";
import KhaltiCheckout from "khalti-checkout-web";
import { toast } from "react-toastify";
function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function OrderId() {
  const { query } = useRouter();
  const router = useRouter();
  const [notPaid, setnotPaid] = useState(true);
  const orderId = query.orderId;
  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [orderId, order]);
  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    Amt,
    txAmt,
    psc,
    totalAmt,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  const verifypay = async (orderId) => {
    try {
      const response = await axios.put(`/api/orders/${orderId}/pay`);
      const data = response.data;
      if (data.message) {
        toast.success(data.message);
      }
    } catch (error) {
      console.log("verifypay error:", error);
    }
  };

  const config = {
    // replace the publicKey with yours
    publicKey: "test_public_key_989db45118bf48209634b18ba40e5e10",
    productIdentity: { orderId }.toString(),
    productName: "abcedf",
    productUrl: `http://gameofthrones.com/buy/Dragons`,
    paymentPreference: [
      "KHALTI",
      "EBANKING",
      "MOBILE_BANKING",
      "CONNECT_IPS",
      "SCT",
    ],
    eventHandler: {
      onSuccess(payload) {
        // hit merchant api for initiating verfication
        verifypay(orderId);
        toast.success("Amount Success fully Paid");
        location.reload();
        console.log("response", payload);
      },
      onError(error) {
        console.log(error);
      },
      onClose() {
        console.log("widget is closing");
      },
    },
  };
  let checkout = new KhaltiCheckout(config);
  const handlePayment = () => {
    checkout.show({ amount: totalAmt * 100 });
  };

  return (
    <Layout title={`Order ${orderId}`}>
      <h1 className="mb-4 text-xl">{`Order ${orderId}`}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-errror">{error}</div>
      ) : (
        <div className="grid md:grid-cols-5 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Shipping Address</h2>
              <div>
                {shippingAddress.fullName},{shippingAddress.district},
                {shippingAddress.city},{shippingAddress.ward},
                {shippingAddress.postalcode},
              </div>
              {isDelivered ? (
                <div className="alert-success">Delivered at {deliveredAt}</div>
              ) : (
                <div className="alert-error">Not Delivered</div>
              )}
            </div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Payment Method</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className="alert-success">Paid at {paidAt}</div>
              ) : (
                <div className="alert-error">Not Paid</div>
              )}
            </div>
            <div className="card overflow-x-auto p-5">
              <h2 className="mb-2 text-lg">Order Items</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Item</th>
                    <th className="    p-5 text-right">Quantity</th>
                    <th className="  p-5 text-right">Price</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td>
                        <Link href={`/product/${item.slug}`} legacyBehavior>
                          <a className="flex items-center">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            ></Image>
                            &nbsp;
                            {item.name}
                          </a>
                        </Link>
                      </td>
                      <td className=" p-5 text-right">{item.quantity}</td>
                      <td className="p-5 text-right">${item.price}</td>
                      <td className="p-5 text-right">
                        ${item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card p-5">
            <h2 className="mb-2 text-lg">Order Summary</h2>
            <ul>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Items</div>
                  <div>${Amt}</div>
                </div>
              </li>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Tax Price</div>
                  <div>${txAmt}</div>
                </div>
              </li>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Shipping Price</div>
                  <div>${psc}</div>
                </div>
              </li>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Total Price</div>
                  <div>${totalAmt}</div>
                </div>
              </li>
              <li>
                <div className="w-full">
                  {notPaid ? (
                    <button className="khalti-button" onClick={handlePayment}>
                      Pay with Khalti
                    </button>
                  ) : (
                    <span className="text-white bg-green-400 p-2">Paid</span>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default OrderId;
OrderId.auth = true;
