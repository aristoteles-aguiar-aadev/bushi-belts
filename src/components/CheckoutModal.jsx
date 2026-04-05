import { useState } from "react";
import { X } from "lucide-react";
import { createPixCheckout } from "../api/checkout";

function currency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function CheckoutModal({
  open,
  onClose,
  items,
  total,
  onSuccess,
}) {
  const [customer, setCustomer] = useState({ name: "", email: "", cpf: "" });
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState(null);

  if (!open) return null;

  async function handleGeneratePix() {
    try {
      setLoading(true);
      const response = await createPixCheckout({
        customer,
        items,
        total,
      });
      setPixData(response);
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar PIX.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-neutral-950 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="font-serif text-3xl text-white">Checkout</div>
            <div className="text-sm text-zinc-500">
              Pagamento via Mercado Pago
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-zinc-300 transition hover:border-amber-400 hover:text-amber-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!pixData ? (
          <div className="space-y-4">
            <input
              value={customer.name}
              onChange={(event) =>
                setCustomer({ ...customer, name: event.target.value })
              }
              placeholder="Nome completo"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-amber-400"
            />
            <input
              value={customer.email}
              onChange={(event) =>
                setCustomer({ ...customer, email: event.target.value })
              }
              placeholder="E-mail"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-amber-400"
            />
            <input
              value={customer.cpf}
              onChange={(event) =>
                setCustomer({ ...customer, cpf: event.target.value })
              }
              placeholder="CPF"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-amber-400"
            />

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="text-sm text-zinc-400">Total do pedido</div>
              <div className="mt-2 font-serif text-4xl text-amber-400">
                {currency(total)}
              </div>
            </div>

            <button
              onClick={handleGeneratePix}
              disabled={loading}
              className="w-full rounded-full bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Gerando PIX..." : "Gerar PIX"}
            </button>
          </div>
        ) : (
          <div className="space-y-5 text-center">
            <div className="font-serif text-2xl text-white">
              PIX gerado com sucesso
            </div>
            {pixData.qrCodeBase64 && (
              <img
                src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                alt="QR Code PIX"
                className="mx-auto h-56 w-56 rounded-xl bg-white p-3"
              />
            )}
            <textarea
              readOnly
              value={pixData.copyPaste || ""}
              className="h-28 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none"
            />
            <button
              onClick={onSuccess}
              className="w-full rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-400"
            >
              Concluir pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
