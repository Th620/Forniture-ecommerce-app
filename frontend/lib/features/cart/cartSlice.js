"use client";

import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : {
      items: [],
      totalQuantity: 0,
      totalPrice: 0,
    };
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existItem = state.items.find(
        (item) =>
          item._id === newItem._id &&
          item.color === newItem.color &&
          item.size === newItem.size
      );
      if (!existItem) {
        state.items = [...state.items, action.payload];
        state.totalQuantity += action.payload.quantity;
      } else {
        existItem.quantity += action.payload.quantity;
        state.totalQuantity += action.payload.quantity;
      }
      state.totalPrice += action.payload.price * action.payload.quantity;
      localStorage.setItem("cart", JSON.stringify(state));
    },
    removeItem: (state, action) => {
      const existItem = state.items.find(
        (item) =>
          item._id === action.payload._id &&
          item.color === action.payload.color &&
          item.size === action.payload.size
      );
      if (existItem) {
        state.totalQuantity -= existItem.quantity;
        state.totalPrice -= existItem.quantity * existItem.price;
        state.items = state.items.filter(
          (item) =>
            item._id !== action.payload._id ||
            item.color !== action.payload.color ||
            item.size !== action.payload.size
        );
      }
      localStorage.setItem("cart", JSON.stringify(state));
    },
    increaseQuantity: (state, action) => {
      const existItem = state.items.find(
        (item) =>
          item._id === action.payload._id &&
          item.color === action.payload.color &&
          item.size === action.payload.size
      );
      if (existItem) {
        existItem.quantity++;
        state.totalQuantity++;
        state.totalPrice += existItem.price;
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },
    decreaseQuantity: (state, action) => {
      const existItem = state.items.find(
        (item) =>
          item._id === action.payload._id &&
          item.color === action.payload.color &&
          item.size === action.payload.size
      );
      if (existItem) {
        existItem.quantity--;
        state.totalQuantity--;
        state.totalPrice -= existItem.price;
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },
    clearCart: (state, action) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalQuantity = 0;
      localStorage.removeItem("cart");
    },
  },
});

export const {
  addItem,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
