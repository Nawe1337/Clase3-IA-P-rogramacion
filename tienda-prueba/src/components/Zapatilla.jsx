// Dibujo SVG de una zapatilla, coloreado por producto (no usamos fotos de terceros).
export default function Zapatilla({ color = '#ff5a36', className = '' }) {
  return (
    <svg className={className} viewBox="0 0 220 110" aria-hidden="true">
      <ellipse cx="110" cy="99" rx="92" ry="6" fill="rgba(0,0,0,.12)" />
      {/* suela */}
      <path d="M14 80 Q12 92 26 92 L194 92 Q206 92 204 80 Z" fill="#fafafa" stroke="#1c1917" strokeWidth="3" strokeLinejoin="round" />
      <path d="M18 86 L200 86" stroke="#1c1917" strokeWidth="2" opacity=".25" />
      {/* capellada */}
      <path
        d="M16 80 L22 52 Q26 38 44 41 L74 46 Q88 30 106 27 L124 29 Q132 50 158 58 L186 66 Q204 71 204 80 Z"
        fill={color}
        stroke="#1c1917"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* puntera y talón */}
      <path d="M160 58 L186 66 Q204 71 204 80 L168 80 Q160 70 160 58 Z" fill="rgba(255,255,255,.28)" />
      <path d="M22 52 Q26 38 44 41 L40 80 L16 80 Z" fill="rgba(0,0,0,.14)" />
      {/* franja lateral */}
      <path d="M58 74 Q100 50 150 62" fill="none" stroke="#fafafa" strokeWidth="7" strokeLinecap="round" />
      {/* cordones */}
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={96 + i * 9} y1={33 + i * 5} x2={108 + i * 9} y2={40 + i * 5} stroke="#fafafa" strokeWidth="3" strokeLinecap="round" />
      ))}
    </svg>
  )
}
