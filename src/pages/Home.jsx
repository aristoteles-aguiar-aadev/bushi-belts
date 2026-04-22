import { useMemo, useState } from "react";
import Hero from "../components/Hero";
import BeltSelector from "../components/BeltSelector";
import BeltConfigurator from "../components/BeltConfigurator";
import CartDrawer from "../components/CartDrawer";
import CheckoutModal from "../components/CheckoutModal";
import { useCartStore } from "../store/cartStore";

const catalog = {
  kids: {
    label: "Kids",
    belts: [
      {
        id: "kids-white",
        name: "Branca",
        level: "Kids Iniciante",
        color: "#F3EFE7",
        accent: "#D7D0C1",
        price: 79.9,
        maxStripes: 4,
        tagline: "O começo da jornada infantil.",
      },
      {
        id: "kids-gray",
        name: "Cinza",
        level: "Kids Evolução",
        color: "#8C8C8C",
        accent: "#5F5F5F",
        price: 89.9,
        maxStripes: 4,
        tagline: "Primeiros passos com disciplina.",
      },
      {
        id: "kids-yellow",
        name: "Amarela",
        level: "Kids Intermediária",
        color: "#D6B400",
        accent: "#A38800",
        price: 99.9,
        maxStripes: 4,
        tagline: "Confiança e crescimento no tatame.",
      },
      {
        id: "kids-orange",
        name: "Laranja",
        level: "Kids Avanço",
        color: "#E67E22",
        accent: "#B85E12",
        price: 109.9,
        maxStripes: 4,
        tagline: "Energia, foco e evolução.",
      },
      {
        id: "kids-green",
        name: "Verde",
        level: "Kids Destaque",
        color: "#2E8B57",
        accent: "#1F5F3B",
        price: 119.9,
        maxStripes: 4,
        tagline: "Mais maturidade e técnica.",
      },
    ],
    sizes: ["M0", "M1", "M2", "M3"],
  },

  adult: {
    label: "Adulto",
    belts: [
      {
        id: "adult-white",
        name: "Branca",
        level: "Iniciante",
        color: "#F3EFE7",
        accent: "#D7D0C1",
        price: 89.9,
        maxStripes: 4,
        tagline: "O começo da jornada.",
      },
      {
        id: "adult-blue",
        name: "Azul",
        level: "Fundamentos",
        color: "#224C8F",
        accent: "#173666",
        price: 119.9,
        maxStripes: 4,
        tagline: "Base técnica com identidade.",
      },
      {
        id: "adult-purple",
        name: "Roxa",
        level: "Evolução",
        color: "#64359B",
        accent: "#47256E",
        price: 139.9,
        maxStripes: 4,
        tagline: "Refinamento, visão e controle.",
      },
      {
        id: "adult-brown",
        name: "Marrom",
        level: "Maestria",
        color: "#6D4123",
        accent: "#4A2C15",
        price: 159.9,
        maxStripes: 4,
        tagline: "Próximo do topo.",
      },
      {
        id: "adult-black",
        name: "Preta",
        level: "Excelência",
        color: "#1D1D1D",
        accent: "#000000",
        price: 219.9,
        maxStripes: 6,
        tagline: "Respeito conquistado no tatame.",
      },
      {
        id: "adult-red",
        name: "Vermelha",
        level: "Legado",
        color: "#8C1F1F",
        accent: "#5D1212",
        price: 349.9,
        maxStripes: 0,
        tagline: "Um símbolo de história e honra.",
      },
    ],
    sizes: ["A0", "A1", "A2", "A3", "A4", "A5", "F1", "F2", "F3"],
  },
};

const threadColors = [
  { id: "gold", name: "Dourado", hex: "#D4A832" },
  { id: "white", name: "Branco", hex: "#F8F5EE" },
  { id: "silver", name: "Prata", hex: "#BFC4CC" },
  { id: "red", name: "Vermelho", hex: "#B82D2D" },
  { id: "blue", name: "Azul", hex: "#2E5FB8" },
  { id: "black", name: "Preto", hex: "#111111" },
];

const kidsVariants = [
  { id: "white", label: "Branca", accent: "#FFFFFF" },
  { id: "solid", label: "Padrão", accent: null },
  { id: "black", label: "Preta", accent: "#111111" },
];

export default function Home() {
  const [category, setCategory] = useState("adult");

  const activeCatalog = catalog[category];
  const belts = activeCatalog.belts;
  const sizes = activeCatalog.sizes;

  const [selectedBelt, setSelectedBelt] = useState(catalog.adult.belts[0]);
  const [selectedSize, setSelectedSize] = useState(catalog.adult.sizes[0]);
  const [selectedStripes, setSelectedStripes] = useState(0);
  const [selectedKidsVariant, setSelectedKidsVariant] = useState("solid");
  const [name, setName] = useState("");
  const [academy, setAcademy] = useState("");
  const [threadColor, setThreadColor] = useState(threadColors[0]);
  const [qty, setQty] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const { items, addItem, removeItem, clearCart } = useCartStore();

  const isKids = category === "kids";
  const isKidsWhiteBelt = selectedBelt.id === "kids-white";
  const showKidsVariantSelector = isKids && !isKidsWhiteBelt;

  const displayBelt = useMemo(() => {
    if (!isKids) return selectedBelt;
    if (isKidsWhiteBelt) return selectedBelt;
    if (selectedKidsVariant === "solid") return selectedBelt;

    const accent =
      selectedKidsVariant === "white"
        ? "#FFFFFF"
        : selectedKidsVariant === "black"
          ? "#111111"
          : selectedBelt.accent;

    const variantName =
      selectedKidsVariant === "white"
        ? `${selectedBelt.name} e Branca`
        : `${selectedBelt.name} e Preta`;

    return {
      ...selectedBelt,
      accent,
      name: variantName,
    };
  }, [isKids, isKidsWhiteBelt, selectedBelt, selectedKidsVariant]);

  const embroideryExtra = name.trim() ? 15 : 0;
  const unitPrice = displayBelt.price + embroideryExtra;
  const total = unitPrice * qty;

  const cartTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.total, 0),
    [items],
  );

  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items],
  );

  function handleChangeCategory(newCategory) {
    const nextCatalog = catalog[newCategory];

    setCategory(newCategory);
    setSelectedBelt(nextCatalog.belts[0]);
    setSelectedSize(nextCatalog.sizes[0]);
    setSelectedStripes(0);
    setSelectedKidsVariant("solid");
  }

  function handleSelectBelt(belt) {
    setSelectedBelt(belt);
    setSelectedStripes(0);
    setSelectedKidsVariant("solid");
  }

  function handleAddToCart() {
    addItem({
      id: crypto.randomUUID(),
      category,
      kidsVariant: isKids && !isKidsWhiteBelt ? selectedKidsVariant : null,
      belt: displayBelt,
      baseBeltId: selectedBelt.id,
      size: selectedSize,
      stripes: selectedStripes,
      name,
      academy,
      qty,
      embroideryColor: threadColor.hex,
      unitPrice,
      total,
    });

    setCartOpen(true);
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-zinc-100">
      <Hero
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        selectedBelt={displayBelt}
        selectedStripes={selectedStripes}
        threadColor={threadColor}
        name={name}
        academy={academy}
      />

      <section className="px-6 pt-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-400">
            <span className="h-px w-8 bg-amber-400" />
            Escolha a categoria
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleChangeCategory("kids")}
              className={`group relative overflow-hidden rounded-[1.75rem] border transition ${
                category === "kids"
                  ? "border-amber-400/70 bg-amber-400/10 shadow-[0_0_0_1px_rgba(251,191,36,0.15)]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
              }`}
            >
              <div className="relative h-20 w-90 sm:h-48 m-auto">
                <img
                  src="/logo/kids-cat.png"
                  alt="Faixas Kids"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-black/40" />
                <div className="absolute inset-0 flex items-end justify-between p-5">
                  <div className="text-left">
                    <div className="text-[11px] uppercase tracking-[0.28em] text-zinc-300">
                      Linha
                    </div>
                    <div className="mt-1 font-serif text-2xl text-white"></div>
                  </div>

                  <div
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                      category === "kids"
                        ? "bg-amber-400 text-black"
                        : "border border-white/20 bg-black/30 text-white"
                    }`}
                  >
                    {category === "kids" ? "Ativa" : "Selecionar"}
                  </div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleChangeCategory("adult")}
              className={`group relative overflow-hidden rounded-[1.75rem] border transition ${
                category === "adult"
                  ? "border-amber-400/70 bg-amber-400/10 shadow-[0_0_0_1px_rgba(251,191,36,0.15)]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
              }`}
            >
              <div className="relative h-28 w-full sm:h-48">
                <img
                  src="/logo/adulto-cat.png"
                  alt="Faixas Adultas"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-black/40" />
                <div className="absolute inset-0 flex items-end justify-between p-5">
                  <div className="text-left">
                    <div className="text-[11px] uppercase tracking-[0.28em] text-zinc-300">
                      Linha
                    </div>
                    <div className="mt-1 font-serif text-2xl text-white"></div>
                  </div>

                  <div
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                      category === "adult"
                        ? "bg-amber-400 text-black"
                        : "border border-white/20 bg-black/30 text-white"
                    }`}
                  >
                    {category === "adult" ? "Ativa" : "Selecionar"}
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      <BeltSelector
        belts={belts}
        selectedBelt={selectedBelt}
        category={category}
        onSelectBelt={handleSelectBelt}
      />

      {showKidsVariantSelector && (
        <section className="px-6 pb-2 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-400">
              <span className="h-px w-8 bg-amber-400" />
              Variação da faixa kids
            </div>

            <h3 className="font-serif text-2xl text-white">
              Escolha a combinação da faixa {selectedBelt.name.toLowerCase()}
            </h3>

            <div className="mt-5 flex flex-wrap gap-3">
              {kidsVariants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedKidsVariant(variant.id)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    selectedKidsVariant === variant.id
                      ? "border-amber-400 bg-amber-400/10 text-amber-300"
                      : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20"
                  }`}
                >
                  {variant.id === "solid"
                    ? selectedBelt.name
                    : `${selectedBelt.name} e ${variant.label}`}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <BeltConfigurator
        selectedBelt={displayBelt}
        sizes={sizes}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        selectedStripes={selectedStripes}
        onSelectStripes={setSelectedStripes}
        name={name}
        onChangeName={setName}
        academy={academy}
        onChangeAcademy={setAcademy}
        threadColors={threadColors}
        threadColor={threadColor}
        onSelectThreadColor={setThreadColor}
        qty={qty}
        onDecreaseQty={() => setQty((value) => Math.max(1, value - 1))}
        onIncreaseQty={() => setQty((value) => value + 1)}
        embroideryExtra={embroideryExtra}
        total={total}
        onAddToCart={handleAddToCart}
      />

      <section
        id="diferenciais"
        className="border-t border-white/10 px-6 py-16 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-400">
            <span className="h-px w-8 bg-amber-400" />
            Por que vende mais
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Visual aspiracional",
                text: "Hero premium, contraste forte e atmosfera de marca que gera desejo imediato.",
              },
              {
                title: "Configuração clara",
                text: "Cliente escolhe graduação, tamanho, graus e personalização sem ruído.",
              },
              {
                title: "Resumo instantâneo",
                text: "Preço, extras e preview ficam visíveis o tempo todo para reduzir dúvida.",
              },
              {
                title: "Checkout preparado",
                text: "Estrutura pronta para integrar Mercado Pago via backend Node.js.",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="font-serif text-2xl text-amber-400">
                  0{index + 1}
                </div>
                <div className="mt-4 text-lg font-semibold text-white">
                  {item.title}
                </div>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-10 text-sm text-zinc-500 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-8 text-center lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-6">
            {/* Esquerda - Bushi */}
            <div className="flex flex-col items-center gap-3 lg:items-start lg:text-left">
              <div className="header-logo">
                <img
                  src="/logo/bushi2.png"
                  alt="Bushi Belts"
                  className="h-10 w-auto object-contain tems-center"
                />
              </div>

              <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
                Faixas artesanais para quem leva a jornada a sério.
              </p>
            </div>

            {/* Centro - Copyright */}
            <div className="flex items-center justify-center">
              <p className="text-sm leading-relaxed text-zinc-500">
                © 2026 Bushi Belts. Todos os direitos reservados.
              </p>
            </div>

            {/* Direita - Devlab */}
            <div className="flex flex-col items-center gap-3 lg:items-end lg:text-right">
              <a
                href="https://devlabdigital.com.br"
                target="_blank"
                rel="noopener noreferrer"
                title="Acessar site da Dev Lab"
                className="flex flex-col items-center gap-2 lg:items-end"
              >
                <span className="text-xs text-zinc-500">
                  Site desenvolvido por:
                </span>

                <img
                  src="/logo/devlab-black-rb.png"
                  alt="Dev Lab"
                  className="h-10 w-auto object-contain"
                />
              </a>

              <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
                Criação de sites profissionais para empresas que querem vender
                mais
              </p>
            </div>
          </div>
        </div>
      </footer>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={items}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onRemoveItem={removeItem}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={items}
        total={cartTotal}
        onSuccess={() => {
          clearCart();
          setCheckoutOpen(false);
        }}
      />
    </div>
  );
}
