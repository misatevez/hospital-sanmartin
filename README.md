# Landing Page — Socios Benefactores
### Asociación Civil de Ayuda al Sector de Oncología y Otros del Hospital San Martín (Paraná)

---

## Objetivo del proyecto

Construir una landing page de captación de socios benefactores para la **Asociación Civil de Ayuda al Sector de Oncología y Otros del Hospital San Martín de Paraná**.

La página debe:
- Verse y sentirse como el sitio oficial del Hospital San Martín: [https://hospitalsanmartin.gob.ar/](https://hospitalsanmartin.gob.ar/)
- Usar el logo de la Asociación ya disponible en el repositorio (`2067802b-3e38-4ef2-b3bf-05552e09c784.jfif`)
- Generar confianza y conversión hacia la suscripción mensual

---

## Datos institucionales

| Campo | Dato |
|---|---|
| Nombre legal | Asociación Civil de Ayuda al Sector de Oncología y Otros del Hospital San Martín (Paraná) |
| CUIT | 30-71510651-1 |
| Domicilio social | Gualeguaychú 177, Paraná, Entre Ríos |
| Personería Jurídica | N° 200, Expte. N° 4296 |

---

## Identidad visual (referencia: hospitalsanmartin.gob.ar)

### Paleta de colores

| Uso | Color | Hex sugerido |
|---|---|---|
| Primario (fondo/header) | Azul oscuro institucional | `#1a3a5c` |
| Secundario (botones/acentos) | Azul medio | `#2563a8` |
| Acento/CTA principal | Verde esperanza | `#2e8b57` |
| Fondo secciones alternas | Blanco roto | `#f4f8fc` |
| Texto principal | Gris oscuro | `#1f2937` |
| Texto secundario | Gris medio | `#6b7280` |

### Tipografía
- Misma que usa el hospital: **Raleway** o **Open Sans** (Google Fonts, gratuitas)
- Títulos en mayúsculas con tracking amplio (como el sitio del hospital)
- Subtítulos en peso 300–400, cuerpo en 400–500

### Logo
- Archivo: `2067802b-3e38-4ef2-b3bf-05552e09c784.jfif` → renombrar a `logo-asociacion.jpg` al integrarlo
- Posición: esquina superior izquierda del header, junto al nombre del hospital

---

## Stack tecnológico recomendado

```
Next.js 14 (App Router)  →  Framework React con SSR
Tailwind CSS             →  Estilos utilitarios, fácil de mantener
shadcn/ui                →  Componentes accesibles y modernos
Vercel                   →  Deploy gratuito y rápido
```

> **Pendiente:** integración de pasarela de pago (Mercado Pago u otra). Ver sección al final.

> **Alternativa simple:** HTML + CSS + JS vanilla si se prefiere un sitio estático sin framework.

---

## Estructura de carpetas (Next.js)

```
hospital-sanmartin/
├── public/
│   ├── logo-asociacion.jpg          ← logo de la asociación
│   ├── hero-oncologia.jpg           ← foto impactante del sector
│   └── favicon.ico
├── src/
│   └── app/
│       ├── layout.tsx               ← fuentes, metadata
│       ├── page.tsx                 ← página principal (todas las secciones)
│       └── globals.css              ← variables CSS / Tailwind
├── components/
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── LaCausa.tsx
│   ├── Transparencia.tsx
│   ├── Planes.tsx
│   └── Footer.tsx
├── package.json
└── README.md
```

---

## Secciones de la página — detalle

### 1. Header (barra de navegación)
- Logo de la Asociación a la izquierda
- Nombre: **"Asociación Civil · Hospital San Martín"**
- Botón "Ser Socio" en el extremo derecho (color verde, llamativo)
- Fondo azul oscuro institucional (igual al header del sitio del hospital)

---

### 2. Hero (pantalla completa)
- **Foto de fondo:** imagen del sector de Oncología del hospital (foto impactante, filtro oscuro semi-transparente encima)
- **Título grande:** `"Sumate a la Red de Sostén del Sector de Oncología del San Martín"`
- **Subtítulo:** `"Tu aporte mensual permite que cientos de pacientes entrerrianos reciban su tratamiento con la dignidad y el equipamiento que merecen."`
- **Botón CTA primario:** `"Sumarme como Socio Benefactor"` → ancla a la sección de planes
- Overlay: degradado azul oscuro de abajo hacia arriba para que el texto sea legible

---

### 3. El Problema / La Causa
- Fondo blanco o azul muy claro
- Ícono o pequeña ilustración de cinta del cáncer / corazón
- Texto breve (3–4 párrafos cortos) explicando:
  - La cantidad de pacientes oncológicos que atiende el hospital
  - Los recursos que se necesitan (equipamiento, insumos, mejoras edilicias)
  - Por qué el aporte privado es necesario para complementar el presupuesto público
- **Destacar en negrita** frases como *"cientos de familias entrerrianas"*, *"tratamiento digno"*

---

### 4. Transparencia
- Fondo verde suave o azul muy claro para diferenciarse
- Ícono de escudo o candado (confianza)
- **Título:** `"Tu dinero va directo a donde importa"`
- Puntos clave:
  - ✅ Los fondos ingresan directamente a la cuenta bancaria de la Asociación Civil
  - ✅ Publicamos un informe de gestión cada 90 días
  - ✅ Personería Jurídica N° 200 — entidad legalmente constituida
  - ✅ Podés darte de baja cuando quieras avisándonos

---

### 5. Planes de suscripción mensual ⭐ (sección central)

Tres tarjetas centradas, con la del medio destacada visualmente:

| Plan | Monto | Destacado |
|---|---|---|
| Socio Amigo | `$3.000 / mes` | No |
| **Socio Protector** | **`$7.000 / mes`** | **Sí (borde más grueso, badge "Recomendado")** |
| Socio Esperanza | `$15.000 / mes` | No |

**Debajo de las 3 tarjetas:**
- Link discreto: `"Quiero colaborar con otro monto"` → a definir cuando se integre la pasarela de pago
- Texto aclaratorio pequeño pero visible:
  > *"El aporte es mensual. Podés cancelar cuando quieras avisándonos por WhatsApp."*

**Botones de cada plan:** los links de pago se agregarán en la etapa de integración de pasarela (pendiente).

---

### 6. Footer
- Fondo azul oscuro (igual que el del sitio del hospital)
- Logo pequeño de la Asociación
- **Datos legales obligatorios:**
  - Asociación Civil de Ayuda al Sector de Oncología y Otros del Hospital San Martín
  - CUIT: 30-71510651-1
  - Domicilio: Gualeguaychú 177, Paraná, Entre Ríos
  - Personería Jurídica N° 200, Expte. N° 4296
- Redes sociales del hospital (@hospitalsanmartin)
- Leyenda: **"Campaña Oficial Digital"**
- Copyright: `© 2026 Asociación Civil · Hospital San Martín`

---

## Paso a paso para construir el proyecto

### Paso 1 — Inicializar el proyecto

```bash
npx create-next-app@latest hospital-sanmartin --typescript --tailwind --app --src-dir
cd hospital-sanmartin
```

### Paso 2 — Instalar dependencias adicionales

```bash
npm install @shadcn/ui lucide-react
npx shadcn@latest init
```

### Paso 3 — Agregar fuentes (Google Fonts)

En `src/app/layout.tsx` importar **Raleway** desde `next/font/google`:

```ts
import { Raleway } from 'next/font/google'
const raleway = Raleway({ subsets: ['latin'], weight: ['300','400','600','700'] })
```

### Paso 4 — Configurar la paleta en Tailwind

En `tailwind.config.ts` extender los colores con la paleta institucional definida arriba.

### Paso 5 — Agregar los assets

1. Renombrar `2067802b-3e38-4ef2-b3bf-05552e09c784.jfif` → `logo-asociacion.jpg`
2. Copiar a `/public/logo-asociacion.jpg`
3. Conseguir o solicitar foto del sector de Oncología → `/public/hero-oncologia.jpg`

### Paso 6 — Construir los componentes en orden

1. `Header.tsx` — logo + nav + botón CTA
2. `Hero.tsx` — foto de fondo + título + subtítulo + botón
3. `LaCausa.tsx` — sección descriptiva del problema
4. `Transparencia.tsx` — puntos de confianza
5. `Planes.tsx` — 3 tarjetas de suscripción + texto de cancelación
6. `Footer.tsx` — datos legales + redes + leyenda

### Paso 7 — Revisión de contenido

- [ ] Verificar todos los datos legales (CUIT, domicilio, Personería)
- [ ] Confirmar montos de suscripción con el cliente
- [ ] Conseguir foto para el Hero (sector Oncología)
- [ ] Redactar texto definitivo de "La Causa" con el cliente
- [ ] Definir plazo de los informes de transparencia (cada 90 días)

### Paso 8 — Deploy

```bash
# Conectar repositorio a Vercel (gratuito)
npm install -g vercel
vercel
```

O conectar el repositorio GitHub directamente en [vercel.com](https://vercel.com).

---

## Checklist final antes de publicar

- [ ] La paleta de colores replica la estética del sitio del hospital
- [ ] El logo de la Asociación se ve correctamente en header y footer
- [ ] El texto de cancelación libre es visible junto a los planes
- [ ] Los datos legales (CUIT, domicilio, personería) están en el footer
- [ ] La leyenda "Campaña Oficial Digital" aparece en el footer
- [ ] El sitio es responsive (móvil, tablet, escritorio)
- [ ] Las imágenes tienen texto alternativo (accesibilidad)
- [ ] La velocidad de carga es aceptable (imágenes comprimidas)

---

## Pendiente — Pasarela de pago

La integración de cobros es una etapa separada, a resolver una vez que el diseño y el contenido estén aprobados. Opciones a evaluar:

- **Mercado Pago Suscripciones** — la más usada en Argentina, soporta débito automático mensual
- **Modo / Getnet** — alternativas locales
- **Stripe** — opción internacional si se aceptan pagos con tarjeta extranjera

Cuando se defina la plataforma, se agregarán los links de suscripción en los botones de cada plan y el link de "monto libre".

---

## Contacto / Referencias

- Sitio del hospital (referencia visual): [https://hospitalsanmartin.gob.ar/](https://hospitalsanmartin.gob.ar/)
- Deploy gratuito: [https://vercel.com](https://vercel.com)
