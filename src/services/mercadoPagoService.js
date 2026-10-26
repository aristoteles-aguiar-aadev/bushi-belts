import { MercadoPagoConfig, Preference } from 'mercadopago';
import { priceOrder } from '../domain/catalog.js';

export async function generateCheckout(items) {
  const order = priceOrder(items);
  if (!process.env.MP_ACCESS_TOKEN) throw new Error('Pagamento não configurado.');
  const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN, options: { timeout: 10000 } });
  const preference = await new Preference(client).create({ body: {
    items: order.items.map(item => ({
      id: item.baseBeltId,
      title: `Bushi ${item.belt.name} · ${item.size}`,
      description: `Graus: ${item.stripes || 0}; bordado: ${item.name || 'sem nome'}; equipe: ${item.academy || 'sem equipe'}; linha: ${item.embroideryColor || 'padrão'}; variação: ${item.kidsVariant || 'padrão'}`,
      quantity: item.qty, unit_price: item.unitPrice, currency_id: 'BRL',
    })),
  } });
  return { url: process.env.MP_SANDBOX === 'true' ? preference.sandbox_init_point : preference.init_point };
}
