import { useId } from 'react';

const baseImage = '/products/belt-base.png';

function channels(hex) {
  return [1, 3, 5].map(start => parseInt(hex.slice(start, start + 2), 16) / 255);
}

export default function BeltPreview({ belt, stripes = 0, color = '#bb9b62', name = '', academy = '' }) {
  const id = useId().replaceAll(':', '');
  const dark = belt.id.includes('black');
  const rgb = channels(belt.color);
  const rank = channels(dark ? '#c12e27' : '#171b18');
  const variant = belt.id.startsWith('kids-') && ['#FFFFFF', '#111111'].includes(belt.accent);
  function tint(key, values) {
    return <filter id={`${id}-${key}`} colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncR type="linear" slope={values[0] * 1.5 + .06} intercept=".008"/>
        <feFuncG type="linear" slope={values[1] * 1.5 + .06} intercept=".008"/>
        <feFuncB type="linear" slope={values[2] * 1.5 + .06} intercept=".008"/>
      </feComponentTransfer>
    </filter>;
  }
  return <div className="belt-preview belt-photo" role="img" aria-label={`Faixa ${belt.name}, ${stripes} graus, ponteira à direita${name ? ', bordado '+name : ''}`}>
    <svg viewBox="0 0 780 353" fill="none" aria-hidden="true">
      <defs>
        {tint('fabric', rgb)}{tint('rank', rank)}
        {variant && tint('variant', channels(belt.accent))}
        <clipPath id={`${id}-rank-area`}><path d="M587 191L689 242L669 284L568 234Z"/></clipPath>
        <mask id={`${id}-variant-area`} maskUnits="userSpaceOnUse" x="0" y="0" width="780" height="353" style={{ maskType: 'luminance' }}>
          <rect width="780" height="353" fill="black"/>
          <g fill="none" stroke="white" strokeWidth="15" strokeLinecap="butt">
            <path d="M88 270L309 163M469 182L718 290"/>
            <path d="M199 88C299 83 497 85 592 92"/>
            <path d="M194 119C226 139 292 154 337 158M458 158C514 151 563 139 594 121"/>
            <path d="M388 108C356 124 363 171 412 195M407 130L444 153"/>
          </g>
        </mask>
      </defs>
      <image href={baseImage} width="780" height="353" filter={`url(#${id}-fabric)`}/>
      {variant && <image href={baseImage} width="780" height="353" filter={`url(#${id}-variant)`} mask={`url(#${id}-variant-area)`}/>}
      <image href={baseImage} width="780" height="353" filter={`url(#${id}-rank)`} clipPath={`url(#${id}-rank-area)`}/>
      <g transform="translate(584 198) rotate(27)">
        {Array.from({length:stripes},(_,i)=><rect key={i} x={8+i*11.5} y="0" width="5" height="39" fill="#f1ede2"/>)}
      </g>
      <g transform="translate(100 243) rotate(-27)">
        <rect width="63" height="36" rx="1" fill="#090909" stroke="#333831" strokeWidth="1.5"/>
        <image href="/logo/bushi-profile.jpg" x="14" y="1" width="35" height="34" preserveAspectRatio="xMidYMid meet"/>
        <rect x="2" y="2" width="59" height="32" rx="1" stroke="#b9b6aa" strokeOpacity=".35" strokeWidth=".6" strokeDasharray="1 1"/>
      </g>
      {academy && <g transform="translate(240 201) rotate(-24)"><text textAnchor="middle" dominantBaseline="central" fill={color} fontSize="15" fontWeight="600" fontFamily="DM Sans, sans-serif" letterSpacing="1" textLength={academy.length > 15 ? 140 : undefined} lengthAdjust="spacingAndGlyphs" stroke="#171912" strokeOpacity=".2" strokeWidth=".45" paintOrder="stroke fill">{academy}</text></g>}
      {name && <g transform="translate(536 194) rotate(28)"><text textAnchor="middle" dominantBaseline="central" fill={color} fontSize="15" fontWeight="600" fontFamily="DM Sans, sans-serif" letterSpacing=".5" textLength={name.length > 10 ? 96 : undefined} lengthAdjust="spacingAndGlyphs" stroke="#171912" strokeOpacity=".2" strokeWidth=".45" paintOrder="stroke fill">{name}</text></g>}
    </svg>
  </div>;
}
