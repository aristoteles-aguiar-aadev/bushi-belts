import BeltPreview from "./BeltPreview";
import { Minus, Plus, ShoppingCart } from "lucide-react";

function currency(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
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
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-apple-accent mb-3">
            Personalização
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-apple-text">
            Sua história. Sua assinatura.
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-apple-secondary">
            Escolha o tamanho, graus e adicione seu nome bordado.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div>
              <label className="mb-3 block text-[13px] font-medium text-apple-secondary">
                Tamanho
              </label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    aria-pressed={selectedSize === size} onClick={() => onSelectSize(size)}
                    className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                      selectedSize === size
                        ? "bg-apple-accent text-black"
                        : "border border-apple-separator bg-apple-surface text-apple-secondary hover:border-apple-separator-strong hover:text-apple-text"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {selectedBelt.maxStripes > 0 && (
              <div>
                <label className="mb-3 block text-[13px] font-medium text-apple-secondary">
                  Graus
                </label>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: selectedBelt.maxStripes + 1 }).map((_, index) => (
                    <button
                      key={index}
                      aria-pressed={selectedStripes === index} onClick={() => onSelectStripes(index)}
                      className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                        selectedStripes === index
                          ? "bg-apple-accent-subtle border border-apple-accent-border text-apple-accent"
                          : "border border-apple-separator bg-apple-surface text-apple-secondary hover:border-apple-separator-strong hover:text-apple-text"
                      }`}
                    >
                      {index === 0 ? "Sem grau" : `${index}º grau`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-3 block text-[13px] font-medium text-apple-secondary">
                  Bordado 1 — Nome
                </label>
                <input
                  aria-label="Nome para bordar" value={name}
                  onChange={(event) => onChangeName(event.target.value.slice(0, 22))}
                  placeholder="Ex: Seu Nome"
                  className="w-full rounded-xl border border-apple-separator bg-apple-surface px-4 py-3 text-[15px] text-apple-text outline-none transition-all placeholder:text-apple-tertiary focus:border-apple-accent-border focus:ring-1 focus:ring-apple-accent/20"
                />
                <div className="mt-2 text-[12px] text-apple-tertiary">
                  Opcional. Acréscimo de {currency(15)}.
                </div>
              </div>
              <div>
                <label className="mb-3 block text-[13px] font-medium text-apple-secondary">
                  Bordado 2 — Academia
                </label>
                <input
                  aria-label="Academia para bordar" value={academy}
                  onChange={(event) => onChangeAcademy(event.target.value.slice(0, 28))}
                  placeholder="Ex: Academia / Equipe"
                  className="w-full rounded-xl border border-apple-separator bg-apple-surface px-4 py-3 text-[15px] text-apple-text outline-none transition-all placeholder:text-apple-tertiary focus:border-apple-accent-border focus:ring-1 focus:ring-apple-accent/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-3 block text-[13px] font-medium text-apple-secondary">
                Cor do bordado
              </label>
              <div className="flex flex-wrap gap-3">
                {threadColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => onSelectThreadColor(color)}
                    className={`h-9 w-9 rounded-full transition-all duration-200 ${
                      threadColor.id === color.id
                        ? "scale-110 ring-2 ring-apple-accent ring-offset-2 ring-offset-black"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={color.name} aria-pressed={threadColor.id === color.id} title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-apple-separator bg-apple-surface p-6 xl:sticky xl:top-24">
            <div className="mb-6">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-apple-tertiary mb-4">
                Resumo
              </div>

              <div className="rounded-xl border border-apple-separator bg-black/40 p-5 mb-6">
                <div className="config-preview"><BeltPreview belt={selectedBelt} stripes={selectedStripes} color={threadColor.hex} name={name} academy={academy}/></div><p className="preview-note">Prévia ilustrativa · Textura e bordado podem variar.</p>
                <div className="mt-4 text-xl font-medium" style={{ color: threadColor.hex }}>
                  {name || selectedBelt.name}
                </div>
                <div className="mt-1 text-[13px] text-apple-secondary">
                  {academy || selectedBelt.tagline}
                </div>
              </div>

              <div className="space-y-3 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-apple-secondary">Faixa</span>
                  <span className="text-apple-text font-medium">{selectedBelt.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-apple-secondary">Tamanho</span>
                  <span className="text-apple-text font-medium">{selectedSize}</span>
                </div>
                {selectedBelt.maxStripes > 0 && (
                  <div className="flex justify-between">
                    <span className="text-apple-secondary">Graus</span>
                    <span className="text-apple-text font-medium">
                      {selectedStripes === 0 ? "Sem grau" : `${selectedStripes}º grau`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-apple-separator">
                  <span className="text-apple-secondary">Preço base</span>
                  <span className="text-apple-text font-medium">{currency(selectedBelt.price)}</span>
                </div>
                {embroideryExtra > 0 && (
                  <div className="flex justify-between">
                    <span className="text-apple-secondary">Bordado</span>
                    <span className="text-apple-text font-medium">{currency(embroideryExtra)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between py-4 border-y border-apple-separator">
              <span className="text-[13px] font-medium text-apple-secondary">Quantidade</span>
              <div className="flex items-center gap-3">
                <button
                  aria-label="Diminuir quantidade" disabled={qty <= 1} onClick={onDecreaseQty}
                  className="h-8 w-8 rounded-full border border-apple-separator flex items-center justify-center text-apple-secondary transition-all hover:border-apple-accent-border hover:text-apple-accent"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-lg font-medium text-apple-text">{qty}</span>
                <button
                  aria-label="Aumentar quantidade" disabled={qty >= 99} onClick={onIncreaseQty}
                  className="h-8 w-8 rounded-full border border-apple-separator flex items-center justify-center text-apple-secondary transition-all hover:border-apple-accent-border hover:text-apple-accent"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.15em] text-apple-tertiary mb-1">
                    Total
                  </div>
                  <div className="text-3xl font-medium text-apple-accent">{currency(total)}</div>
                </div>
              </div>
              <button
                onClick={onAddToCart}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-apple-accent px-6 py-3.5 text-[15px] font-medium text-black transition-all hover:bg-apple-accent-hover active:scale-[0.98]"
              >
                Adicionar ao carrinho
                <ShoppingCart className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
