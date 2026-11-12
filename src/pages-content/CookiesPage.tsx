import { LIST, LegalShell, Section } from '../components/LegalLayout'
import { LEGAL_PAGES_REVIEWED, LEGAL_PAGES_UPDATED } from '../lib/legal'
import { CONTACT_EMAIL } from '../lib/site'

export function CookiesPage() {
  return (
    <LegalShell draft={!LEGAL_PAGES_REVIEWED}>
      <h1 className="headline text-[40px] md:text-[52px]">Política de cookies</h1>
      <p className="mt-4 font-mono text-[12px] text-ink/60">
        Última actualización: {LEGAL_PAGES_UPDATED}
      </p>
      <p className="mt-6 text-[17px] leading-relaxed text-ink/80">
        Una cookie es un pequeño archivo que un sitio guarda en su navegador. Aquí le decimos
        cuáles usamos, para qué y cómo puede controlarlas.
      </p>

      <Section id="resumen" title="1. En resumen">
        <ul className={LIST}>
          <li>
            <strong className="font-medium text-ink">La web informativa no usa cookies</strong>, ni
            propias ni de terceros, y por eso no mostramos un banner de consentimiento.
          </li>
          <li>
            <strong className="font-medium text-ink">La demo usa una única cookie técnica</strong>,
            imprescindible para entrar con su código.
          </li>
          <li>La analítica que usamos funciona sin cookies.</li>
        </ul>
      </Section>

      <Section id="tabla" title="2. Qué guardamos en su navegador">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-[14px]">
            <caption className="sr-only">Cookies y almacenamiento usados por Solaris</caption>
            <thead>
              <tr className="border-b border-ink/15 font-mono text-[11px] tracking-[0.08em] uppercase text-ink/60">
                <th scope="col" className="py-2 pr-4 font-normal">Nombre</th>
                <th scope="col" className="py-2 pr-4 font-normal">Para qué</th>
                <th scope="col" className="py-2 pr-4 font-normal">Duración</th>
                <th scope="col" className="py-2 font-normal">Tipo</th>
              </tr>
            </thead>
            <tbody className="align-top">
              <tr className="border-b border-ink/10">
                <th scope="row" className="py-3 pr-4 font-mono text-[13px] font-normal">
                  solaris_space_session
                </th>
                <td className="py-3 pr-4">
                  Mantiene su sesión en la demo después de introducir el código de espacio.
                  Va firmada y no contiene el código.
                </td>
                <td className="py-3 pr-4">12 horas</td>
                <td className="py-3">Cookie propia, técnica, HttpOnly. Solo en la demo</td>
              </tr>
              <tr className="border-b border-ink/10">
                <th scope="row" className="py-3 pr-4 font-mono text-[13px] font-normal">
                  solaris-utm
                </th>
                <td className="py-3 pr-4">
                  Recuerda de qué campaña viene la visita (parámetros como{' '}
                  <code className="font-mono text-[13px]">utm_source</code>) para asociarla a su
                  solicitud si la envía.
                </td>
                <td className="py-3 pr-4">Hasta cerrar la pestaña</td>
                <td className="py-3">Almacenamiento de sesión del navegador, no es una cookie</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="base" title="3. Por qué no pedimos consentimiento">
        <p>
          La cookie de sesión de la demo es estrictamente necesaria para prestar el servicio que
          usted solicita al entrar con su código. La normativa exime de consentimiento a las
          cookies técnicas de este tipo. Si en el futuro añadimos cookies de analítica,
          publicidad o seguimiento, lo avisaremos aquí y le pediremos su consentimiento antes de
          instalarlas.
        </p>
      </Section>

      <Section id="control" title="4. Cómo controlarlas">
        <p>
          Puede ver, bloquear o borrar las cookies desde los ajustes de su navegador. Si bloquea la
          cookie de sesión de la demo, no podrá entrar a ella; la web informativa seguirá
          funcionando igual.
        </p>
      </Section>

      <Section id="mas" title="5. Más información">
        <p>
          El tratamiento de sus datos personales se explica en la{' '}
          <a href="/solaris/privacidad" className="text-solar-ink underline underline-offset-4">
            política de privacidad
          </a>
          . Para cualquier duda, escríbanos
          {CONTACT_EMAIL ? (
            <>
              {' '}a{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-solar-ink underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
            </>
          ) : null}
          .
        </p>
      </Section>
    </LegalShell>
  )
}
