import HeaderMincultura from '@/components/headerMincultura'
import TirillaF from '@/components/tirillaF'
import FooterMincultura from '@/components/footerMincultura'
import AccesibilidadBar from '@/components/accesibilidadBar'
import { sistemasDemo } from '@/data/sistemasDemo'

function Home() {
  return (
    <div className="page-layout">
      <AccesibilidadBar />
      <HeaderMincultura />

      {/* ── Contenido de la página (placeholder) ─────────── */}
      <section className="page-placeholder">
        <p className="page-placeholder__text">(Contenido de la página)</p>
      </section>

      {/* ── Tirillas animadas ─────────────────────────────── */}
      <TirillaF
        sistemas={sistemasDemo}
        labelFixed="Explora la cultura"
        labelCarousel="Aliados — Otras plataformas"
      />
      <TirillaF
        dark
        sistemas={sistemasDemo}
        labelFixed="Explora la cultura"
        labelCarousel="Aliados — Otras plataformas"
      />

      {/* ── Separador versión estática ────────────────────── */}
      <section className="page-version-sep">
        <p className="page-version-sep__text">(Contenido de la página)</p>
        <span className="page-version-sep__label">Versión estática</span>
      </section>

      {/* ── Tirillas estáticas ────────────────────────────── */}
      <TirillaF
        staticMode
        sistemas={sistemasDemo}
        labelFixed="Explora la cultura"
        labelCarousel="Aliados — Otras plataformas"
      />
      <TirillaF
        staticMode
        dark
        sistemas={sistemasDemo}
        labelFixed="Explora la cultura"
        labelCarousel="Aliados — Otras plataformas"
      />

      <FooterMincultura />
    </div>
  )
}

export default Home
