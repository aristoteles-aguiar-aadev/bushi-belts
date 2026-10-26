import { ArrowUpRight, Check } from 'lucide-react';
import { catalog } from '../domain/catalog';
import BeltPreview from './BeltPreview';

const categories = [
  { id: 'kids', title: 'Kids.', kicker: '01 / Linha infantil', lines: ['Pequenos passos.', 'Grandes conquistas.'], caption: 'Cinza · Amarela · Laranja · Verde', belts: [catalog.kids.belts[2], catalog.kids.belts[4]] },
  { id: 'adult', title: 'Adulto.', kicker: '02 / Linha adulta', lines: ['Cada graduação.', 'Uma história para carregar.'], caption: 'Da primeira faixa ao legado', belts: [catalog.adult.belts[2], catalog.adult.belts[4]] },
];

export default function CategorySelector({ category, onChangeCategory }) {
  return <section className="category-section px-6 lg:px-10" aria-labelledby="category-title">
    <div className="mx-auto max-w-7xl">
      <div className="mb-6"><div className="eyebrow category-eyebrow">Escolha a categoria</div><h2 id="category-title" className="text-3xl">Cada jornada tem seu começo.</h2></div>
      <div className="category-grid">
        {categories.map(item => <button key={item.id} type="button" className={`category-card category-card--${item.id}${category === item.id ? ' is-selected' : ''}`} aria-pressed={category === item.id} aria-label={`Selecionar categoria ${item.id === 'kids' ? 'Kids, infantil' : 'Adulto'}`} onClick={() => onChangeCategory(item.id)}>
          <span className="category-kicker">{item.kicker}</span>
          <span className="category-name">{item.title}</span>
          <span className="category-description">{item.lines[0]}<br/>{item.lines[1]}</span>
          <span className="category-art" aria-hidden="true"><span className="category-product"><BeltPreview belt={item.belts[0]}/></span><span className="category-product category-product--second"><BeltPreview belt={item.belts[1]}/></span></span>
          {category === item.id && <span className="category-check"><Check size={12}/></span>}
          <span className="category-bottom"><span>{item.caption}</span><span className="category-arrow"><ArrowUpRight size={18}/></span></span>
        </button>)}
      </div>
    </div>
  </section>;
}
