export const catalog = {
  kids: {
    label: "Kids",
    belts: [
      { id: "kids-white", name: "Branca", level: "Kids Iniciante", color: "#F3EFE7", accent: "#D7D0C1", price: 79.9, maxStripes: 4, tagline: "O começo da jornada infantil." },
      { id: "kids-gray", name: "Cinza", level: "Kids Evolução", color: "#8C8C8C", accent: "#5F5F5F", price: 89.9, maxStripes: 4, tagline: "Primeiros passos com disciplina." },
      { id: "kids-yellow", name: "Amarela", level: "Kids Intermediária", color: "#D6B400", accent: "#A38800", price: 99.9, maxStripes: 4, tagline: "Confiança e crescimento no tatame." },
      { id: "kids-orange", name: "Laranja", level: "Kids Avanço", color: "#E67E22", accent: "#B85E12", price: 109.9, maxStripes: 4, tagline: "Energia, foco e evolução." },
      { id: "kids-green", name: "Verde", level: "Kids Destaque", color: "#2E8B57", accent: "#1F5F3B", price: 119.9, maxStripes: 4, tagline: "Mais maturidade e técnica." },
    ],
    sizes: ["M0", "M1", "M2", "M3"],
  },
  adult: {
    label: "Adulto",
    belts: [
      { id: "adult-white", name: "Branca", level: "Iniciante", color: "#F3EFE7", accent: "#D7D0C1", price: 89.9, maxStripes: 4, tagline: "O começo da jornada." },
      { id: "adult-blue", name: "Azul", level: "Fundamentos", color: "#224C8F", accent: "#173666", price: 119.9, maxStripes: 4, tagline: "Base técnica com identidade." },
      { id: "adult-purple", name: "Roxa", level: "Evolução", color: "#64359B", accent: "#47256E", price: 139.9, maxStripes: 4, tagline: "Refinamento, visão e controle." },
      { id: "adult-brown", name: "Marrom", level: "Maestria", color: "#6D4123", accent: "#4A2C15", price: 159.9, maxStripes: 4, tagline: "Próximo do topo." },
      { id: "adult-black", name: "Preta", level: "Excelência", color: "#1D1D1D", accent: "#000000", price: 219.9, maxStripes: 6, tagline: "Respeito conquistado no tatame." },
      { id: "adult-red", name: "Vermelha", level: "Legado", color: "#8C1F1F", accent: "#5D1212", price: 349.9, maxStripes: 7, tagline: "Um símbolo de história e honra." },
    ],
    sizes: ["A0", "A1", "A2", "A3", "A4", "A5", "F1", "F2", "F3"],
  },
};


export function priceOrder(items) {
 if (!Array.isArray(items) || !items.length || items.length > 50) throw new Error('Carrinho inválido.');
 const priced = items.map(item => {
  const category = Object.values(catalog).find(group => group.belts.some(belt => belt.id === item.baseBeltId));
  const belt = category?.belts.find(belt => belt.id === item.baseBeltId);
  if (!belt || !category.sizes.includes(item.size) || !Number.isInteger(item.qty) || item.qty < 1 || item.qty > 99) throw new Error('Configuração inválida.');
  const stripes = item.stripes ?? 0;
  if (!Number.isInteger(stripes) || stripes < 0 || stripes > belt.maxStripes) throw new Error('Graus inválidos.');
  if (item.kidsVariant != null && (!item.baseBeltId.startsWith('kids-') || item.baseBeltId === 'kids-white' || !['white', 'solid', 'black'].includes(item.kidsVariant))) throw new Error('Variação inválida.');
  const name = String(item.name || '').trim(), academy = String(item.academy || '').trim();
  if(name.length > 22 || academy.length > 28) throw new Error('Bordado muito longo.');
  const cents = Math.round(belt.price * 100) + (name || academy ? 1500 : 0);
  return {...item, belt, name, academy, unitPrice:cents/100, total:cents*item.qty/100};
 });
 return {items:priced,total:priced.reduce((sum,item)=>sum+Math.round(item.total*100),0)/100};
}
