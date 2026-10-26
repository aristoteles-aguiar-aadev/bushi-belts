import BeltPreview from "./BeltPreview";
import { useDialog } from "../hooks/useDialog";
import { ShoppingCart, X } from "lucide-react";

function currency(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export default function CartDrawer({ open, onClose, items, cartCount, cartTotal, onRemoveItem, onCheckout }) {
  const ref = useDialog(open, onClose);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div ref={ref} role="dialog" aria-modal="true" aria-label="Sua sacola" tabIndex={-1} className="relative w-full max-w-md bg-black border-l border-apple-separator flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between px-6 py-5 border-b border-apple-separator">
          <div>
            <div className="text-lg font-medium text-apple-text">Carrinho</div>
            <div className="text-[13px] text-apple-secondary">{cartCount} {cartCount === 1 ? "item" : "itens"}</div>
          </div>
          <button
            aria-label="Fechar sacola" onClick={onClose}
            className="h-8 w-8 rounded-full bg-apple-elevated flex items-center justify-center text-apple-secondary transition-colors hover:text-apple-text"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-full bg-apple-elevated flex items-center justify-center mb-4">
                <ShoppingCart className="h-6 w-6 text-apple-tertiary" />
              </div>
              <div className="text-lg font-medium text-apple-text mb-2">Carrinho vazio</div>
              <p className="text-[13px] leading-relaxed text-apple-secondary max-w-xs">
                Monte sua faixa personalizada e adicione ao carrinho.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-apple-separator bg-apple-surface p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] font-medium text-apple-text truncate">
                        {item.category === "kids" ? "Kids" : "Adulta"} — {item.belt.name}
                      </div>
                      <div className="mt-2">
                        <div className="cart-belt"><BeltPreview belt={item.belt} stripes={item.stripes} color={item.embroideryColor} name={item.name} academy={item.academy}/></div>
                      </div>
                      <div className="mt-3 space-y-1 text-[13px] text-apple-secondary">
                        <div>Tamanho: <span className="text-apple-text">{item.size}</span></div>
                        <div>Qtd: <span className="text-apple-text">{item.qty}</span></div>
                        {item.name && <div>Nome: <span className="text-apple-text">{item.name}</span></div>}
                        {item.academy && <div>Equipe: <span className="text-apple-text">{item.academy}</span></div>}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-medium text-apple-accent">
                        {currency(item.total)}
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="mt-2 text-[11px] font-medium uppercase tracking-[0.1em] text-apple-tertiary transition-colors hover:text-apple-error"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-apple-separator px-6 py-5">
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.15em] text-apple-tertiary mb-1">
                  Total
                </div>
                <div className="text-3xl font-medium text-apple-accent">
                  {currency(cartTotal)}
                </div>
              </div>
            </div>
            <button
              onClick={onCheckout}
              className="w-full rounded-full bg-apple-accent px-6 py-3.5 text-[15px] font-medium text-black transition-all hover:bg-apple-accent-hover active:scale-[0.98]"
            >
              Finalizar compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
