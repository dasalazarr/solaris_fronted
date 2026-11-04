// Copy and sample data for the Solaris landing. Drafts from the landing PRD; the demo
// data is the product's fictitious Compras case (product/lib/solaris-data.ts).

export const NAV_LINKS = [
  { label: 'Cómo funciona', href: '#producto' },
  { label: 'Demo', href: '#demo' },
  { label: 'Packs', href: '#packs' },
  { label: 'Visión', href: '#vision' },
  { label: 'Preguntas', href: '#preguntas' },
]

export const PROCESSES = ['Compras', 'Jurídico', 'Calidad', 'EUDR', 'Otro'] as const

/** Quién escribe. Coincide con PERFILES de product/lib/solicitud.ts. */
export const PROFILES = [
  { id: 'cliente', label: 'Cliente' },
  { id: 'aliado', label: 'Aliado o consultora' },
  { id: 'inversor', label: 'Inversor' },
] as const
export type Profile = (typeof PROFILES)[number]['id']

// «Hoy · Siguiente · Visión» (ADR-0009). Fuente: docs/fundacional.md §6 (raíz).
// Hoy = existe en el producto; Siguiente = solo lo comprometido para el piloto, sin
// fechas; Visión = hipótesis de la Visión v2 del PRD, siempre rotuladas.
export const ROADMAP_UPDATED = 'noviembre 2026'
export const ROADMAP = [
  {
    id: 'hoy',
    label: 'Hoy',
    note: 'En la demostración, con datos de muestra',
    items: [
      'Cada respuesta cita documento, página y fragmento literal; la cita que no está en sus documentos se descarta.',
      'Las reglas las evalúa un motor con tests: el mismo expediente da el mismo resultado.',
      'Huecos: lo que incumple o falta, y el dato que no tiene evidencia.',
      'Ninguna acción sin una persona: borrador, rol que aprueba y registro exportable.',
    ],
  },
  {
    id: 'siguiente',
    label: 'Siguiente',
    note: 'Comprometido para el primer piloto',
    items: [
      'Instalación en su equipo, sin salida a internet, con sus documentos reales.',
      'Registro de aprobaciones que se conserva entre sesiones.',
    ],
  },
  {
    id: 'vision',
    label: 'Visión',
    note: 'Hipótesis por validar; no forman parte de la oferta',
    items: [
      'Modelos por proceso: cada proceso usa el modelo que mejor rinde con sus documentos.',
      'Federación entre procesos: Compras consulta a Calidad por el certificado de un proveedor sin mezclar sus contratos.',
    ],
  },
] as const

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

// «Cómo funciona»: el bucle con su primitiva debajo, en dos packs. Datos copiados de
// product/lib/solaris-data.ts (el producto es la fuente, O3 de la auditoría); los estados
// son los que da el motor de reglas del producto (product/tests/rules-engine.test.ts).
export type Primitive =
  'Proceso' | 'Objeto' | 'Relación' | 'Evidencia' | 'Regla' | 'Acción' | 'Revisión'

export type LoopNode = {
  step: string
  code: string
  example: string
  primitives: { name: Primitive; value: string }[]
}

export const ONTOLOGY_PACKS = [
  {
    id: 'compras',
    label: 'Compras',
    nodes: [
      {
        step: 'Pregunta',
        code: 'PROC-COMP-01 · PC-0412',
        example:
          '¿Por qué está retenido el pedido PC-0412 y qué exige el contrato del proceso para emitirlo?',
        primitives: [
          { name: 'Proceso', value: 'Compras · responsable: Dirección financiera' },
          { name: 'Objeto', value: 'Pedido PC-0412 · 18.450,00 €' },
          { name: 'Relación', value: 'Emitido a Suministros Industriales del Norte S.L.' },
        ],
      },
      {
        step: 'Cita',
        code: 'Política Corporativa de Compras y Gasto v3.2 · pág. 4 · § 2.1',
        example:
          '«Todo pedido de compra cuyo importe neto supere los quince mil euros (15.000,00 €) requerirá la firma de aprobación expresa de la Dirección Financiera…»',
        primitives: [{ name: 'Evidencia', value: 'Fragmento literal, con documento y página' }],
      },
      {
        step: 'Regla',
        code: 'R-03',
        example: 'Importe neto > 15.000 € ⇒ firma de Dirección financiera antes de emitir',
        primitives: [{ name: 'Regla', value: 'La evalúa el código, no el modelo' }],
      },
      {
        step: 'Hueco',
        code: 'PC-0412',
        example:
          'Tiene sus 3 ofertas, pero supera 15.000 € y falta la firma de Dirección financiera.',
        primitives: [{ name: 'Regla', value: 'R-03 · requiere aprobación' }],
      },
      {
        step: 'Aprobación',
        code: 'Dirección financiera',
        example:
          'Borrador: emitir la orden de compra PC-0412 a Suministros Industriales del Norte S.L.',
        primitives: [
          { name: 'Acción', value: 'Borrador editable; no se envía solo' },
          { name: 'Revisión', value: 'Aprueba o rechaza el rol que exige R-03' },
        ],
      },
      {
        step: 'Registro',
        code: 'REV-COMP-01',
        example: 'Aprobación registrada con step_id, args_hash y la evidencia enlazada.',
        primitives: [{ name: 'Revisión', value: 'Trazada con la versión del contrato' }],
      },
    ],
  },
  {
    id: 'juridico',
    label: 'Jurídico',
    nodes: [
      {
        step: 'Pregunta',
        code: 'PROC-JUR-01 · AV-9041',
        example: '¿Qué contratos tienen garantías próximas a vencer y qué falta en el expediente?',
        primitives: [
          { name: 'Proceso', value: 'Vigencia contractual · responsable: Socio director' },
          { name: 'Objeto', value: 'Aval bancario AV-9041 · 85.000,00 €' },
          { name: 'Relación', value: 'Garantiza el contrato principal del expediente M-219' },
        ],
      },
      {
        step: 'Cita',
        code: 'Póliza de Afianzamiento Mercantil M-219 · pág. 6 · Estipulación Novena',
        example:
          '«El aval bancario solidario n.º AV-9041 por importe de 85.000,00 € vencerá improrrogablemente el día 15 de noviembre de 2026…»',
        primitives: [{ name: 'Evidencia', value: 'Fragmento literal, con documento y página' }],
      },
      {
        step: 'Regla',
        code: 'R-JUR-03',
        example:
          'Aval a menos de 30 días de vencer ⇒ requerimiento de renovación aprobado por el socio',
        primitives: [{ name: 'Regla', value: 'La evalúa el código, no el modelo' }],
      },
      {
        step: 'Hueco',
        code: 'AV-9041',
        example: 'Vence el 15/11/2026: quedan menos de 30 días y no consta la renovación.',
        primitives: [{ name: 'Regla', value: 'R-JUR-03 · requiere aprobación' }],
      },
      {
        step: 'Aprobación',
        code: 'Socio director del expediente',
        example: 'Borrador: instrucción de renovación del aval AV-9041.',
        primitives: [
          { name: 'Acción', value: 'Borrador editable; no se envía solo' },
          { name: 'Revisión', value: 'Aprueba o rechaza el rol que exige R-JUR-03' },
        ],
      },
      {
        step: 'Registro',
        code: 'REV-JUR-02',
        example: 'Aprobación registrada con step_id, args_hash y la evidencia enlazada.',
        primitives: [{ name: 'Revisión', value: 'Trazada con la versión del contrato' }],
      },
    ],
  },
] as const satisfies readonly { id: string; label: string; nodes: readonly LoopNode[] }[]

export type OntologyPackId = (typeof ONTOLOGY_PACKS)[number]['id']

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
