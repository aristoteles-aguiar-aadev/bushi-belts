import {
  ChevronRight,
  ShoppingBag,
  ShieldCheck,
  Star,
  Medal,
} from "lucide-react";

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

export default function Hero({
  cartCount,
  onOpenCart,
  selectedBelt,
  selectedStripes,
  threadColor,
  name,
  academy,
}) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="font-serif text-3xl font-bold text-amber-400">
              武
            </div>
            <div>
              <div className="font-serif text-lg tracking-[0.18em]">
                BUSHI BELTS
              </div>
              <div className="text-[10px] uppercase tracking-[0.35em] text-zinc-400">
                Faixas artesanais premium
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-zinc-300 md:flex">
            <a href="#colecao" className="transition hover:text-amber-400">
              Coleção
            </a>
            <a href="#personalizar" className="transition hover:text-amber-400">
              Personalizar
            </a>
            <a href="#diferenciais" className="transition hover:text-amber-400">
              Diferenciais
            </a>
          </nav>

          <button
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 px-4 py-2 text-sm font-medium text-amber-300 transition hover:bg-amber-400 hover:text-black"
          >
            <ShoppingBag className="h-4 w-4" />
            Carrinho
            {cartCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden px-6 py-20 lg:px-10 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,168,50,0.12),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(139,32,32,0.12),transparent_30%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-400">
              <span className="h-px w-8 bg-amber-400" />
              Honre a sua jornada
            </div>
            <h1 className="max-w-4xl font-serif text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              A faixa que transforma{" "}
              <span className="text-amber-400 italic font-medium">esforço</span>{" "}
              em presença.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              Mais do que um acessório, sua faixa é um símbolo visível da sua
              evolução. Crie uma peça premium, personalizada e pronta para
              representar seu nome dentro e fora do tatame.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#personalizar"
                className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300"
              >
                Montar minha faixa
                <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="#diferenciais"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-medium text-white transition hover:border-amber-400 hover:text-amber-300"
              >
                Ver diferenciais
              </a>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                ["100%", "personalizável"],
                ["Premium", "acabamento artesanal"],
                ["Brasil", "entrega nacional"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                >
                  <div className="font-serif text-3xl text-amber-400">
                    {value}
                  </div>
                  <div className="mt-1 text-sm uppercase tracking-[0.25em] text-zinc-400">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/8 to-white/3 p-6 shadow-2xl shadow-black/40 backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                    Faixa em destaque
                  </div>
                  <div className="mt-2 font-serif text-3xl text-white">
                    {selectedBelt.name}
                  </div>
                </div>
                <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-amber-300">
                  {selectedBelt.level}
                </span>
              </div>

              <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
                <BeltBar
                  belt={selectedBelt}
                  stripes={selectedStripes}
                  embroideryColor={threadColor}
                  large
                />
                <div className="mt-6 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                      Assinatura da peça
                    </div>
                    <div
                      className="mt-2 font-serif text-2xl"
                      style={{ color: threadColor.hex }}
                    >
                      {name || "Seu nome bordado"}
                    </div>
                    <div className="mt-1 text-sm text-zinc-400">
                      {academy || "Sua academia ou equipe"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                      A partir de
                    </div>
                    <div className="mt-2 font-serif text-3xl text-amber-400">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(selectedBelt.price)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: ShieldCheck, title: "Durabilidade real" },
                  { icon: Medal, title: "Presença premium" },
                  { icon: Star, title: "Detalhe artesanal" },
                ].map(({ icon: Icon, title }) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <Icon className="h-5 w-5 text-amber-400" />
                    <div className="mt-3 text-sm font-medium text-white">
                      {title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
