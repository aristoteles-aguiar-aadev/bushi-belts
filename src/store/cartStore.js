import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useCartStore = create(persist((set) => ({
  items: [],
  addItem: item => set(state => ({ items: [item, ...state.items] })),
  removeItem: id => set(state => ({ items: state.items.filter(item => item.id !== id) })),
  clearCart: () => set({ items: [] }),
}), { name: 'bushi-bag-v1' }));
