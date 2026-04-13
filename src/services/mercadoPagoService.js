import { MercadoPagoConfig, Payment } from "mercadopago";
import dotenv from "dotenv";
import crypto from "node:crypto";

dotenv.config();

if (!process.env.MP_ACCESS_TOKEN) {
    throw new Error("MP_ACCESS_TOKEN não foi definido no ambiente.");
}

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
    options: {
        timeout: 5000,
    },
});

const payment = new Payment(client);

function onlyDigits(value) {
    return String(value || "").replace(/\D/g, "");
}

function splitName(fullName = "") {
    const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
    return {
        first_name: parts[0] || "Cliente",
        last_name: parts.slice(1).join(" ") || "Não informado",
    };
}

function buildDescription(items = []) {
    return items
        .map((item) => `Faixa ${item?.belt?.name || "Personalizada"} ${item?.size || ""}`.trim())
        .join(", ");
}

/**
 * payload esperado:
 * {
 *   total: 199.9,
 *   method: "pix" | "credit_card" | "debit_card",
 *   customer: {
 *     name: "Nome Sobrenome",
 *     email: "cliente@email.com",
 *     cpf: "000.000.000-00"
 *   },
 *   items: [{ belt: { name: "Preta" }, size: "A2" }],
 *
 *   // para cartão:
 *   card?: {
 *     token: "CARD_TOKEN",
 *     payment_method_id: "visa" | "master" | ...,
 *     issuer_id?: "123",
 *     installments?: 1
 *   }
 * }
 */
export async function generatePayment(payload) {
    const amount = Number(payload?.total);

    if (!amount || Number.isNaN(amount) || amount <= 0) {
        throw new Error("Valor total inválido.");
    }

    if (!payload?.customer?.email) {
        throw new Error("E-mail do cliente é obrigatório.");
    }

    if (!payload?.customer?.name) {
        throw new Error("Nome do cliente é obrigatório.");
    }

    const description = buildDescription(payload.items);
    const { first_name, last_name } = splitName(payload.customer.name);

    const payer = {
        email: payload.customer.email,
        first_name,
        last_name,
        identification: {
            type: "CPF",
            number: onlyDigits(payload.customer.cpf),
        },
    };

    const method = payload?.method;

    let body;

    if (method === "pix") {
        body = {
            transaction_amount: amount,
            description,
            payment_method_id: "pix",
            payer,
        };
    } else if (method === "credit_card" || method === "debit_card") {
        if (!payload?.card?.token) {
            throw new Error("Token do cartão é obrigatório para pagamento com cartão.");
        }

        if (!payload?.card?.payment_method_id) {
            throw new Error("payment_method_id do cartão é obrigatório.");
        }

        body = {
            transaction_amount: amount,
            description,
            token: payload.card.token,
            payment_method_id: payload.card.payment_method_id,
            issuer_id: payload.card.issuer_id,
            installments:
                method === "credit_card"
                    ? Number(payload.card.installments || 1)
                    : 1,
            payer,
        };
    } else {
        throw new Error("Método de pagamento inválido. Use pix, credit_card ou debit_card.");
    }

    const requestOptions = {
        idempotencyKey: crypto.randomUUID(),
    };

    try {
        const result = await payment.create({ body, requestOptions });
        return result;
    } catch (error) {
        console.error("Erro ao criar pagamento no Mercado Pago:", error);
        throw error;
    }
}