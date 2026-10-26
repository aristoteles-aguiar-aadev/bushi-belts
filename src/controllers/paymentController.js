import { generateCheckout } from '../services/mercadoPagoService.js';
import { priceOrder } from '../domain/catalog.js';
export async function createCheckout(request, response) {
  try { priceOrder(request.body.items); }
  catch { return response.status(400).json({ message: 'Revise os itens da sacola.' }); }
  try { return response.status(201).json(await generateCheckout(request.body.items)); }
  catch { return response.status(503).json({ message: 'Pagamento indisponível. Tente novamente em instantes.' }); }
}
