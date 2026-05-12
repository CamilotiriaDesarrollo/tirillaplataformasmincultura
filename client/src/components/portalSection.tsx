import { useState, useEffect, useRef } from 'react'
import { cards, entidades, perfilCards, perfiles, type CardId, type PerfilId, type Estado } from '@/data/plataformas'

// ── Estado tags ──────────────────────────────────────────────
const estadoMeta: Record<Estado, { label: string; bg: string; color: string } | null> = {
  'operativa':      null,
  'validar-acceso': { label: 'Requiere verificación', bg: '#FAEEDA', color: '#854F0B' },
  'desactualizada': { label: 'Desactualizada',         bg: '#FFD8A8', color: '#993C1D' },
  'caido':          { label: 'No disponible',          bg: '#FCEBEB', color: '#A32D2D' },
}

// ── Iconos SVG ───────────────────────────────────────────────
function IcoExplorar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="currentColor" stroke="none"/>
      <circle cx="12" cy="12" r="1.5" fill="white" stroke="none"/>
    </svg>
  )
}
function IcoParticipar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C9 2 7 4 7 6c0 3 2 4 2 7h6c0-3 2-4 2-7 0-2-2-4-5-4z"/>
      <path d="M9 13h6"/>
      <path d="M9.5 16h5"/>
      <path d="M10 19h4"/>
    </svg>
  )
}
function IcoTramites() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="12" height="16" rx="2"/>
      <path d="M8 7h6M8 11h6M8 15h3"/>
      <circle cx="17" cy="17" r="4"/>
      <path d="M15.5 17l1 1 2-2"/>
    </svg>
  )
}
function IcoInvestigar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/>
      <path d="M21 21l-4.35-4.35"/>
      <path d="M8 11h6M11 8v6"/>
    </svg>
  )
}
function IcoDifundir() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h3"/>
      <path d="M19 12h3"/>
      <circle cx="12" cy="12" r="3"/>
      <path d="M6.34 6.34A8 8 0 0 0 4 12"/>
      <path d="M17.66 6.34A8 8 0 0 1 20 12"/>
      <path d="M4 20A14 14 0 0 1 4 4"/>
      <path d="M20 4a14 14 0 0 1 0 16"/>
    </svg>
  )
}

const iconos: Record<CardId, () => JSX.Element> = {
  explorar:   IcoExplorar,
  participar: IcoParticipar,
  tramites:   IcoTramites,
  investigar: IcoInvestigar,
  difundir:   IcoDifundir,
}

// ── Franja de perfiles ───────────────────────────────────────
function FranjaPerfiles({
  perfilActivo,
  onSelect,
  onCerrar,
}: {
  perfilActivo: PerfilId | null
  onSelect: (p: PerfilId | null) => void
  onCerrar: () => void
}) {
  const [collapsed, setCollapsed] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setCollapsed(true), 20000)
  }

  useEffect(() => {
    resetTimer()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  const handleSelect = (id: PerfilId) => {
    onSelect(perfilActivo === id ? null : id)
    setCollapsed(false)
    resetTimer()
  }

  if (collapsed) {
    return (
      <div className="franja franja--mini">
        <button className="franja__expand-btn" onClick={() => { setCollapsed(false); resetTimer() }}>
          ¿Quieres personalizar tu vista? <span>abrir</span>
        </button>
      </div>
    )
  }

  return (
    <div className="franja">
      <div className="franja__inner">
        {perfilActivo ? (
          <span className="franja__texto-activo">
            Vista para <strong>{perfiles.find(p => p.id === perfilActivo)?.label}</strong>
            <button className="franja__link" onClick={() => onSelect(null)}>limpiar</button>
          </span>
        ) : (
          <span className="franja__pregunta">Hola, ¿quién eres hoy? Te ayudamos a encontrar más rápido.</span>
        )}
        <div className="franja__chips">
          {perfiles.map(p => (
            <button
              key={p.id}
              onClick={() => handleSelect(p.id)}
              className={`franja__chip${perfilActivo === p.id ? ' franja__chip--activo' : ''}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <button className="franja__cerrar" onClick={onCerrar} aria-label="Cerrar personalización">✕</button>
      </div>
    </div>
  )
}

// ── Card misional ────────────────────────────────────────────
const MAX_VISIBLE = 5

function CardMisional({
  card,
  destacada,
  atenuada,
}: {
  card: typeof cards[number]
  destacada: boolean
  atenuada: boolean
}) {
  const [expandida, setExpandida] = useState(false)
  const Icono = iconos[card.id]

  const plataformasVisibles = card.plataformas.filter(p => p.estado !== 'caido' || card.id === 'participar')
  const visible = expandida ? plataformasVisibles : plataformasVisibles.slice(0, MAX_VISIBLE)
  const ocultas = plataformasVisibles.length - MAX_VISIBLE

  return (
    <article
      className={[
        'card-misional',
        destacada ? 'card-misional--destacada' : '',
        atenuada  ? 'card-misional--atenuada'  : '',
      ].filter(Boolean).join(' ')}
    >
      {destacada && <span className="card-misional__badge">Para ti</span>}

      <div className="card-misional__header">
        <div className="card-misional__icono">
          <Icono />
        </div>
        <div>
          <h3 className="card-misional__titulo">{card.titulo}</h3>
          <p className="card-misional__necesidad">"{card.necesidad}"</p>
        </div>
      </div>

      <ul className="card-misional__lista">
        {visible.map(p => {
          const meta = estadoMeta[p.estado]
          const esInactiva = p.estado === 'caido'
          return (
            <li key={p.nombre} className="card-misional__item">
              {esInactiva ? (
                <span className="card-misional__plataforma card-misional__plataforma--inactiva">
                  {p.nombre}
                </span>
              ) : (
                <a
                  href={p.url}
                  className="card-misional__plataforma"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {p.nombre}
                </a>
              )}
              {meta && (
                <span
                  className="card-misional__tag"
                  style={{ background: meta.bg, color: meta.color }}
                >
                  {meta.label}
                </span>
              )}
            </li>
          )
        })}
      </ul>

      {!expandida && ocultas > 0 && (
        <button className="card-misional__ver-mas" onClick={() => setExpandida(true)}>
          + {ocultas} más
        </button>
      )}

      <footer className="card-misional__footer">
        <span>{card.plataformas.filter(p => p.estado !== 'caido').length} plataformas</span>
        <span className="card-misional__audiencia">{card.audiencia}</span>
      </footer>
    </article>
  )
}

// ── Banda institucional ──────────────────────────────────────
function BandaInstitucional() {
  return (
    <div className="banda-inst">
      <p className="banda-inst__label">Entidades adscritas y vinculadas</p>
      <div className="banda-inst__logos">
        {entidades.map(e => (
          <a
            key={e.sigla}
            href={e.url !== '#' ? e.url : undefined}
            target={e.url !== '#' ? '_blank' : undefined}
            rel="noopener noreferrer"
            className={`banda-inst__item${e.url === '#' ? ' banda-inst__item--pendiente' : ''}`}
            title={e.nombre}
          >
            <span className="banda-inst__sigla">{e.sigla}</span>
            <span className="banda-inst__nombre">{e.nombre}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

// ── Portal Section (raíz) ────────────────────────────────────
export default function PortalSection() {
  const [perfil, setPerfil] = useState<PerfilId | null>(null)
  const [franjaVisible, setFranjaVisible] = useState(
    () => localStorage.getItem('mc_perfil_dismissed') !== 'true'
  )

  const cerrarFranja = () => {
    localStorage.setItem('mc_perfil_dismissed', 'true')
    setFranjaVisible(false)
  }

  const cardDestacadas: CardId[] = perfil ? perfilCards[perfil] : []

  return (
    <section className="portal-section">
      <div className="portal-section__inner">

        {franjaVisible && (
          <FranjaPerfiles
            perfilActivo={perfil}
            onSelect={setPerfil}
            onCerrar={cerrarFranja}
          />
        )}

        <div className="portal-grid">
          {cards.map(card => (
            <CardMisional
              key={card.id}
              card={card}
              destacada={cardDestacadas.includes(card.id)}
              atenuada={perfil !== null && !cardDestacadas.includes(card.id)}
            />
          ))}
        </div>

        <BandaInstitucional />

      </div>
    </section>
  )
}
