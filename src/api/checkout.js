import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '', timeout: 15000 });
export async function createCheckout(items) {
  const { data } = await api.post('/api/payments/checkout', { items });
  const url = new URL(data.url);
  if (url.protocol !== 'https:' || !['www.mercadopago.com.br', 'sandbox.mercadopago.com.br'].includes(url.hostname)) throw new Error('Endereço de pagamento inválido.');
  return url.href;
}
