# Portal ISI — Ministerio de las Culturas, las Artes y los Saberes

Portal de entrada a los sistemas de información del Ministerio. El usuario llega, se orienta por perfil o necesidad, y navega hacia los diferentes sistemas institucionales.

---

## Tabla de contenido

1. [Stack tecnológico](#stack-tecnológico)
2. [Estructura del proyecto](#estructura-del-proyecto)
3. [Correr el proyecto localmente](#correr-el-proyecto-localmente)
4. [Variables de entorno](#variables-de-entorno)
5. [API del servidor](#api-del-servidor)
6. [Arquitectura de datos del frontend](#arquitectura-de-datos-del-frontend)
7. [Componentes](#componentes)
8. [Sistema de diseño](#sistema-de-diseño)
9. [Despliegue en Vercel](#despliegue-en-vercel)
10. [Lineamientos institucionales](#lineamientos-institucionales)

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React + TypeScript | 18.x / 5.x |
| Bundler | Vite | 5.x |
| Backend | Node.js + Express + TypeScript | 20.x / 4.x |
| Estilos | CSS puro — metodología BEM, sin framework UI | — |
| Autenticación (futuro) | LDAP / Azure AD (SSO institucional) | — |
| Base de datos (futuro) | SQL Server | 2016+ |

---

## Estructura del proyecto

```
Interfase Sistemas/
├── client/                            # Frontend (Vite + React)
│   ├── src/
│   │   ├── assets/
│   │   │   └── logos/                 # SVGs institucionales (importados como ?raw o URL)
│   │   ├── components/
│   │   │   ├── headerMincultura.tsx   # Cabecera: barra GOV.CO, logo, buscador, red social, nav
│   │   │   ├── footerMincultura.tsx   # Pie: logos, contacto, servicios ciudadanía
│   │   │   ├── accesibilidadBar.tsx   # Barra flotante de accesibilidad (AA / NTC 5854)
│   │   │   ├── portalSection.tsx      # PRODUCCIÓN — cards misionales + filtro de perfil
│   │   │   ├── portalSectionV1.tsx    # Boceto V1 — tarjetas con efecto flip
│   │   │   ├── portalSectionV2.tsx    # Boceto V2 — estilo positivo / negativo
│   │   │   ├── portalSectionV3.tsx    # Boceto V3 — acordeón horizontal
│   │   │   ├── tirillaF.tsx           # Tira de sistemas: dock magnético + carrusel infinito
│   │   │   ├── tirillaStatic.tsx      # Tira de sistemas — variante sin animación
│   │   │   ├── tirillaA/B/C/D/G.tsx  # Prototipos de tira (exploración de variantes)
│   │   │   ├── ejesSection.tsx        # Ejes estratégicos del Ministerio
│   │   │   └── unidadesSection.tsx    # Unidades y entidades adscritas
│   │   ├── data/
│   │   │   ├── plataformas.ts         # Fuente de verdad — cards, perfiles, entidades
│   │   │   └── sistemasDemo.ts        # Logos y sistemas para TirillaF
│   │   ├── pages/
│   │   │   └── Home.tsx               # Página principal — ensambla todos los componentes
│   │   ├── types/
│   │   │   └── index.ts               # Tipos compartidos: Sistema, Usuario
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css                  # Todos los estilos (un solo archivo, sin CSS Modules)
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts                 # Alias @/ → src/, proxy /api → :3000
│
├── server/                            # Backend (Express + TypeScript)
│   ├── src/
│   │   ├── config/
│   │   │   └── sistemas.json          # Datos de sistemas (fuente temporal — reemplazar con DB)
│   │   ├── controllers/
│   │   │   └── sistemasController.ts
│   │   ├── routes/
│   │   │   └── sistemas.ts
│   │   └── index.ts                   # Entry point — puerto 3000
│   ├── .env.example
│   └── package.json
│
├── vercel.json                        # Configuración de despliegue (solo frontend)
└── README.md
```

---

## Correr el proyecto localmente

**Requisitos:** Node.js 20+, npm 10+

```bash
# Terminal 1 — servidor API (puerto 3000)
cd server
npm install
cp .env.example .env
npm run dev

# Terminal 2 — cliente (puerto 5173)
cd client
npm install
npm run dev
```

Abrir en el navegador: `http://localhost:5173`

Las llamadas a `/api/*` se proxean automáticamente al servidor en `:3000` (configurado en `vite.config.ts`).

> El backend no es necesario para ver el portal. Todos los datos del portal misional y la tira de sistemas son estáticos (definidos en `plataformas.ts` y `sistemasDemo.ts`).

---

## Variables de entorno

### `server/.env`

```env
PORT=3000
CLIENT_URL=http://localhost:5173
```

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor Express | `3000` |
| `CLIENT_URL` | Origen permitido en CORS | `http://localhost:5173` |

En producción, `CLIENT_URL` debe apuntar al dominio real del frontend.

---

## API del servidor

Base URL: `http://localhost:3000`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/api/health` | Verificación de estado | No |
| `GET` | `/api/sistemas` | Lista todos los sistemas registrados | No |

### Respuesta — `GET /api/sistemas`

```json
[
  {
    "id": "1",
    "nombre": "Sistema Ejemplo",
    "descripcion": "Descripción del sistema",
    "url": "https://ejemplo.mincultura.gov.co",
    "categoria": "General",
    "activo": true
  }
]
```

### Tipo `Sistema`

```typescript
interface Sistema {
  id: string
  nombre: string
  descripcion: string
  url: string
  icono?: string
  categoria: string
  activo: boolean
}
```

La fuente actual es `server/src/config/sistemas.json`. En fases siguientes se reemplaza por consultas a SQL Server.

---

## Arquitectura de datos del frontend

Los datos actuales son **estáticos en TypeScript**. El backend se activa cuando se integren datos reales desde la base de datos institucional.

### `client/src/data/plataformas.ts`

Fuente principal de contenido del portal.

| Exportación | Tipo | Descripción |
|-------------|------|-------------|
| `cards` | `CardData[]` | 5 tarjetas misionales con sus plataformas |
| `entidades` | `object[]` | Entidades adscritas y vinculadas al Ministerio |
| `perfilCards` | `Record<PerfilId, CardId[]>` | Cards destacadas por perfil de usuario |
| `perfiles` | `{ id, label }[]` | Lista de perfiles disponibles |

**Tipos:**

```typescript
type CardId    = 'explorar' | 'participar' | 'tramites' | 'investigar' | 'difundir'
type PerfilId  = 'ciudadano' | 'agente' | 'investigador' | 'gestor' | 'colaborador'
type Estado    = 'operativa' | 'validar-acceso' | 'desactualizada' | 'caido'

interface Plataforma {
  nombre: string
  url: string
  estado: Estado
  descripcion?: string
}

interface CardData {
  id: CardId
  titulo: string
  necesidad: string    // frase en primera persona del usuario
  audiencia: string
  plataformas: Plataforma[]
}
```

### `client/src/data/sistemasDemo.ts`

Datos para `TirillaF`. Los primeros `FIXED_COUNT = 4` son fijos (dock magnético); el resto entra al carrusel.

```typescript
interface SistemaDemo {
  id: string
  nombre: string
  descripcion: string
  sigla: string      // texto de respaldo si no hay logo SVG
  color: string      // color de fondo del logo de respaldo
  svgRaw?: string    // SVG importado como texto (import '...?raw')
}
```

---

## Componentes

### `portalSection.tsx` — Cards misionales con filtro de perfil

Componente central del portal. Grid de 5 tarjetas `CardMisional` + banda de entidades.

**Subcomponentes:**

- **`FranjaPerfiles`** — franja colapsable con chips de perfil. Colapsa automáticamente a los 20 s sin actividad. El estado de cierre se guarda en `localStorage` (`mc_perfil_dismissed`).
- **`CardMisional`** — lista las plataformas de una categoría. Con perfil activo, aplica `.--destacada` o `.--atenuada`. Permite expandir plataformas ocultas con el botón "+ N más" (máximo visible: `MAX_VISIBLE = 5`).
- **`BandaInstitucional`** — fila de logos/siglas de entidades adscritas con link externo.

**Props de `CardMisional`:**

| Prop | Tipo | Descripción |
|------|------|-------------|
| `card` | `CardData` | Datos de la tarjeta |
| `destacada` | `boolean` | Resaltar (el perfil activo la incluye) |
| `atenuada` | `boolean` | Atenuar (el perfil activo no la incluye) |

---

### `tirillaF.tsx` — Tira de sistemas

Barra de acceso rápido a sistemas institucionales. Divide los sistemas en dos zonas:

- **Sección fija** — primeros `FIXED_COUNT` sistemas con **dock magnético**: los logos escalan dinámicamente según la distancia del cursor (sin librerías externas, solo `getBoundingClientRect` + `requestAnimationFrame`).
- **Carrusel infinito** — el resto de sistemas en scroll automático continuo. Se pausa al hacer hover o touch y se puede navegar manualmente con flechas `‹ ›`.

**Props:**

| Prop | Tipo | Por defecto | Descripción |
|------|------|-------------|-------------|
| `sistemas` | `SistemaDemo[]` | — | Lista de sistemas a mostrar |
| `dark` | `boolean` | `false` | Variante de fondo oscuro |
| `staticMode` | `boolean` | `false` | Desactiva el scroll automático |
| `labelFixed` | `string` | `'Explora la cultura'` | Etiqueta sección fija |
| `labelCarousel` | `string` | `undefined` | Etiqueta del carrusel |

**Constantes ajustables** (al inicio del archivo):

```typescript
const FIXED_COUNT    = 4    // logos en la sección fija
const MAX_SCALE      = 1.9  // escala máxima del dock magnético
const INFLUENCE      = 100  // radio de influencia en px
const CAROUSEL_SPEED = 0.3  // px por fotograma (~18 px/s a 60 fps)
```

---

### Bocetos de diseño (`V1`, `V2`, `V3`)

Tres versiones alternativas visibles en `Home.tsx` para evaluación con el equipo. Se eliminan cuando se apruebe el diseño final.

| Componente | Concepto |
|------------|---------|
| `portalSectionV1` | Tarjetas con efecto flip (frente/dorso) |
| `portalSectionV2` | Cards en modo positivo / negativo |
| `portalSectionV3` | Acordeón horizontal |

---

### `headerMincultura.tsx`

Cabecera institucional en tres niveles:

1. **Barra GOV.CO** — logo GOV.CO, fondo `#0D0D2B`
2. **Encabezado principal** — logo Ministerio, buscador, redes sociales, mapa del sitio
3. **Barra de navegación** — ítems con dropdown y hamburguesa en mobile

---

### `footerMincultura.tsx`

Footer en cuatro columnas: logos institucionales + redes / datos del Ministerio / contacto y correspondencia / servicios ciudadanía.

---

## Sistema de diseño

### Tokens de color (CSS custom properties)

```css
:root {
  --min-morado:        #512DA8;  /* color institucional principal */
  --min-morado-oscuro: #311B92;  /* énfasis y hover */
  --min-footer:        #512DA8;  /* fondo del footer */
  --min-acento:        #F7D000;  /* amarillo de acento */
  --gov-bar-bg:        #0D0D2B;  /* barra GOV.CO */
}
```

### Estados de plataformas

| Estado | Etiqueta visible | Fondo | Texto |
|--------|-----------------|-------|-------|
| `operativa` | _(sin etiqueta)_ | — | — |
| `validar-acceso` | Requiere verificación | `#FAEEDA` | `#854F0B` |
| `desactualizada` | Desactualizada | `#FFD8A8` | `#993C1D` |
| `caido` | No disponible | `#FCEBEB` | `#A32D2D` |

### Colores de sistemas (logos de respaldo)

| Sistema | Color |
|---------|-------|
| SINIC | `#2E7D32` |
| SIPA | `#1565C0` |
| SI ARTES | `#C2410C` |
| CINEPROYECTO | `#B71C1C` |
| SOY CULTURA | `#00A9A5` |
| ESTÍMULOS | `#7C3AED` |
| ARTES PAZ | `#C2410C` |
| GASTROHERENCIA | `#B45309` |
| MAGUARÉ | `#0369A1` |
| MAGUARED | `#0891B2` |
| CONCERTACIÓN | `#6D28D9` |
| READING | `#065F46` |
| CELEBRA | `#9D174D` |

### Tipografía

```css
font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
font-size:   16px;
line-height: 1.5;
```

No se usa fuente personalizada hasta que se defina el sistema de diseño institucional.

### Ancho máximo y espaciado

| Propiedad | Valor |
|-----------|-------|
| Ancho máximo del contenido | `1440px` |
| Padding horizontal (desktop) | `32px` |
| Padding horizontal (mobile) | `16px` |
| Altura barra GOV.CO | `55px` |
| Altura logo Ministerio | `100px` |

### Breakpoints responsive

| Rango | Comportamiento principal |
|-------|--------------------------|
| `≥ 1025px` | Desktop — grid 5 columnas, TirillaF horizontal |
| `641–1024px` | Tablet — grid 2–3 columnas, TirillaF compacta |
| `≤ 640px` | Mobile — 1 columna, hamburguesa, TirillaF vertical |
| `≤ 375px` | Mobile M |
| `≤ 320px` | Mobile S |

### Alias de importación

`@/` apunta a `client/src/`. Configurado en `vite.config.ts` y `tsconfig.json`.

```typescript
import { cards } from '@/data/plataformas'
import TirillaF  from '@/components/tirillaF'
```

---

## Despliegue en Vercel

El archivo `vercel.json` en la raíz configura el build del frontend.

**Pasos para desplegar:**

1. Importar el repositorio en [vercel.com](https://vercel.com)
2. Vercel detecta automáticamente la configuración de `vercel.json`
3. No se requieren variables de entorno para el frontend estático

> **Sobre el backend:** el servidor Express no se despliega en Vercel. Para la vista de pruebas, el frontend funciona de forma autónoma (datos 100 % estáticos). Para integrar la API en un entorno real, desplegar el servidor en Railway, Render o la infraestructura del Ministerio, y apuntar `CLIENT_URL` al dominio del frontend.

---

## Lineamientos institucionales

- Accesibilidad **grado AA** según NTC 5854
- **Responsive Design** (móvil, tablet, escritorio)
- Certificados **SSL/TLS** en todo intercambio de datos
- Protección contra **XSS** en todos los componentes
- Autenticación vía **LDAP / Azure AD** (SSO institucional, fase futura)
- Toda app debe someterse a **Ethical Hacking** antes de pasar a producción
- Trazabilidad mínima: fecha/hora, IP origen, usuario, tipo de evento
- Interoperabilidad vía **Web Services SOAP** o **API RESTful**
- Documentación siempre en español
