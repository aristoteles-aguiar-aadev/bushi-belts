import { ShoppingBag, X } from "lucide-react";

function BeltBar({ belt, stripes = 0, embroideryColor = "#D4A832" }) {
  return (
    <div
      className="relative h-4 overflow-hidden rounded-sm border border-white/10"
      style={{
        background: `linear-gradient(90deg, ${belt.color}, ${belt.accent})`,
      }}
    >
      <div className="absolute right-0 top-0 h-full w-[18%] bg-black/40" />
      <div className="absolute left-3 top-1/2 flex -translate-y-1/2 gap-1">
        {Array.from({ length: stripes }).map((_, index) => (
          <span
            key={index}
            className="h-3 w-1 rounded-[1px]"
            style={{ backgroundColor: embroideryColor }}
          />
        ))}
      </div>
    </div>
  );
}

function currency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function CartDrawer({
  open,
  onClose,
  items,
  cartCount,
  cartTotal,
  onRemoveItem,
  onCheckout,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
      <div className="ml-auto flex h-full w-full max-w-xl flex-col border-l border-white/10 bg-neutral-950">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <div className="font-serif text-2xl text-white">Carrinho</div>
            <div className="text-sm text-zinc-500">{cartCount} item(ns)</div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-zinc-300 transition hover:border-amber-400 hover:text-amber-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="h-12 w-12 text-zinc-700" />
              <div className="mt-4 font-serif text-2xl text-white">
                Seu carrinho está vazio
              </div>
              <p className="mt-2 max-w-sm text-sm leading-7 text-zinc-500">
                Monte sua faixa e adicione ao carrinho para seguir para o
                checkout com Mercado Pago.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-serif text-xl text-white">
                        {item.category === "kids"
                          ? "Faixa Kids"
                          : "Faixa Adulta"}{" "}
                        {item.belt.name}
                      </div>
                      <div className="mt-2">
                        <BeltBar
                          belt={item.belt}
                          stripes={item.stripes}
                          embroideryColor={item.embroideryColor}
                        />
                      </div>
                      <div className="mt-3 space-y-1 text-sm text-zinc-400">
                        <div>
                          Tamanho:{" "}
                          <span className="text-zinc-200">{item.size}</span>
                        </div>
                        <div>
                          Quantidade:{" "}
                          <span className="text-zinc-200">{item.qty}</span>
                        </div>
                        {item.name && (
                          <div>
                            Nome:{" "}
                            <span className="text-zinc-200">{item.name}</span>
                          </div>
                        )}
                        {item.academy && (
                          <div>
                            Equipe:{" "}
                            <span className="text-zinc-200">
                              {item.academy}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-serif text-2xl text-amber-400">
                        {currency(item.total)}
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="mt-3 text-xs uppercase tracking-[0.25em] text-zinc-500 transition hover:text-red-400"
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

        <div className="border-t border-white/10 px-6 py-5">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                Total
              </div>
              <div className="mt-1 font-serif text-4xl text-amber-400">
                {currency(cartTotal)}
              </div>
            </div>
          </div>
          <button
            onClick={onCheckout}
            className="w-full rounded-full bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300"
          >
            Ir para checkout
          </button>
          <div className="mt-3 text-center text-xs uppercase tracking-[0.25em] text-zinc-600">
            Integração pronta para Mercado Pago
          </div>
        </div>
      </div>
    </div>
  );
}
