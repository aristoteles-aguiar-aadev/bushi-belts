/* import { CheckCircle2 } from "lucide-react";

function BeltBar({ belt }) {
  return (
    <div
      className="relative h-4 overflow-hidden rounded-sm border border-white/10"
      style={{
        background: `linear-gradient(90deg, ${belt.color}, ${belt.accent})`,
      }}
    >
      <div className="absolute right-0 top-0 h-full w-[18%] bg-black/40" />
    </div>
  );
}

export default function BeltSelector({ belts, selectedBelt, onSelectBelt }) {
  return (
    <section
      id="colecao"
      className="border-y border-white/10 px-6 py-16 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-400">
          <span className="h-px w-8 bg-amber-400" />
          Coleção completa
        </div>
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-serif text-4xl font-bold text-white sm:text-5xl">
              Escolha a faixa que representa o seu momento.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-zinc-400">
            Cada graduação comunica uma fase da sua história. Criamos um
            catálogo visual e objetivo para o cliente identificar rapidamente
            sua faixa e sentir valor antes mesmo de comprar.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {belts.map((belt) => {
            const active = selectedBelt.id === belt.id;
            return (
              <button
                key={belt.id}
                onClick={() => onSelectBelt(belt)}
                className={`group rounded-[1.75rem] border p-6 text-left transition ${active ? "border-amber-400/50 bg-amber-400/10" : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-serif text-3xl text-white">
                      {belt.name}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-[0.28em] text-zinc-500">
                      {belt.level}
                    </div>
                  </div>
                  {active && (
                    <CheckCircle2 className="h-6 w-6 text-amber-400" />
                  )}
                </div>
                <div className="mt-6">
                  <BeltBar belt={belt} />
                </div>
                <p className="mt-5 text-sm leading-7 text-zinc-400">
                  {belt.tagline}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="font-serif text-2xl text-amber-400">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(belt.price)}
                  </span>
                  <span className="text-sm text-zinc-500 group-hover:text-zinc-300">
                    Selecionar
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
 */
export default function BeltSelector({
  belts,
  selectedBelt,
  onSelectBelt,
  category,
}) {
  return (
    <section
      id="colecao"
      className="border-y border-white/10 px-6 py-16 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-400">
          <span className="h-px w-8 bg-amber-400" />
          {category === "kids" ? "Coleção Kids" : "Coleção Adulta"}
        </div>

        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-serif text-4xl font-bold text-white sm:text-5xl">
              {category === "kids"
                ? "Escolha a faixa ideal para o atleta mirim."
                : "Escolha a faixa que representa o seu momento."}
            </h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {belts.map((belt) => {
            const active = selectedBelt.id === belt.id;
            return (
              <button
                key={belt.id}
                onClick={() => onSelectBelt(belt)}
                className={`group rounded-[1.75rem] border p-6 text-left transition ${
                  active
                    ? "border-amber-400/50 bg-amber-400/10"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                }`}
              >
                <div className="font-serif text-3xl text-white">
                  {belt.name}
                </div>
                <div className="mt-1 text-xs uppercase tracking-[0.28em] text-zinc-500">
                  {belt.level}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
