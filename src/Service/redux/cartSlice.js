import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [], // Array to store cart items
    totalQuantity: 0, // Total quantity of items in the cart
    totalPrice: 0, // Total price of items in the cart
  },
  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload;

      // Check if item already exists in the cart
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (!existingItem) {
        // Add new item to the cart
        state.items.push(newItem);
      }

      // Debug log to inspect the updated cart items
      console.log("Updated cart:", JSON.parse(JSON.stringify(state.items)));
    },
    removeItemFromCart(state, action) {
      const id = action.payload;

      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        // Subtract the quantity and price of the item being removed

        // Remove the item from the cart
        state.items = state.items.filter((item) => item.id !== id);
      }

      // Recalculate totalPrice and totalQuantity based on remaining items
    },
    clearCart(state) {
      // Reset cart state
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addItemToCart, removeItemFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
