// Fricciones que ofrece el formulario por proceso. Copiadas de `onboardingPainOptions`
// en product/lib/solaris-data.ts: el producto es la fuente.
export const FORM_PAINS: Record<string, readonly string[]> = {
  Compras: [
    'Pedidos emitidos sin cruzar umbrales de aprobación ni presupuesto vigente',
    'Proveedores con certificados de homologación o solvencia fiscal caducados',
    'Discrepancias de precio o unidades entre pedido de compra, albarán y factura',
    'Tiempo invertido buscando presupuestos comparativos en correos y carpetas',
  ],
  Jurídico: [
    'Riesgo sobre el secreto profesional al consultar contratos en herramientas externas',
    'Cláusulas de cambio de control, vencimientos o avales dispersos en adendas PDF',
    'Falta de trazabilidad sobre qué socio aprobó una excepción en una cláusula de responsabilidad',
    'Horas invertidas cruzando apoderamientos notariales con contratos próximos a vencer',
  ],
  Calidad: [
    'Cruzar certificados de análisis (CoA) y alérgenos de proveedores antes de liberar un lote',
    'Responder auditorías o clientes en francés e inglés sobre fichas técnicas en español',
    'Detectar certificados IFS o analíticas de plaguicidas caducadas antes de envasar',
    'Trazar qué lote de materia prima entró en cada marca comercial en menos de 2 minutos',
  ],
  EUDR: [
    'Partidas con varios proveedores o cooperativas donde falta el polígono GeoJSON de una finca',
    'Verificar fecha de corte de no deforestación (31/12/2020) antes de presentar declaración DDS',
    'Cruzar conocimientos de embarque (Bill of Lading) con certificados fitosanitarios y de origen',
    'Evitar bloqueos en aduana por incoherencias de peso neto entre factura y declaración EUDR',
  ],
}

/** Antepone las fricciones elegidas al comentario. La API solo conoce `comentario`. */
export function composeComment(pains: readonly string[], comment: string): string {
  if (pains.length === 0) return comment
  const head = `Fricciones: ${pains.join('; ')}`
  return comment.trim() ? `${head}\n\n${comment}` : head
}
