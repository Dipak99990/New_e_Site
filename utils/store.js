import { configureStore } from "@reduxjs/toolkit";
import cartSLice from "@/features/cartSLice";

export const store = configureStore({
  reducer: {
    cart: cartSLice,
  },
});
