import React from "react";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";

import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { increase, addToCart } from "@/features/cartSLice";
import db from "@/utils/db";
import Product from "@/models/Product";
import { toast } from "react-toastify";
function ProductScreen(props) {
  const { product } = props;
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const router = useRouter();

  if (!product) {
    return (
      <Layout
        title="not found
    /"
      >
        {" "}
        Product Not found
      </Layout>
    );
  }
  const addItemClick = async () => {
    // Move slug initialization here
    const response = await fetch(`/api/products/${product._id}`);
    const data = await response.json();
    const { countInStock, slug } = data;
    const cartItem = cartItems.find((item) => item.slug === slug);

    console.log("countinstock", countInStock, slug);
    console.log("cartitems", { ...cartItem }, cartItem?.quantity);

    // Check if the quantity in the cart exceeds the count in stock
    if (cartItem && cartItem.quantity >= countInStock) {
      toast.error("Sorry!, Product Out of Stock");
    }

    dispatch(increase());
    dispatch(
      addToCart({
        slug: data.slug,
        price: data.price,
        image: data.image,
        name: data.name,
      })
    );

    toast.success("Product added to cart Successfully");
    router.push("/cart");
  };

  return (
    <>
      <Layout title={product.name}>
        <div className="py-2">
          <Link href="/">Back To Products</Link>{" "}
        </div>
        <div className="grid md:grid-cols-4 md:gap-3">
          <div className="md:col-span-2">
            <Image
              src={product.image}
              alt={product.name}
              width={640}
              height={640}
            />
          </div>
          <div
            className="md:col-span-1
          "
          >
            <ul>
              <li>
                <h1 className="text-xl font-semibold">{product.name}</h1>
              </li>
              <li>
                <span className="font-medium">Category: </span>
                {product.category}
              </li>

              <li>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-2xl mr-1 ${
                        i < product.rating ? "text-yellow-400" : "text-gray-400"
                      }`}
                    >
                      &#9733;
                    </span>
                  ))}
                </div>
              </li>
              <li>{product.description}</li>
            </ul>
          </div>
          <div className="md:col-span-1">
            <div className="card p-5">
              <div className="mb-2 flex justify-between">
                <div>Price</div>
                <div>Rs{product.price}</div>
              </div>
              <div className="mb-2 flex justify-between">
                <p>Status</p>
                <div>
                  {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                </div>
              </div>
              <button className="primary-button w-full" onClick={addItemClick}>
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertdoctoobj(product) : null,
    },
  };
}

export default ProductScreen;
