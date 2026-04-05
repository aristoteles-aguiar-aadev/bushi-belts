import { Minus, Plus, ShoppingBag } from "lucide-react";

function BeltBar({
  belt,
  stripes = 0,
  embroideryColor = "#D4A832",
  large = false,
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-sm border border-white/10 ${large ? "h-8" : "h-4"}`}
      style={{
        background: `linear-gradient(90deg, ${belt.color}, ${belt.accent})`,
      }}
    >
      <div className="absolute right-0 top-0 h-full w-[18%] bg-black/40" />
      <div className="absolute left-3 top-1/2 flex -translate-y-1/2 gap-1">
        {Array.from({ length: stripes }).map((_, index) => (
          <span
            key={index}
            className={`rounded-[1px] ${large ? "h-5 w-1.5" : "h-3 w-1"}`}
            style={{ backgroundColor: embroideryColor.hex || embroideryColor }}
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

export default function BeltConfigurator({
  selectedBelt,
  sizes,
  selectedSize,
  onSelectSize,
  selectedStripes,
  onSelectStripes,
  name,
  onChangeName,
  academy,
  onChangeAcademy,
  threadColors,
  threadColor,
  onSelectThreadColor,
  qty,
  onDecreaseQty,
  onIncreaseQty,
  embroideryExtra,
  total,
  onAddToCart,
}) {
  return (
    <section id="personalizar" className="px-6 py-16 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 lg:p-8">
          <div className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-400">
            <span className="h-px w-8 bg-amber-400" />
            Personalização
          </div>
          <h3 className="font-serif text-3xl text-white">
            Monte uma faixa que pareça feita para você.
          </h3>

          <div className="mt-8 space-y-8">
            <div>
              <label className="mb-3 block text-xs uppercase tracking-[0.28em] text-zinc-500">
                Tamanho
              </label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => onSelectSize(size)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${selectedSize === size ? "border-amber-400 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {selectedBelt.maxStripes > 0 && (
              <div>
                <label className="mb-3 block text-xs uppercase tracking-[0.28em] text-zinc-500">
                  Graus
                </label>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: selectedBelt.maxStripes + 1 }).map(
                    (_, index) => (
                      <button
                        key={index}
                        onClick={() => onSelectStripes(index)}
                        className={`rounded-full border px-4 py-2 text-sm transition ${selectedStripes === index ? "border-amber-400 bg-amber-400/10 text-amber-300" : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20"}`}
                      >
                        {index === 0 ? "Sem grau" : `${index}º grau`}
                      </button>
                    ),
                  )}
                </div>
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-3 block text-xs uppercase tracking-[0.28em] text-zinc-500">
                  Nome bordado
                </label>
                <input
                  value={name}
                  onChange={(event) =>
                    onChangeName(event.target.value.slice(0, 22))
                  }
                  placeholder="Ex: Aristoteles"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-400"
                />
                <div className="mt-2 text-xs text-zinc-500">
                  Opcional. Acréscimo de {currency(15)}.
                </div>
              </div>
              <div>
                <label className="mb-3 block text-xs uppercase tracking-[0.28em] text-zinc-500">
                  Academia / equipe
                </label>
                <input
                  value={academy}
                  onChange={(event) =>
                    onChangeAcademy(event.target.value.slice(0, 28))
                  }
                  placeholder="Ex: Bushi Team"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-3 block text-xs uppercase tracking-[0.28em] text-zinc-500">
                Cor do bordado
              </label>
              <div className="flex flex-wrap gap-3">
                {threadColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => onSelectThreadColor(color)}
                    className={`h-10 w-10 rounded-full border-2 transition ${threadColor.id === color.id ? "scale-110 border-amber-400" : "border-white/10"}`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-6 lg:p-8">
          <div className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-400">
            <span className="h-px w-8 bg-amber-400" />
            Resumo do pedido
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
            <BeltBar
              belt={selectedBelt}
              stripes={selectedStripes}
              embroideryColor={threadColor}
              large
            />
            <div
              className="mt-5 font-serif text-2xl"
              style={{ color: threadColor.hex }}
            >
              {name || selectedBelt.name}
            </div>
            <div className="mt-1 text-sm text-zinc-400">
              {academy || selectedBelt.tagline}
            </div>
          </div>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-zinc-400">Faixa</span>
              <span className="font-medium text-white">
                {selectedBelt.name}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-zinc-400">Tamanho</span>
              <span className="font-medium text-white">{selectedSize}</span>
            </div>
            {selectedBelt.maxStripes > 0 && (
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-zinc-400">Graus</span>
                <span className="font-medium text-white">
                  {selectedStripes === 0
                    ? "Sem grau"
                    : `${selectedStripes}º grau`}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-zinc-400">Preço base</span>
              <span className="font-medium text-white">
                {currency(selectedBelt.price)}
              </span>
            </div>
            {embroideryExtra > 0 && (
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-zinc-400">Nome bordado</span>
                <span className="font-medium text-white">
                  {currency(embroideryExtra)}
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.28em] text-zinc-500">
              Quantidade
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={onDecreaseQty}
                className="rounded-full border border-white/10 p-2 text-zinc-300 transition hover:border-amber-400 hover:text-amber-300"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-serif text-2xl text-white">
                {qty}
              </span>
              <button
                onClick={onIncreaseQty}
                className="rounded-full border border-white/10 p-2 text-zinc-300 transition hover:border-amber-400 hover:text-amber-300"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-8 flex items-end justify-between border-t border-white/10 pt-5">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                Total
              </div>
              <div className="mt-1 font-serif text-4xl text-amber-400">
                {currency(total)}
              </div>
            </div>
            <button
              onClick={onAddToCart}
              className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300"
            >
              Adicionar
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
