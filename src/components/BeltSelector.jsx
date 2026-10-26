import BeltPreview from "./BeltPreview";
import { Check } from "lucide-react";


export default function BeltSelector({ belts, selectedBelt, onSelectBelt, category }) {
  return (
    <section id="colecao" className="border-t border-apple-separator px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-apple-accent mb-3">
            {category === "kids" ? "Coleção Kids" : "Coleção Adulta"}
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-apple-text sm:text-5xl">
            {category === "kids"
              ? "Escolha a faixa kids."
              : "Escolha sua faixa."}
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-apple-secondary">
            {category === "kids"
              ? "Depois da cor principal, você poderá selecionar a variação da faixa kids."
              : "Cada graduação comunica uma fase da sua história."}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {belts.map((belt) => {
            const active = selectedBelt.id === belt.id;

            return (
              <button
                key={belt.id}
                aria-pressed={active} onClick={() => onSelectBelt(belt)}
                className={`group relative rounded-2xl border p-6 text-left transition-all duration-200 ${
                  active
                    ? "border-apple-accent-border bg-apple-accent-subtle"
                    : "border-apple-separator bg-apple-surface hover:border-apple-separator-strong"
                }`}
              >
                {active && (
                  <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-apple-accent flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-black" />
                  </div>
                )}

                <div className="mb-4">
                  <div className="text-xl font-medium text-apple-text">{belt.name}</div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.15em] text-apple-tertiary mt-1">
                    {belt.level}
                  </div>
                </div>

                <div className="catalog-belt"><BeltPreview belt={active ? selectedBelt : belt}/></div>

                <p className="mt-4 text-[13px] leading-relaxed text-apple-secondary">
                  {belt.tagline}
                </p>

                <div className="mt-5 pt-4 border-t border-apple-separator flex items-center justify-between">
                  <span className="text-xl font-medium text-apple-accent">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(belt.price)}
                  </span>
                  <span className={`text-[13px] font-medium transition-colors ${active ? "text-apple-accent" : "text-apple-tertiary group-hover:text-apple-secondary"}`}>
                    {active ? "Selecionada" : "Selecionar"}
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
