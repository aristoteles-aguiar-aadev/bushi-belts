import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

export async function createPixCheckout(payload) {
    const { data } = await api.post("/api/payments/pix", payload);
    return data;
}


export async function createCardCheckout(payload) {
    const { data } = await api.post("/api/checkout/card", payload);
    return data;
}