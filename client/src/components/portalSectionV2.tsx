import { useState } from 'react'
import { cards, perfilCards, perfiles } from '@/data/plataformas'
import type { PerfilId } from '@/data/plataformas'
import logoSoyCultura from '@/assets/logos/logo_soycultura.svg'
import logoEstimulos  from '@/assets/logos/logo_estimulos.svg'
import logoSIPA       from '@/assets/logos/logo_sipa.svg'
import logoSIA        from '@/assets/logos/logo_sia.svg'
import logoSINIC      from '@/assets/logos/logo_sinic.svg'

const tiraItems = [
  { nombre: 'SoyCultura', url: 'https://soycultura.mincultura.gov.co',    logo: logoSoyCultura, descripcion: 'Registro Nacional de Agentes Culturales' },
  { nombre: 'Estímulos',  url: 'https://convocatorias.mincultura.gov.co',  logo: logoEstimulos,  descripcion: 'Becas, premios y residencias artísticas' },
  { nombre: 'SIPA',       url: 'https://sipapublico.mincultura.gov.co/',   logo: logoSIPA,       descripcion: 'Sistema de información de patrimonio y memoria' },
  { nombre: 'SIA',        url: 'https://siartes.mincultura.gov.co',        logo: logoSIA,        descripcion: 'Sistema de información para las artes' },
  { nombre: 'SINIC',      url: 'http://sinic.gov.co',                      logo: logoSINIC,      descripcion: 'Sistema nacional de información cultural' },
]

const iniciales: Record<string, string> = {
  explorar:   'Ec',
  participar: 'Pc',
  tramites:   'Tc',
  investigar: 'Ic',
  difundir:   'Dc',
}

const etiquetas: Record<string, { label: string; color: string }> = {
  explorar:   { label: 'Acceso libre',     color: '#3B82F6' },
  participar: { label: 'Convocatorias',    color: '#F59E0B' },
  tramites:   { label: 'Registro oficial', color: '#EF4444' },
  investigar: { label: 'Datos abiertos',   color: '#8B5CF6' },
  difundir:   { label: 'Contenido libre',  color: '#10B981' },
}

function V2Card({
  card,
  index,
  forceReveal,
  dimmed,
}: {
  card: typeof cards[number]
  index: number
  forceReveal: boolean
  dimmed: boolean
}) {
  const { label, color } = etiquetas[card.id]
  const operativas = card.plataformas.filter(p => p.estado === 'operativa').slice(0, 5)
  const num = String(index + 1).padStart(2, '0')

  return (
    <article
      className={[
        'v2-card',
        forceReveal ? 'v2-card--activa' : '',
        dimmed      ? 'v2-card--inactiva' : '',
      ].filter(Boolean).join(' ')}
    >
      {/* ── Header — siempre visible, invierte color ── */}
      <div className="v2-card__head">
        <div>
          <p className="v2-card__titulo">{card.titulo}</p>
          <p className="v2-card__sub">{operativas.length} plataformas operativas</p>
        </div>
        <span className="v2-card__num">{num}</span>
      </div>

      {/* ── Display grande (positivo — visible en reposo) ── */}
      <div className="v2-card__display">
        <span className="v2-card__inicial">{iniciales[card.id]}</span>
      </div>

      {/* ── Reveal (negativo — visible en hover / activa) ── */}
      <div className="v2-card__reveal">
        <p className="v2-card__necesidad">"{card.necesidad}"</p>
        <ul className="v2-card__lista">
          {operativas.map(p => (
            <li key={p.nombre}>
              <a href={p.url} target="_blank" rel="noopener noreferrer">
                {p.nombre}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Footer ── */}
      <div className="v2-card__foot">
        <span
          className="v2-card__tag"
          style={{ '--tag-color': color } as React.CSSProperties}
        >
          {label}
        </span>
        <span className="v2-card__cta">Ver portales →</span>
      </div>
    </article>
  )
}

export default function PortalSectionV2() {
  const [perfil, setPerfil] = useState<PerfilId | null>(null)
  const activas = perfil ? new Set(perfilCards[perfil]) : null

  return (
    <section className="portal-v2">
      <div className="portal-v2__inner">

        {/* ── Encabezado ──────────────────────────────────── */}
        <div className="boceto-header">
          <span className="boceto-header__tag">Versión 2 — positivo / negativo</span>
          <h2 className="boceto-header__titulo">
            Descubre la <em>Cultura</em>
          </h2>
          <p className="boceto-header__sub">
            La información cultural de Colombia en un solo lugar.
          </p>
        </div>

        <div className="portal-v2__grid">
          {cards.map((card, i) => (
            <V2Card
              key={card.id}
              card={card}
              index={i}
              forceReveal={activas ? activas.has(card.id) : false}
              dimmed={activas ? !activas.has(card.id) : false}
            />
          ))}
        </div>

        {/* ── Filtro de perfil ────────────────────────────── */}
        <div className="eres-un">
          <span className="eres-un__label">Eres un</span>
          {perfiles.map(p => (
            <button
              key={p.id}
              className={`eres-un__opcion${perfil === p.id ? ' eres-un__opcion--activo' : ''}`}
              onClick={() => setPerfil(prev => prev === p.id ? null : p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* ── Sistemas de información ──────────────────────── */}
        <div className="tira-footer">
          <p className="tira-footer__label">Principales sistemas de información</p>
          <div className="tira-plataformas">
            {tiraItems.map(item => (
              <a
                key={item.nombre}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tira-item"
              >
                <img src={item.logo} alt={item.nombre} className="tira-item__logo" />
                <span className="tira-item__desc">{item.descripcion}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
