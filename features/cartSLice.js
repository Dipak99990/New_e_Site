import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const cartItemsFromCookie = Cookies.get("cartItems")
  ? JSON.parse(Cookies.get("cartItems"))
  : [];
const amountFromCookie = Cookies.get("amount") ?? 0;

const initialState = {
  cartItems: cartItemsFromCookie,
  shippingAddress: {
    fullName: "",
    district: "",
    city: "",
    ward: "",
    postalcode: "",
  },
  paymentMethod: "",
  amount: amountFromCookie,
  total: 0,
  isLoading: true,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    increase: (state) => {
      state.amount += 1;
      // Set the amount as a cookie
      Cookies.set("amount", state.amount);
    },

    addToCart: (state, action) => {
      const { slug, price, image, name } = action.payload;
      const existingItem = state.cartItems.find((item) => item.slug === slug);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({ slug, quantity: 1, price, image, name });
      }

      Cookies.set("cartItems", JSON.stringify(state.cartItems));
    },

    removeItem: (state, action) => {
      const { slug } = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.slug !== slug);
      Cookies.set("cartItems", JSON.stringify(state.cartItems));

      const amount = state.cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.amount = amount;
      Cookies.set("amount", amount);
    },

    cartReset: () => {
      return { ...initialState };
    },

    save_shipping: (state, action) => {
      state.shippingAddress = action.payload;
    },
    save_paymentmethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    save_total: (state, action) => {
      state.total = action.payload;
    },
  },
});

export const {
  increase,
  addToCart,
  removeItem,
  cartReset,
  save_shipping,
  save_paymentmethod,
  save_total,
} = cartSlice.actions;
export default cartSlice.reducer;
