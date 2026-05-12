const entidades = [
  { id: 'museo-nacional',      label: 'Museo Nacional de Colombia' },
  { id: 'biblioteca-nacional', label: 'Biblioteca Nacional de Colombia' },
  { id: 'delia',               label: 'Delia — Centro Nacional de las Artes Delia Zapata Olivella' },
  { id: 'santa-clara',         label: 'Museo Santa Clara / Museo Colonial' },
  { id: 'casa-museo',          label: 'Casa Museo Quinta de Bolívar' },
  { id: 'casa-florero',        label: 'Museo de la Independencia — Casa del Florero' },
  { id: 'icanh',               label: 'ICANH' },
  { id: 'caro-cuervo',         label: 'Instituto Caro y Cuervo' },
  { id: 'archivo-general',     label: 'Archivo General de la Nación Colombia' },
]

const sistemas = [
  { id: 'pulep',      label: 'PULEP' },
  { id: 'soy-cultura', label: 'SOY CULTURA' },
  { id: 'siempre',    label: 'SIEMPRE' },
  { id: 'sinic',      label: 'SINIC' },
  { id: 'sipa',       label: 'SIPA PÚBLICO' },
]

export default function UnidadesSection() {
  return (
    <>
      {/* ── Unidades administrativas ──────────────────────────── */}
      <section className="unidades">
        <div className="unidades__inner">
          <h2 className="unidades__title">Unidades Administrativas y Entidades Adscritas</h2>

          <div className="unidades__logos">
            {entidades.map(e => (
              <a key={e.id} href="#" className="unidades__logo-item" aria-label={e.label}>
                <span className="unidades__logo-placeholder">{e.id.toUpperCase().slice(0, 4)}</span>
              </a>
            ))}
          </div>

          <a href="#" className="unidades__btn">Ver más portales de entidades</a>
        </div>
      </section>

      {/* ── Sistemas de información ───────────────────────────── */}
      <section className="sistemas">
        <div className="sistemas__inner">
          <h2 className="sistemas__title">Sistemas de Información</h2>

          <div className="sistemas__pills">
            {sistemas.map(s => (
              <a key={s.id} href="#" className="sistemas__pill">{s.label}</a>
            ))}
          </div>

          <a href="#" className="sistemas__btn">Ver todos los sistemas de información</a>
        </div>
      </section>
    </>
  )
}
