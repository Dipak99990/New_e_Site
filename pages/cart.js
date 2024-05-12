import Layout from "@/components/Layout";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";

import { XCircleIcon } from "@heroicons/react/outline";

import { useSelector, useDispatch } from "react-redux";
import { removeItem, save_total } from "@/features/cartSLice";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";

function CartScreen() {
  const [products, setProducts] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch(`/api/products`);
      const data = await response.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);
  const getProductBySlug = (slug) => {
    return products.find((p) => p.slug === slug);
  };

  const subtotal = cartItems
    ? cartItems.reduce((acc, item) => {
        const product = getProductBySlug(item.slug);
        if (product) {
          return acc + product.price * item.quantity;
        }
        return acc;
      }, 0)
    : 0;

  const handleCheckOut = () => {
    dispatch(save_total(subtotal));
    Cookies.set("total", subtotal);

    router.push("login?redirect=/shipping");
  };
  return (
    <Layout>
      <h1 className="mb-text-xl">
        <Link href="/" className="font-bold">
          Continue Shopping{" "}
        </Link>{" "}
      </h1>
      {!cartItems || cartItems.length === 0 ? (
        <div>
          Cart is Empty continue Shopping{" "}
          <Link href="/" className="font-bold">
            Home
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div
            className="overflow-x-auto md:col-span-3
            "
          >
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-5 text-left">Item</th>
                  <th className="p-5 text-right">Quantity</th>
                  <th className="p-5 text-right">Price</th>
                  <th className="p-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => {
                  const product = getProductBySlug(item.slug);
                  return (
                    <tr key={item.slug} className="border-b">
                      <td>
                        {product && (
                          <Link href={`/product/${item.slug}`}>
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={50}
                              height={50}
                            />
                            &nbsp;
                            {product.name}
                          </Link>
                        )}
                      </td>
                      <td className="p-5 text-right">{item.quantity}</td>
                      <td className="p-5 text-right">
                        {product && `Rs${product.price * item.quantity}`}
                      </td>
                      <td className="p-5 text-center">
                        <button
                          className="h-9 w-4 font-medium"
                          onClick={() =>
                            dispatch(removeItem({ slug: item.slug }))
                          }
                        >
                          <XCircleIcon />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="card p-5">
            <ul>
              <li>
                <div className="pb-3 text-xl">subtotal</div>Rs{subtotal}
              </li>
              <li>
                <button
                  className="primary-button w-full"
                  onClick={handleCheckOut}
                >
                  Check Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
