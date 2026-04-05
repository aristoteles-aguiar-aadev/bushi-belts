import { create } from "zustand";

export const useCartStore = create((set) => ({
    items: [],
    addItem: (item) => set((state) => ({ items: [item, ...state.items] })),
    removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
    clearCart: () => set({ items: [] }),
}));

// =========================
// bushi-belts/frontend/src/api/checkout.js
// =========================
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

export async function createPixCheckout(payload) {
    const { data } = await api.post("/api/payments/pix", payload);
    return data;
}