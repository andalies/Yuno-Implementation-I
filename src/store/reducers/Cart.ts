import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItemType {
  id: number;
  nome: string;
  preco: number;
  foto: string;
  quantidade: number;
}

interface CartState {
  items: CartItemType[];
  isOpen: boolean;
  isOrder: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  isOrder: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    open: (state) => { state.isOpen = true; },
    close: (state) => { state.isOpen = false; state.isOrder = false; },
    addItem: (state, action: PayloadAction<CartItemType>) => {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.quantidade += 1;
      } else {
        state.items.push({ ...action.payload, quantidade: 1 });
      }
      state.isOpen = true;
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    openOrder: (state) => { if (state.items.length > 0) state.isOrder = true; },
    clearCart: (state) => { state.items = []; state.isOrder = false; state.isOpen = false; }
  }
});

export const { open, close, addItem, removeItem, openOrder, clearCart } = cartSlice.actions;
export default cartSlice.reducer;