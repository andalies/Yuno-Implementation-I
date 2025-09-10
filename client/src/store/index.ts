import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './reducers/Cart';

// Create store
export const store = configureStore({
  reducer: {
    cart: cartReducer
  }
});

// Root state type
export type RootState = ReturnType<typeof store.getState>;

// Root reducer type (optional, usually same as RootState)
export type RootReducer = ReturnType<typeof store.getState>;
