import { Dato, LIST, LegalShell, Section } from '../components/LegalLayout'
import {
  LEGAL_ADDRESS,
  LEGAL_ID,
  LEGAL_NAME,
  LEGAL_PAGES_REVIEWED,
  LEGAL_PAGES_UPDATED,
} from '../lib/legal'
import { CONTACT_EMAIL } from '../lib/site'

export function AvisoLegalPage() {
  return (
    <LegalShell draft={!LEGAL_PAGES_REVIEWED}>
      <h1 className="headline text-[40px] md:text-[52px]">Aviso legal</h1>
      <p className="mt-4 font-mono text-[12px] text-ink/60">
        Última actualización: {LEGAL_PAGES_UPDATED}
      </p>

      <Section id="titular" title="1. Titular de la web">
        <p>
          Esta web es titularidad de <Dato value={LEGAL_NAME} label="nombre completo" />,
          trabajador autónomo que opera bajo el nombre comercial Illarium y ofrece el producto
          Solaris.
        </p>
        <ul className={LIST}>
          <li>
            Identificación fiscal: <Dato value={LEGAL_ID} label="NIF o NIE" />
          </li>
          <li>
            Domicilio: <Dato value={LEGAL_ADDRESS} label="domicilio" />
          </li>
          <li>
            Correo de contacto:{' '}
            {CONTACT_EMAIL ? (
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-solar-ink underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
            ) : (
              <Dato value="" label="correo de contacto" />
            )}
          </li>
        </ul>
      </Section>

      <Section id="objeto" title="2. Qué es esta web">
        <p>
          Presenta Solaris, un producto que lee los documentos de una organización, responde
          citando la fuente exacta, detecta con reglas deterministas lo que incumple o falta y no
          ejecuta ninguna acción con efecto externo sin la aprobación registrada de una persona.
          Permite solicitar una demostración y, con un código personal, probar una demo.
        </p>
        <p>
          La demo funciona con documentos y datos de muestra ficticios. No es una instalación de
          producción ni contiene documentos reales de ninguna organización.
        </p>
      </Section>

      <Section id="uso" title="3. Condiciones de uso">
        <ul className={LIST}>
          <li>
            El acceso a la parte informativa es libre. El acceso a la demo requiere un código de
            espacio que facilitamos nosotros, es personal e intransferible, caduca y podemos
            revocarlo.
          </li>
          <li>
            No introduzca en la demo datos personales ni documentos reales de su organización.
          </li>
          <li>
            Queda prohibido usar la web o la demo para fines ilícitos, intentar acceder a espacios
            que no le correspondan, sobrecargar el servicio o sortear sus medidas de seguridad.
          </li>
          <li>
            Podemos suspender el acceso a quien incumpla estas condiciones.
          </li>
        </ul>
      </Section>

      <Section id="contenido-legal" title="4. Alcance de la información y de la demo">
        <p>
          Las respuestas, citas y alertas de la demo se generan sobre documentos de muestra para
          enseñar cómo funciona el producto. No constituyen asesoramiento jurídico, fiscal ni de
          ningún otro tipo, y no deben usarse para tomar decisiones sobre casos reales.
        </p>
        <p>
          Procuramos que la información de la web sea exacta y esté actualizada, pero no
          garantizamos su ausencia de errores ni la disponibilidad continua del servicio. Podemos
          modificar o retirar contenidos sin aviso previo.
        </p>
      </Section>

      <Section id="propiedad" title="5. Propiedad intelectual">
        <p>
          Los textos, el diseño, el código, las imágenes y los signos distintivos de la web
          pertenecen a su titular o se usan con autorización. No se permite su reproducción,
          distribución o transformación sin permiso, salvo lo que la ley autorice expresamente. Las
          citas breves con indicación de la fuente son bienvenidas.
        </p>
      </Section>

      <Section id="enlaces" title="6. Enlaces a otras webs">
        <p>
          La web puede enlazar a páginas de terceros, por ejemplo la web personal del autor.
          No controlamos su contenido y no respondemos de él.
        </p>
      </Section>

      <Section id="datos-personales" title="7. Datos personales y cookies">
        <p>
          El tratamiento de datos personales se explica en la{' '}
          <a href="/privacidad" className="text-solar-ink underline underline-offset-4">
            política de privacidad
          </a>{' '}
          y el uso de cookies, en la{' '}
          <a href="/cookies" className="text-solar-ink underline underline-offset-4">
            política de cookies
          </a>
          .
        </p>
      </Section>

      <Section id="ley" title="8. Legislación aplicable">
        <p>
          Este aviso se rige por la legislación española. Para cualquier controversia, las partes
          se someten a los juzgados y tribunales que correspondan conforme a la normativa
          aplicable, sin perjuicio de los derechos que la ley reconozca irrenunciablemente a los
          consumidores.
        </p>
      </Section>
    </LegalShell>
  )
}
