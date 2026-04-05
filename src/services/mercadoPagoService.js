import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
});

const payment = new Payment(client);

export async function generatePixPayment(payload) {
    const description = payload.items
        .map((item) => `Faixa ${item.belt.name} ${item.size}`)
        .join(", ");

    const body = {
        transaction_amount: Number(payload.total),
        description,
        payment_method_id: "pix",
        payer: {
            email: payload.customer.email,
            first_name: payload.customer.name,
            identification: {
                type: "CPF",
                number: String(payload.customer.cpf).replace(/\D/g, ""),
            },
        },
    };

    return payment.create({ body }).then((result) => result);
}