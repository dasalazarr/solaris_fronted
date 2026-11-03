// Copy and sample data for the Solaris landing. Drafts from the landing PRD; the demo
// data is the product's fictitious Compras case (product/lib/solaris-data.ts).

export const NAV_LINKS = [
  { label: 'Producto', href: '#producto' },
  { label: 'Cómo funciona', href: '#demo' },
  { label: 'Packs', href: '#packs' },
  { label: 'Preguntas', href: '#preguntas' },
]

export const PROCESSES = ['Compras', 'Jurídico', 'Calidad', 'EUDR', 'Otro'] as const

export const THESIS_CARDS = [
  {
    icon: 'eyeOff',
    title: 'IA usada a escondidas',
    body: 'Documentos confidenciales en servicios que nadie controla.',
  },
  {
    icon: 'help',
    title: 'Respuestas sin fuente',
    body: 'Respuestas que nadie puede comprobar.',
  },
  {
    icon: 'files',
    title: 'Reglas en PDFs',
    body: 'Reglas en PDFs que nadie cruza con el día a día.',
  },
] as const

export const LOOP_NODES = [
  {
    step: 'Pregunta',
    code: 'Q-118',
    example: '¿Puede aprobarse el pedido PC-0412?',
  },
  {
    step: 'Cita',
    code: 'Política de compras · pág. 4 · §3.2',
    example: '«Pedidos superiores a 15.000 € requieren tres ofertas.»',
  },
  {
    step: 'Regla',
    code: 'R-COMP-07',
    example: 'Importe > 15.000 € ⇒ 3 ofertas + firma de Dirección Financiera',
  },
  {
    step: 'Hueco',
    code: 'PC-0412',
    example: 'PC-0412 supera 15.000 € y solo adjunta 2 ofertas.',
  },
  {
    step: 'Aprobación',
    code: 'Dir. Financiera',
    example: 'M. Ortega aprueba con la tercera oferta adjunta.',
  },
  {
    step: 'Registro',
    code: 'LOG-2291',
    example: '09:42 · PC-0412 aprobado · evidencia enlazada',
  },
]

export const PACKS = [
  {
    name: 'Compras',
    line: 'Umbrales, homologación, facturas sin pedido.',
    status: 'Demo disponible',
    tone: 'solar',
    icon: 'cart',
  },
  {
    name: 'Jurídico y mercantil',
    line: 'Vencimientos, cláusulas, anexos sin firmar.',
    status: 'Disponible bajo petición',
    tone: 'lavanda',
    icon: 'scale',
  },
  {
    name: 'Calidad IFS Food',
    line: 'Alérgenos, registros, auditorías.',
    status: 'Demo disponible bajo petición',
    tone: 'salvia',
    icon: 'shield',
  },
  {
    name: 'Diligencia EUDR',
    line: 'Geolocalización de parcelas, lotes, proveedores.',
    status: 'Disponible bajo petición',
    tone: 'niebla',
    icon: 'map',
  },
] as const

export const STEPS = [
  {
    title: 'Diagnóstico',
    body: 'Revisamos un proceso, sus documentos y sus reglas.',
  },
  {
    title: 'Piloto con sus documentos',
    body: 'Solaris trabaja con su caso real durante unas semanas.',
  },
  {
    title: 'Instalación',
    body: 'En su equipo, sin que los documentos salgan de él.',
  },
  {
    title: 'Acompañamiento',
    body: 'Ajustamos reglas y vistas a medida que el proceso cambia.',
  },
]

type FaqItem = { q: string; a: string; pendienteRevision?: boolean }

const FAQ_ALL: FaqItem[] = [
  {
    q: '¿Dónde están mis datos?',
    a: 'En la instalación local, en su propio equipo: los documentos no salen de su organización. La demostración usa datos de muestra en la nube, nunca documentos suyos.',
  },
  {
    q: '¿Qué modelo usa?',
    a: 'En la instalación local, un modelo de pesos abiertos que se ejecuta en su equipo. Le indicamos cuál y por qué durante el diagnóstico, según su volumen de documentos.',
  },
  {
    q: '¿Qué pasa si se equivoca?',
    a: 'Cada respuesta cita documento, página y párrafo, así que puede comprobarla en un clic. Y Solaris no ejecuta nada por su cuenta: toda acción requiere la aprobación de una persona y queda registrada.',
  },
  {
    q: '¿Necesito comprar hardware?',
    a: 'Depende del volumen. Muchas organizaciones pueden usar un equipo que ya tienen; si no es así, se lo indicamos en el diagnóstico antes de cualquier compromiso.',
  },
  {
    q: '¿Cuánto cuesta?',
    a: 'Depende del pack y del alcance. El diagnóstico termina con una propuesta de precio cerrado para el piloto y la instalación.',
  },
  {
    q: '¿Sustituye a mi ERP?',
    a: 'No. Solaris lee los documentos y las reglas que rodean a su ERP y señala lo que no cuadra. Su ERP sigue siendo el sistema de registro.',
  },
  {
    q: '¿Cómo encaja con el RGPD y el secreto profesional?',
    a: 'Con la instalación local, los datos no se ceden a terceros ni salen de su equipo. [Respuesta pendiente de revisión jurídica.]',
    pendienteRevision: true,
  },
]

/** Solo se publica lo revisado: una respuesta pendiente de revisión jurídica no sale en la web. */
export const FAQ = FAQ_ALL.filter((f) => !f.pendienteRevision)

/* ---------- Demo interactiva: pack Compras ---------- */

export type Citation = {
  n: number
  doc: string
  page: number
  section: string
  quote: string
  /** Part of the quote that gets the evidence highlight. */
  mark: string
}

export type DemoAnswer = {
  question: string
  answer: string
  citations: Citation[]
}

// Datos del caso de muestra de Compras, copiados de product/lib/solaris-data.ts (el
// producto es la fuente, O3). Las citas son fragmentos literales de sus evidencias.
const POLITICA = 'Política Corporativa de Compras y Gasto v3.2'
const SOLICITUD_PC0412 = 'Solicitud de Pedido PC-0412'

export const DEMO_QA: DemoAnswer[] = [
  {
    question: '¿Por qué está retenido el pedido PC-0412?',
    answer:
      'Falta una firma. La política exige la aprobación expresa de la Dirección Financiera para todo pedido que supere 15.000 € [1]. PC-0412 asciende a 18.450,00 € y ya adjunta las tres ofertas comparativas [2].',
    citations: [
      {
        n: 1,
        doc: POLITICA,
        page: 4,
        section: '§ 2.1',
        quote:
          'Todo pedido de compra cuyo importe neto supere los quince mil euros (15.000,00 €) requerirá la firma de aprobación expresa de la Dirección Financiera antes de su emisión al proveedor, además de tres (3) ofertas comparativas verificables.',
        mark: 'requerirá la firma de aprobación expresa de la Dirección Financiera',
      },
      {
        n: 2,
        doc: SOLICITUD_PC0412,
        page: 1,
        section: 'Cuadro económico',
        quote:
          'Base imponible total del pedido PC-0412: 18.450,00 € (dieciocho mil cuatrocientos cincuenta euros) correspondiente a 12 unidades de válvula neumática DN80 INOX 316L. Anexos adjuntos: 3 ofertas técnicas comparativas.',
        mark: 'Anexos adjuntos: 3 ofertas técnicas comparativas',
      },
    ],
  },
  {
    question: '¿Puedo emitir un pedido a Logística y Embalajes Delta?',
    answer:
      'Todavía no. Su certificado de obligaciones tributarias (AEAT) caducó el 12/10/2026 [1]. La regla R-01 retiene el pedido PC-0419 hasta que el proveedor aporte la renovación.',
    citations: [
      {
        n: 1,
        doc: 'Certificado de Homologación y Solvencia PROV-024',
        page: 2,
        section: 'Vigencia de certificados',
        quote:
          'Certificado de encontrarse al corriente de obligaciones tributarias (AEAT) expedido el 12/10/2025 con fecha de caducidad 12/10/2026. Póliza de responsabilidad civil vigente hasta 31/12/2026.',
        mark: 'con fecha de caducidad 12/10/2026',
      },
    ],
  },
  {
    question: '¿Hay penalización si PC-0412 no llega en 48 horas?',
    answer:
      'No consta en los documentos. El pedido solo fija el pago a 60 días mediante confirming [1]. La entrega en 48 horas se comentó en una llamada y no tiene documento, así que Solaris no la presenta como hecho.',
    citations: [
      {
        n: 1,
        doc: SOLICITUD_PC0412,
        page: 1,
        section: 'Cuadro económico',
        quote:
          'Condiciones de pago propuestas: 60 días fecha factura mediante confirming bancario.',
        mark: '60 días fecha factura',
      },
    ],
  },
]

export type Gap = {
  id: string
  title: string
  rule: string
  ref: string
  severity: 'bloqueo' | 'aprobacion' | 'sin_evidencia' | 'cumplido'
}

// Lo que da el motor de reglas del producto sobre los pedidos de muestra
// (product/tests/rules-engine.test.ts).
export const DEMO_GAPS: Gap[] = [
  {
    id: 'PC-0412',
    title: 'Supera 15.000 €: falta la firma de Dirección financiera',
    rule: 'R-03',
    ref: 'Política de compras v3.2 · pág. 4 · § 2.1',
    severity: 'aprobacion',
  },
  {
    id: 'PC-0419',
    title: 'Certificado AEAT del proveedor caducado el 12/10/2026',
    rule: 'R-01',
    ref: 'Certificado PROV-024 · pág. 2',
    severity: 'bloqueo',
  },
  {
    id: 'PC-0419',
    title: 'Supera 6.000 € y no hay evidencia de las tres ofertas',
    rule: 'R-02',
    ref: 'Política de compras v3.2 · pág. 4 · § 2.1',
    severity: 'sin_evidencia',
  },
  {
    id: 'PC-0412',
    title: 'Tres ofertas comparativas adjuntas',
    rule: 'R-02',
    ref: 'Solicitud de pedido PC-0412 · pág. 1',
    severity: 'cumplido',
  },
]

export const DEMO_LOG_SEED = [
  {
    time: '31/10 08:21',
    text: 'FAC-2026-889 · recargo de 680,00 € retenido como candidato (confianza 0,74 < 0,80)',
  },
  { time: '30/10 14:12', text: 'R-01 evaluada · PC-0419 retenido por certificado AEAT caducado' },
  { time: '29/10 09:15', text: 'Política de compras v3.2 indexada' },
]
