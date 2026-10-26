import { useMemo, useState } from "react";
import { catalog } from "../domain/catalog";
import CategorySelector from "../components/CategorySelector";
import Hero from "../components/Hero";
import BeltSelector from "../components/BeltSelector";
import BeltConfigurator from "../components/BeltConfigurator";
import CartDrawer from "../components/CartDrawer";
import CheckoutModal from "../components/CheckoutModal";
import { useCartStore } from "../store/cartStore";

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
    const accent = selectedKidsVariant === "white" ? "#FFFFFF" : selectedKidsVariant === "black" ? "#111111" : selectedBelt.accent;
    const variantName = `${selectedBelt.name} com listra ${selectedKidsVariant === "white" ? "branca" : "preta"}`;
    return { ...selectedBelt, accent, name: variantName };
  }, [isKids, isKidsWhiteBelt, selectedBelt, selectedKidsVariant]);

  const embroideryExtra = (name.trim() || academy.trim()) ? 15 : 0;
  const unitPrice = displayBelt.price + embroideryExtra;
  const total = unitPrice * qty;
  const cartTotal = useMemo(() => items.reduce((sum, item) => sum + item.total, 0), [items]);
  const cartCount = useMemo(() => items.reduce((sum, item) => sum + item.qty, 0), [items]);

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
    <div className="storefront min-h-screen bg-black text-apple-text">
      <Hero
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        selectedBelt={displayBelt}
        selectedStripes={selectedStripes}
        threadColor={threadColor}
        name={name}
        academy={academy}
      />

      <CategorySelector category={category} onChangeCategory={handleChangeCategory} />

      <BeltSelector belts={belts} selectedBelt={displayBelt} category={category} onSelectBelt={handleSelectBelt} />

      {showKidsVariantSelector && (
        <section className="px-6 pb-2 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-2xl border border-apple-separator bg-apple-surface p-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-apple-accent mb-2">
              Variação
            </div>
            <h3 className="text-xl font-medium text-apple-text mb-4">
              Listra central da faixa {selectedBelt.name.toLowerCase()}
            </h3>
            <div className="flex flex-wrap gap-2">
              {kidsVariants.map((variant) => (
                <button
                  key={variant.id}
                  aria-pressed={selectedKidsVariant === variant.id}
                  onClick={() => setSelectedKidsVariant(variant.id)}
                  className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                    selectedKidsVariant === variant.id
                      ? "bg-apple-accent-subtle border border-apple-accent-border text-apple-accent"
                      : "border border-apple-separator bg-apple-surface text-apple-secondary hover:border-apple-separator-strong hover:text-apple-text"
                  }`}
                >
                  {variant.id === "solid" ? "Lisa, sem listra" : `Listra ${variant.label.toLowerCase()}`}
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
        onDecreaseQty={() => setQty((v) => Math.max(1, v - 1))}
        onIncreaseQty={() => setQty((v) => Math.min(99, v + 1))}
        embroideryExtra={embroideryExtra}
        total={total}
        onAddToCart={handleAddToCart}
      />

      <section id="diferenciais" className="border-t border-apple-separator px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-apple-accent mb-3">
              Diferenciais
            </div>
            <h2 className="text-4xl font-semibold tracking-tight text-apple-text">
              O cuidado também é um princípio.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { num: "01", title: "Respeito à jornada", text: "Cada graduação carrega tempo, dedicação e aprendizado. Sua faixa acompanha essa história." },
              { num: "02", title: "Configuração intuitiva", text: "Escolha graduação, tamanho, graus e personalização de forma clara." },
              { num: "03", title: "Sua identidade, seu bordado", text: "Veja sua faixa customizada antes de comprar, sem surpresas." },
              { num: "04", title: "Checkout seguro", text: "Pagamento via PIX ou cartão com integração Mercado Pago." },
            ].map(({ num, title, text }) => (
              <div key={title} className="rounded-2xl border border-apple-separator bg-apple-surface p-6">
                <div className="text-2xl font-medium text-apple-accent mb-4">{num}</div>
                <div className="text-[17px] font-medium text-apple-text mb-2">{title}</div>
                <p className="text-[13px] leading-relaxed text-apple-secondary">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bushido-section" id="bushido">
        <div className="bushido-mark" aria-hidden="true">武士道</div>
        <div><span className="eyebrow">NOSSA ESSÊNCIA · BUSHIDŌ</span>
        <h2>O caminho importa.<br/><em>Cada dia. Cada treino.</em></h2>
        <p>Inspirada no caminho do guerreiro, a Bushi acredita que respeito, integridade e disciplina se praticam. A faixa é o que se vê. O que ela representa, você constrói.</p>
        <a className="text-link" href="#colecao">Encontre a sua faixa <span>↗</span></a></div>
      </section>
      <footer className="brand-footer"><a className="brand-logo" href="#" aria-label="Bushi Premium Belts, início"><img src="/logo/bushi-profile.jpg" alt="Bushi Premium Belts" width="90" height="90"/></a><p>Honre o caminho. Vista sua história.</p><div className="footer-social"><a href="https://www.instagram.com/bushibelts/" target="_blank" rel="noopener noreferrer">Instagram · @bushibelts ↗</a><span>© {new Date().getFullYear()} Bushi Belts</span></div></footer>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={items}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onRemoveItem={removeItem}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
      />

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={items}
        total={cartTotal}
        onSuccess={() => { clearCart(); setCheckoutOpen(false); }}
      />
    </div>
  );
}
