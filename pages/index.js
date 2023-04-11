import Layout from "@/components/Layout";
import ProductItem from "@/components/ProductItem";
import { addToCart, increase } from "@/features/cartSLice";
import Product from "@/models/Product";
import db from "@/utils/db";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

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
  return (
    <>
      <Layout title="home page">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductItem
              product={product}
              key={product.slug}
              addItemClick={addItemClick}
            ></ProductItem>
          ))}
        </div>
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
