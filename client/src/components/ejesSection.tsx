const ejes = [
  { id: 'educacion',        label: 'Educación\nArtística y\nCultural',               color: '#F7931D' },
  { id: 'infraestructuras', label: 'Infraestructuras\nCulturales para\nla Vida',      color: '#00BCD4' },
  { id: 'economia',         label: 'Economía\nPopular',                               color: '#8DB600' },
  { id: 'memoria',          label: 'Memoria\nSaberes y\nTerritorios',                 color: '#D6156F' },
  { id: 'paz',              label: 'Cultura\nde Paz',                                 color: '#43A047' },
  { id: 'mundo',            label: 'Cultura\nColombiana\nen el Mundo',                color: '#F26522' },
]

function Mariposa({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="eje-card__mariposa" aria-hidden="true">
      {/* Ala izquierda superior */}
      <path d="M30 24 C20 10, 2 8, 4 22 C6 32, 22 30, 30 24Z" fill={color} opacity="0.85" />
      {/* Ala izquierda inferior */}
      <path d="M30 26 C18 28, 8 38, 14 44 C20 50, 28 38, 30 26Z" fill={color} opacity="0.85" />
      {/* Ala derecha superior */}
      <path d="M34 24 C44 10, 62 8, 60 22 C58 32, 42 30, 34 24Z" fill={color} opacity="0.85" />
      {/* Ala derecha inferior */}
      <path d="M34 26 C46 28, 56 38, 50 44 C44 50, 36 38, 34 26Z" fill={color} opacity="0.85" />
      {/* Cuerpo */}
      <ellipse cx="32" cy="27" rx="2.5" ry="10" fill="#3B1E7A" />
      <circle cx="32" cy="16" r="2" fill="#3B1E7A" />
    </svg>
  )
}

export default function EjesSection() {
  return (
    <section className="ejes">
      <div className="ejes__inner">
        <h2 className="ejes__title">Ejes Estratégicos</h2>
        <p className="ejes__subtitle">
          Conoce las apuestas estratégicas del sector cultural en el Plan Nacional de Desarrollo 2022-2026.
        </p>

        <div className="ejes__grid">
          {ejes.map(eje => (
            <a
              key={eje.id}
              href="#"
              className="eje-card"
              style={{ '--eje-color': eje.color } as React.CSSProperties}
              aria-label={eje.label.replace(/\n/g, ' ')}
            >
              <div className="eje-card__body">
                <Mariposa color="#3B1E7A" />
                <span className="eje-card__label">
                  {eje.label.split('\n').map((line, i) => (
                    <span key={i} className="eje-card__line">{line}</span>
                  ))}
                </span>
              </div>
              <div className="eje-card__pennant" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
