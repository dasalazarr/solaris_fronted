// Copy and sample data for the Solaris landing. Drafts from the landing PRD;
// demo data belongs to a fictitious company (Hortícola Ribera S.L.).

export const NAV_LINKS = [
  { label: 'Producto', href: '#producto' },
  { label: 'Cómo funciona', href: '#demo' },
  { label: 'Packs', href: '#packs' },
  { label: 'Preguntas', href: '#preguntas' },
  { label: 'Diario', href: '#diario' },
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
    status: 'Piloto en curso',
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

export const DIARY = [
  {
    date: '2026-10-24',
    title: 'Por qué cada respuesta lleva su párrafo',
    line: 'La decisión de no mostrar nada que no pueda citarse, y lo que nos costó.',
  },
  {
    date: '2026-10-10',
    title: 'El primer piloto en calidad alimentaria',
    line: 'Qué aprendimos cruzando registros de alérgenos con la norma IFS.',
  },
  {
    date: '2026-09-27',
    title: 'Un error que no volveremos a cometer',
    line: 'Una regla mal escrita, un hueco que nadie vio y cómo lo detectamos.',
  },
]

export const FAQ = [
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
  },
]

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

export const DEMO_QA: DemoAnswer[] = [
  {
    question: '¿Puede aprobarse el pedido PC-0412?',
    answer:
      'Todavía no. PC-0412 asciende a 18.400 € y la política exige tres ofertas para pedidos superiores a 15.000 € [1]. El expediente solo adjunta dos. Además, requiere la firma de Dirección Financiera [2].',
    citations: [
      {
        n: 1,
        doc: 'Política de compras v3.2',
        page: 4,
        section: '§3.2',
        quote:
          'Los pedidos cuyo importe supere los 15.000 € (IVA excluido) requerirán la presentación de al menos tres ofertas comparables de proveedores distintos.',
        mark: 'supere los 15.000 €',
      },
      {
        n: 2,
        doc: 'Política de compras v3.2',
        page: 5,
        section: '§3.4',
        quote:
          'La aprobación de pedidos por encima del umbral corresponde a la Dirección Financiera, que dejará constancia escrita de su decisión.',
        mark: 'corresponde a la Dirección Financiera',
      },
    ],
  },
  {
    question: '¿Está homologado Metalúrgica Duero?',
    answer:
      'Sí, pero la homologación vence el 30 de noviembre de 2026 [1]. La renovación exige el certificado ISO 9001 vigente, que aún no consta en el expediente [2].',
    citations: [
      {
        n: 1,
        doc: 'Registro de proveedores 2026',
        page: 2,
        section: 'fila 14',
        quote:
          'Metalúrgica Duero S.A. · Homologado · Fecha de vencimiento: 30/11/2026 · Categoría: Material de envasado.',
        mark: 'Fecha de vencimiento: 30/11/2026',
      },
      {
        n: 2,
        doc: 'Manual de homologación',
        page: 7,
        section: '§5.1',
        quote:
          'Para renovar la homologación, el proveedor aportará el certificado ISO 9001 en vigor con una antelación mínima de 15 días.',
        mark: 'certificado ISO 9001 en vigor',
      },
    ],
  },
  {
    question: '¿Qué hago con una factura sin pedido?',
    answer:
      'No debe contabilizarse. Hay que retenerla y pedir al solicitante que regularice el pedido en un máximo de 5 días hábiles [1].',
    citations: [
      {
        n: 1,
        doc: 'Procedimiento de cuentas a pagar',
        page: 3,
        section: '§2.6',
        quote:
          'Toda factura recibida sin pedido asociado quedará retenida. El solicitante dispondrá de 5 días hábiles para regularizar el pedido antes de su devolución.',
        mark: 'quedará retenida',
      },
    ],
  },
]

export type Gap = {
  id: string
  title: string
  rule: string
  ref: string
  severity: 'bloqueo' | 'aviso' | 'cumplido'
}

export const DEMO_GAPS: Gap[] = [
  {
    id: 'PC-0412',
    title: 'Supera 15.000 € con solo 2 ofertas',
    rule: 'R-COMP-07',
    ref: 'Política de compras · pág. 4 · §3.2',
    severity: 'bloqueo',
  },
  {
    id: 'FAC-2209',
    title: 'Factura de 2.130 € sin pedido asociado',
    rule: 'R-CXP-03',
    ref: 'Cuentas a pagar · pág. 3 · §2.6',
    severity: 'bloqueo',
  },
  {
    id: 'PRV-014',
    title: 'Homologación de Metalúrgica Duero vence en 30 días',
    rule: 'R-HOM-02',
    ref: 'Manual de homologación · pág. 7 · §5.1',
    severity: 'aviso',
  },
  {
    id: 'PC-0409',
    title: 'Tres ofertas adjuntas y firma registrada',
    rule: 'R-COMP-07',
    ref: 'Política de compras · pág. 4 · §3.2',
    severity: 'cumplido',
  },
]

export const DEMO_LOG_SEED = [
  {
    time: '09:12',
    text: 'PC-0409 aprobado por M. Ortega · evidencia enlazada',
  },
  { time: '08:55', text: 'Regla R-COMP-07 evaluada en 14 pedidos · 1 hueco' },
  { time: '08:31', text: 'Política de compras v3.2 indexada · 12 páginas' },
]
