import HeaderMincultura from '@/components/headerMincultura'
import FooterMincultura from '@/components/footerMincultura'
import AccesibilidadBar from '@/components/accesibilidadBar'
import PortalSection from '@/components/portalSection'
import PortalSectionV1 from '@/components/portalSectionV1'
import PortalSectionV2 from '@/components/portalSectionV2'
import PortalSectionV3 from '@/components/portalSectionV3'
import EjesSection from '@/components/ejesSection'

function Home() {
  return (
    <div className="page-layout">
      <AccesibilidadBar />
      <HeaderMincultura />

      {/* ── Espacio en blanco scrolleable ─────────────────── */}
      <section className="home-hero" />

      {/* ── Portal misional (cards + banda institucional) ── */}
      <PortalSection />

      {/* ── Versión 1 — tarjetas con flip ───────────────── */}
      <PortalSectionV1 />

      {/* ── Versión 2 — positivo / negativo ─────────────── */}
      <PortalSectionV2 />

      {/* ── Versión 3 — acordeón horizontal ─────────────── */}
      <PortalSectionV3 />

      {/* ── Ejes estratégicos ────────────────────────────── */}
      <EjesSection />

      <FooterMincultura />
    </div>
  )
}

export default Home
