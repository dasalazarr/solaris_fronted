import { Dato, LIST, LegalShell, Section } from '../components/LegalLayout'
import {
  LEGAL_ADDRESS,
  LEGAL_ID,
  LEGAL_NAME,
  PRIVACY_REVIEWED,
  PRIVACY_UPDATED,
} from '../lib/legal'
import { CONTACT_EMAIL } from '../lib/site'

export function PrivacidadPage() {
  return (
    <LegalShell draft={!PRIVACY_REVIEWED}>
            <h1 className="headline text-[40px] md:text-[52px]">Política de privacidad</h1>
            <p className="mt-4 font-mono text-[12px] text-ink/60">
              Última actualización: {PRIVACY_UPDATED}
            </p>
            <p className="mt-6 text-[17px] leading-relaxed text-ink/80">
              Esta política explica qué datos personales trata Solaris cuando usted visita esta web,
              solicita una demostración o prueba la demo. Está escrita para que pueda decidir con
              información, no para que la acepte sin leerla.
            </p>

            <Section id="responsable" title="1. Quién es el responsable">
              <p>
                El responsable del tratamiento es <Dato value={LEGAL_NAME} label="nombre completo" />,
                trabajador autónomo que opera bajo el nombre comercial Illarium y ofrece Solaris.
              </p>
              <ul className={LIST}>
                <li>
                  Identificación fiscal: <Dato value={LEGAL_ID} label="NIF o NIE" />
                </li>
                <li>
                  Domicilio: <Dato value={LEGAL_ADDRESS} label="domicilio" />
                </li>
                <li>
                  Correo para cualquier asunto de privacidad:{' '}
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

            <Section id="datos" title="2. Qué datos tratamos y de dónde salen">
              <p>
                <strong className="font-medium text-ink">Si solicita una demostración.</strong>{' '}
                Los datos que escribe en el formulario: perfil (cliente, aliado o inversor), nombre,
                empresa, correo profesional, proceso que le interesa y, si quiere, un comentario. Además guardamos desde qué parte de la
                página lo envió y los parámetros de campaña de la dirección (por ejemplo,{' '}
                <code className="font-mono text-[14px]">utm_source</code>), que se conservan en la
                memoria de su navegador solo mientras dura la visita.
              </p>
              <p>
                <strong className="font-medium text-ink">Si visita la web.</strong> Medimos las
                visitas con una herramienta de analítica sin cookies: páginas vistas, acciones como
                abrir el formulario, tipo de dispositivo y navegador, y país aproximado. No
                construimos un perfil suyo ni le seguimos entre sitios web.
              </p>
              <p>
                <strong className="font-medium text-ink">Datos técnicos.</strong> Su dirección IP
                llega a nuestros servidores de alojamiento al cargar la web y al enviar el
                formulario. La usamos para entregarle la web, frenar el envío masivo de solicitudes
                y proteger la demo frente a abusos.
              </p>
              <p>
                <strong className="font-medium text-ink">Si prueba la demo.</strong> Entra con un
                código de espacio que le facilitamos. Al entrar, se guarda una cookie técnica de
                sesión (de tipo HttpOnly) que dura unas horas y es imprescindible para el acceso. La
                demo funciona con documentos y datos de muestra ficticios:{' '}
                <strong className="font-medium text-ink">
                  no introduzca datos personales ni documentos reales de su organización
                </strong>
                .
              </p>
              <p>
                Todos los datos los facilita usted directamente o se generan al usar la web. No los
                obtenemos de terceros.
              </p>
            </Section>

            <Section id="finalidad" title="3. Para qué los usamos y con qué base legal">
              <ul className={LIST}>
                <li>
                  <strong className="font-medium text-ink">Responder a su solicitud</strong> y
                  preparar la demostración de su sector. Base: medidas precontractuales a petición
                  suya (art. 6.1.b del RGPD).
                </li>
                <li>
                  <strong className="font-medium text-ink">Dar acceso a la demo</strong> con su
                  código. Base: ejecución del servicio que usted solicita (art. 6.1.b).
                </li>
                <li>
                  <strong className="font-medium text-ink">Medir el uso de la web</strong> de forma
                  agregada para mejorarla. Base: nuestro interés legítimo en saber qué funciona
                  (art. 6.1.f), con un impacto mínimo porque no usamos cookies ni le identificamos.
                </li>
                <li>
                  <strong className="font-medium text-ink">Seguridad y prevención del abuso</strong>{' '}
                  (límite de intentos, campo antispam). Base: interés legítimo (art. 6.1.f).
                </li>
              </ul>
              <p>
                No le enviaremos comunicaciones comerciales que no haya pedido ni le incluiremos en
                listas de correo. No tomamos decisiones automatizadas sobre usted.
              </p>
            </Section>

            <Section id="destinatarios" title="4. Quién recibe sus datos">
              <p>
                No vendemos ni cedemos sus datos. Para prestar el servicio, algunos proveedores
                tratan datos por cuenta nuestra, con el contrato que exige el RGPD:
              </p>
              <ul className={LIST}>
                <li>
                  <strong className="font-medium text-ink">Vercel Inc.</strong>: alojamiento de la
                  web y de la demo. Recibe su IP y los registros técnicos de cada visita.
                </li>
                <li>
                  <strong className="font-medium text-ink">Resend</strong>: envío del correo que nos
                  avisa de su solicitud. Procesa el contenido del formulario.
                </li>
                <li>
                  <strong className="font-medium text-ink">Umami</strong>: analítica sin cookies de
                  la web.
                </li>
                <li>
                  <strong className="font-medium text-ink">Cloudflare, Inc.</strong>: reenvío de los
                  correos que llegan a nuestra dirección de contacto.
                </li>
                <li>
                  <strong className="font-medium text-ink">Google (Gmail)</strong>: buzón donde se
                  guardan el aviso de su solicitud y nuestra respuesta.
                </li>
              </ul>
              <p>
                Solo comunicaremos datos a autoridades cuando una ley nos obligue a ello.
              </p>
            </Section>

            <Section id="transferencias" title="5. Transferencias fuera del Espacio Económico Europeo">
              <p>
                Algunos de estos proveedores están o tienen servidores en Estados Unidos. Esas
                transferencias se apoyan en el Marco de Privacidad de Datos UE-EE. UU. o, en su
                defecto, en las cláusulas contractuales tipo aprobadas por la Comisión Europea. Puede
                pedirnos una copia de las garantías escribiendo al correo del apartado 1.
              </p>
            </Section>

            <Section id="plazos" title="6. Cuánto tiempo los conservamos">
              <ul className={LIST}>
                <li>
                  <strong className="font-medium text-ink">Solicitud de demostración:</strong> hasta
                  que la atendamos y, si no se convierte en una relación contractual, 12 meses más.
                  Después se suprimen o se bloquean mientras puedan ser necesarios frente a una
                  reclamación.
                </li>
                <li>
                  <strong className="font-medium text-ink">Sesión de la demo:</strong> la cookie
                  técnica caduca en unas horas; el código de espacio caduca en la fecha que le
                  indicamos y podemos revocarlo antes.
                </li>
                <li>
                  <strong className="font-medium text-ink">Analítica:</strong> estadísticas
                  agregadas que no permiten identificarle.
                </li>
                <li>
                  <strong className="font-medium text-ink">Registros técnicos:</strong> según los
                  plazos de cada proveedor de alojamiento, que son cortos.
                </li>
              </ul>
            </Section>

            <Section id="derechos" title="7. Sus derechos">
              <p>
                Puede pedirnos acceso a sus datos, su rectificación o supresión, limitar el
                tratamiento, oponerse a él y recibir sus datos en un formato estructurado
                (portabilidad). Escriba al correo del apartado 1 indicando qué derecho ejerce; si
                dudamos de su identidad, le pediremos que la acredite. Respondemos en el plazo de un
                mes.
              </p>
              <p>
                Si cree que no hemos tratado bien sus datos, puede reclamar ante la autoridad de
                control. En España es la Agencia Española de Protección de Datos (
                <a
                  href="https://www.aepd.es"
                  rel="noopener noreferrer"
                  className="text-solar-ink underline underline-offset-4"
                >
                  aepd.es
                </a>
                ). Preferimos que nos escriba antes, para poder resolverlo.
              </p>
            </Section>

            <Section id="clientes" title="8. Clientes con instalación propia">
              <p>
                Esta política cubre la web y la demo. Cuando una organización contrata Solaris y lo
                instala con sus documentos reales, esos datos los tratamos por cuenta de la
                organización, que es la responsable, bajo un contrato de encargo de tratamiento
                propio. Esos documentos no pasan por esta web ni por la demo.
              </p>
            </Section>

            <Section id="cambios" title="9. Cambios en esta política">
              <p>
                Si cambiamos algo que le afecte, actualizaremos la fecha de arriba. Las versiones
                anteriores se pueden pedir al correo del apartado 1.
              </p>
            </Section>
    </LegalShell>
  )
}
