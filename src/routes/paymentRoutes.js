import { Router } from "express";
import { createPixPayment } from "../controllers/paymentController.js";

const router = Router();

router.post("/pix", createPixPayment);

export default router;

// =========================
// bushi-belts/backend/controllers/paymentController.js
// =========================
import { generatePixPayment } from "../services/mercadoPagoService.js";

export async function createPixPayment(request, response) {
    try {
        const result = await generatePixPayment(request.body);

        response.status(201).json({
            paymentId: result.id,
            status: result.status,
            qrCodeBase64: result.point_of_interaction?.transaction_data?.qr_code_base64,
            copyPaste: result.point_of_interaction?.transaction_data?.qr_code,
        });
    } catch (error) {
        console.error("Erro ao criar pagamento PIX:", error);
        response.status(500).json({ message: "Não foi possível gerar o PIX." });
    }
}