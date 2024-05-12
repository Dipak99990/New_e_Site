import Layout from "@/components/Layout";
import ProductItem from "@/components/ProductItem";
import { addToCart, increase } from "@/features/cartSLice";
import Product from "@/models/Product";
import db from "@/utils/db";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Link from "next/link";

export default function Home({ products }) {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const addItemClick = async (product) => {
    // Move slug initialization here
    const response = await fetch(`/api/products/${product._id}`);
    const data = await response.json();
    const { countInStock, slug } = data;
    const cartItem = cartItems.find((item) => item.slug === slug);

    console.log("countinstock", countInStock, slug);
    console.log("cartitems", { ...cartItem }, cartItem?.quantity);

    // Check if the quantity in the cart exceeds the count in stock
    if (cartItem && cartItem.quantity >= countInStock) {
      return toast.error("sorry,the product is out of stock");
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
    toast.success("Product added to cart successfully");
  };
  const [searchTerm, setSearchTerm] = useState(""); // Initialize state for search term

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Update search term state with input value
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  ); // Filter products array based on search term

  return (
    <>
      <Layout
        title="home page"
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      >
        {filteredProducts.length ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 w-full mx-auto">
            {filteredProducts.map((product) => (
              <ProductItem
                product={product}
                key={product.slug}
                addItemClick={addItemClick}
                className="mx-auto"
              ></ProductItem>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-6xl font-bold text-gray-800">Oops!</h1>
            <p className="text-2xl text-gray-600 mt-4">
              We couldn't find the page you were looking for.
            </p>
            <Link href="/" legacyBehavior>
              <a className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg">
                Return to Home
              </a>
            </Link>
          </div>
        )}
      </Layout>
    </>
  );
}
export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertdoctoobj),
    },
  };
}
