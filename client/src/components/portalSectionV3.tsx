import { useState } from 'react'
import { cards } from '@/data/plataformas'

const colores: Record<string, { bg: string; accent: string }> = {
  explorar:   { bg: '#F0EEFE', accent: '#4C3DC9' },
  participar: { bg: '#EBE8FD', accent: '#6D28D9' },
  tramites:   { bg: '#EDE9FE', accent: '#3730A3' },
  investigar: { bg: '#EAE5FD', accent: '#5B21B6' },
  difundir:   { bg: '#E8E3FC', accent: '#4338CA' },
}

const verbos: Record<string, string> = {
  explorar:   'Explorar',
  participar: 'Participar',
  tramites:   'Tramitar',
  investigar: 'Investigar',
  difundir:   'Difundir',
}

export default function PortalSectionV3() {
  const [activa, setActiva] = useState<string | null>(null)

  return (
    <section className="portal-v3">
      <div className="portal-v3__inner">
        {/* ── Encabezado ──────────────────────────────────── */}
        <div className="boceto-header">
          <span className="boceto-header__tag">Versión 3 — acordeón horizontal</span>
          <h2 className="boceto-header__titulo">
            Descubre la <em>Cultura</em>
          </h2>
          <p className="boceto-header__sub">
            La información cultural de Colombia en un solo lugar.
          </p>
        </div>

        {/* ── Acordeón ────────────────────────────────────── */}
        <div className="v3-accordion">
          {cards.map((card, i) => {
            const { bg, accent } = colores[card.id]
            const isActiva = activa === card.id
            const operativas = card.plataformas
              .filter(p => p.estado === 'operativa')
              .slice(0, 6)

            return (
              <div
                key={card.id}
                className={`v3-panel${isActiva ? ' v3-panel--activa' : ''}`}
                style={{ '--v3-bg': bg, '--v3-accent': accent } as React.CSSProperties}
                onMouseEnter={() => setActiva(card.id)}
                onMouseLeave={() => setActiva(null)}
              >
                {/* ── Vista estrecha (rotado) ── */}
                <div className="v3-panel__narrow">
                  <span className="v3-panel__num" style={{ color: accent }}>
                    0{i + 1}
                  </span>
                  <span className="v3-panel__rotado">{verbos[card.id]}</span>
                </div>

                {/* ── Vista expandida ── */}
                <div className="v3-panel__expanded">
                  <div className="v3-panel__exp-top">
                    <span className="v3-panel__accent-tag" style={{ color: accent }}>
                      {`0${i + 1} — ${card.titulo}`}
                    </span>
                    <h3 className="v3-panel__titulo">{card.titulo}</h3>
                    <p className="v3-panel__necesidad">"{card.necesidad}"</p>
                  </div>

                  <ul className="v3-panel__lista">
                    {operativas.map(p => (
                      <li key={p.nombre}>
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ '--link-accent': accent } as React.CSSProperties}
                        >
                          <span className="v3-panel__arrow">→</span>
                          {p.nombre}
                        </a>
                      </li>
                    ))}
                  </ul>

                  <div className="v3-panel__exp-foot">
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>
                      {card.plataformas.filter(p => p.estado !== 'caido').length} plataformas · {card.audiencia}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
