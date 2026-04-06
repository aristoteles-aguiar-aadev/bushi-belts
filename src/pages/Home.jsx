import { useMemo, useState } from "react";
import Hero from "../components/Hero";
import BeltSelector from "../components/BeltSelector";
import BeltConfigurator from "../components/BeltConfigurator";
import CartDrawer from "../components/CartDrawer";
import CheckoutModal from "../components/CheckoutModal";
import { useCartStore } from "../store/cartStore";

const belts = [
  {
    id: "white",
    name: "Branca",
    level: "Iniciante",
    color: "#F3EFE7",
    accent: "#D7D0C1",
    price: 89.9,
    maxStripes: 4,
    tagline: "O começo da jornada.",
  },
  {
    id: "blue",
    name: "Azul",
    level: "Fundamentos",
    color: "#224C8F",
    accent: "#173666",
    price: 119.9,
    maxStripes: 4,
    tagline: "Base técnica com identidade.",
  },
  {
    id: "purple",
    name: "Roxa",
    level: "Evolução",
    color: "#64359B",
    accent: "#47256E",
    price: 139.9,
    maxStripes: 4,
    tagline: "Refinamento, visão e controle.",
  },
  {
    id: "brown",
    name: "Marrom",
    level: "Maestria",
    color: "#6D4123",
    accent: "#4A2C15",
    price: 159.9,
    maxStripes: 4,
    tagline: "Próximo do topo.",
  },
  {
    id: "black",
    name: "Preta",
    level: "Excelência",
    color: "#1D1D1D",
    accent: "#000000",
    price: 219.9,
    maxStripes: 6,
    tagline: "Respeito conquistado no tatame.",
  },
  {
    id: "red",
    name: "Vermelha",
    level: "Legado",
    color: "#8C1F1F",
    accent: "#5D1212",
    price: 349.9,
    maxStripes: 0,
    tagline: "Um símbolo de história e honra.",
  },
];

const sizes = [
  "A0",
  "A1",
  "A2",
  "A3",
  "A4",
  "A5",
  "M0",
  "M1",
  "M2",
  "M3",
  "F1",
  "F2",
  "F3",
];

const threadColors = [
  { id: "gold", name: "Dourado", hex: "#D4A832" },
  { id: "white", name: "Branco", hex: "#F8F5EE" },
  { id: "silver", name: "Prata", hex: "#BFC4CC" },
  { id: "red", name: "Vermelho", hex: "#B82D2D" },
  { id: "blue", name: "Azul", hex: "#2E5FB8" },
  { id: "black", name: "Preto", hex: "#111111" },
];

export default function Home() {
  const [selectedBelt, setSelectedBelt] = useState(belts[1]);
  const [selectedSize, setSelectedSize] = useState("A2");
  const [selectedStripes, setSelectedStripes] = useState(0);
  const [name, setName] = useState("");
  const [academy, setAcademy] = useState("");
  const [threadColor, setThreadColor] = useState(threadColors[0]);
  const [qty, setQty] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const { items, addItem, removeItem, clearCart } = useCartStore();

  const embroideryExtra = name.trim() ? 15 : 0;
  const unitPrice = selectedBelt.price + embroideryExtra;
  const total = unitPrice * qty;

  const cartTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.total, 0),
    [items],
  );
  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items],
  );

  function handleAddToCart() {
    addItem({
      id: crypto.randomUUID(),
      belt: selectedBelt,
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
        selectedBelt={selectedBelt}
        selectedStripes={selectedStripes}
        threadColor={threadColor}
        name={name}
        academy={academy}
      />

      <BeltSelector
        belts={belts}
        selectedBelt={selectedBelt}
        onSelectBelt={(belt) => {
          setSelectedBelt(belt);
          setSelectedStripes(0);
        }}
      />

      <BeltConfigurator
        selectedBelt={selectedBelt}
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
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="header-logo mb-2 flex items-center gap-3">
              <img
                src="/logo/bushi-belts.png"
                alt="Bushi Belts"
                className="h-16 w-16"
              />
            </div>
            <div className="mt-1">
              Faixas artesanais para quem leva a jornada a sério.
            </div>
          </div>
          <div className="text-zinc-400">
            Backend Node.js + Mercado Pago ready
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
