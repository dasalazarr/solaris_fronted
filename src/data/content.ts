// Copy and sample data for the Solaris landing. Drafts from the landing PRD; the demo
// data is the product's fictitious Compras case (product/lib/solaris-data.ts).

export const NAV_LINKS = [
  { label: 'Cómo funciona', href: '#producto' },
  { label: 'Demo', href: '#demo' },
  { label: 'Procesos', href: '#procesos' },
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

// «Hoy · En tu piloto · Visión» (ADR-0009, ADR-0013). Fuente: docs/fundacional.md §6 (raíz).
// Hoy = existe en el producto; En tu piloto = solo lo comprometido para el piloto, sin
// fechas; Visión = hipótesis de la Visión v2 del PRD, siempre rotuladas.
export const ROADMAP_UPDATED = 'noviembre 2026'
export const ROADMAP = [
  {
    id: 'hoy',
    label: 'Hoy',
    note: 'Pruébalo en la demostración, con datos de muestra',
    items: [
      'Citas con documento, página y fragmento literal.',
      'Reglas que evalúa el código, siempre igual.',
      'Huecos: lo que incumple, lo que falta y el dato sin evidencia.',
      'Aprobación por el rol que exige la regla, con registro exportable.',
    ],
  },
  {
    id: 'siguiente',
    label: 'En tu piloto',
    note: 'Lo preparamos contigo para el primer piloto',
    items: [
      'Instalación en tu organización, sin salida a internet, con tus documentos reales.',
      'El contrato del proceso, adaptado a tus normas.',
      'Registro permanente de aprobaciones.',
    ],
  },
  {
    id: 'vision',
    label: 'Visión',
    note: 'Por validar; no forman parte de la oferta',
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
    body: 'Contratos y pedidos subidos a herramientas públicas, sin control de la empresa.',
  },
  {
    icon: 'help',
    title: 'Respuestas a ciegas',
    body: 'Textos convincentes, sin enlace al documento ni a la página.',
  },
  {
    icon: 'files',
    title: 'Normas muertas en PDFs',
    body: 'Políticas escritas que nadie alcanza a cruzar a mano con cada expediente.',
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
        example: 'Aprobación registrada con la versión del contrato y la evidencia enlazada. Repetir el paso no duplica la acción.',
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
        // Fecha fija: la landing es estática y no puede depender de cuándo se lea.
        example: 'A fecha de la muestra (03/11/2026) quedan 12 días y no consta la renovación.',
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
        example: 'Aprobación registrada con la versión del contrato y la evidencia enlazada. Repetir el paso no duplica la acción.',
        primitives: [{ name: 'Revisión', value: 'Trazada con la versión del contrato' }],
      },
    ],
  },
] as const satisfies readonly { id: string; label: string; nodes: readonly LoopNode[] }[]

export type OntologyPackId = (typeof ONTOLOGY_PACKS)[number]['id']

export const PACKS = [
  {
    name: 'Compras',
    line: 'Cruza ofertas, certificados de proveedor y umbrales de firma antes de emitir el pedido.',
    status: 'Demo en esta página',
    demoHere: true,
    process: 'Compras',
    tone: 'solar',
    icon: 'cart',
  },
  {
    name: 'Jurídico y mercantil',
    line: 'Detecta vencimientos, anexos sin firmar y cláusulas de cambio de control en cada expediente.',
    status: 'Bajo petición · datos de muestra',
    demoHere: false,
    process: 'Jurídico',
    tone: 'lavanda',
    icon: 'scale',
  },
  {
    name: 'Calidad IFS Food',
    line: 'Cruza registros de proceso y certificados de envase de cada lote antes de liberarlo.',
    status: 'Bajo petición · datos de muestra',
    demoHere: false,
    process: 'Calidad',
    tone: 'salvia',
    icon: 'shield',
  },
  {
    name: 'Diligencia EUDR',
    line: 'Comprueba la geolocalización de cada parcela antes de emitir la declaración de diligencia.',
    status: 'Bajo petición · datos de muestra',
    demoHere: false,
    process: 'EUDR',
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
    title: 'Piloto con tus documentos',
    body: 'Solaris trabaja con tu caso real durante unas semanas.',
  },
  {
    title: 'Instalación',
    body: 'En tu organización, sin que los documentos salgan de ella.',
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
    a: 'En la instalación local, que preparamos contigo durante el piloto, los documentos se quedan en tu organización y no salen de ella. La demostración usa datos de muestra en la nube, nunca documentos tuyos.',
  },
  {
    q: '¿Qué modelo usa?',
    a: 'En la instalación local, un modelo de pesos abiertos que se ejecuta en un equipo de tu organización. Te indicamos cuál y por qué durante el diagnóstico, según tu volumen de documentos.',
  },
  {
    q: '¿Qué pasa si se equivoca?',
    a: 'Cada respuesta cita documento, página y párrafo, así que puedes comprobarla en un clic. Y Solaris no ejecuta nada por su cuenta: toda acción requiere la aprobación de una persona y queda registrada.',
  },
  {
    q: '¿Necesito comprar hardware?',
    a: 'Depende del volumen. Muchas organizaciones pueden usar un equipo que ya tienen; si no es así, te lo indicamos en el diagnóstico antes de cualquier compromiso.',
  },
  {
    q: '¿Cuánto cuesta?',
    a: 'Depende del proceso y del alcance. El diagnóstico termina con una propuesta de precio cerrado para el piloto y la instalación.',
  },
  {
    q: '¿Sustituye a mi ERP?',
    a: 'No. Solaris lee los documentos y las reglas que rodean a tu ERP y señala lo que no cuadra. Tu ERP sigue siendo el sistema de registro.',
  },
  {
    q: '¿Cómo encaja con el RGPD y el secreto profesional?',
    a: 'Con la instalación local, los datos no se ceden a terceros ni salen de tu organización. [Respuesta pendiente de revisión jurídica.]',
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
  /** Regla que la respuesta activa. Sin ella, la respuesta no propone nada. */
  action?: { rule: string; text: string; review?: boolean }
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
    action: {
      rule: 'R-03',
      text: 'requiere aprobación de Dirección financiera',
      review: true,
    },
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
    action: { rule: 'R-01', text: 'pedido PC-0419 retenido hasta que se renueve el certificado' },
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
    title: 'Desde 6.000 € y no hay evidencia de las tres ofertas',
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

export const DEMO_PENDING_DATA =
  'FAC-2026-889 · recargo de transporte de 680,00 €: lectura con confianza 0,74 (< 0,80). No evalúa ninguna regla hasta que una persona lo valide.'

// Revisar: rol que exige R-03 y uno sin permiso. Borrador copiado de REV-COMP-01.
export const DEMO_REQUIRED_ROLE = 'Dirección financiera'
export const DEMO_ROLES = [DEMO_REQUIRED_ROLE, 'Solicitante (sin permiso de firma)'] as const
export const DEMO_DRAFT =
  'AUTORIZACIÓN DE EMISIÓN — Pedido PC-0412\nDestinatario: Suministros Industriales del Norte S.L. (PROV-018)\nImporte neto autorizado: 18.450,00 € (12 uds. válvula neumática DN80 INOX 316L)\nFundamento: Verificadas 3 ofertas comparativas conforme a § 2.1 (R-02) y autorizada excepción de umbral superior a 15.000,00 € (R-03) por Dirección Financiera.'

// Explorar: el objeto PC-0412 y su cruce, tal como da el motor del producto
// (product/tests/gaps.test.ts). R-01 no se evalúa sobre PC-0412: el motor mínimo no sigue relaciones.
export const DEMO_OBJECT = {
  id: 'PC-0412',
  type: 'Pedido',
  title: 'Válvulas DN80 INOX',
  relation: 'Emitido a Suministros Industriales del Norte S.L. (PROV-018)',
  attributes: [
    { label: 'Importe neto', value: '18.450,00 €', source: 'Solicitud de pedido PC-0412 · pág. 1', rule: 'Lo usa el motor' },
    { label: 'Ofertas comparativas', value: '3 presupuestos verificados', source: 'Solicitud de pedido PC-0412 · pág. 1', rule: 'Lo usa el motor' },
    { label: 'Plazo de entrega verbal', value: '48 horas (comentado en llamada)', source: 'Sin fuente', rule: 'Excluido: sin evidencia' },
  ],
  crossCheck: [
    { rule: 'R-03', state: 'Requiere aprobación' },
    { rule: 'R-01', state: 'No evaluada' },
    { rule: 'R-02', state: '✓ Conforme' },
  ],
} as const
