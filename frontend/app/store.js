import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../lib/features/user/userSlice";
import cartReducer from "../lib/features/cart/cartSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
  },
});
