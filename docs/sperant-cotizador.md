# Integraciones del tema headless (cotizador, Meta, webhook, libro de reclamaciones)

Todo el código vive en `theme-nuevo-function.php`, portado desde `theme-antiguo-function.php` y reescrito con las APIs de WordPress.

## Flujo de un lead

```
Formulario (Next.js)
  └─ POST /wp-json/armando-paredes/v1/sperant/clients
       ├─ valida email / fname / phone            → 400 si falta algo
       ├─ POST https://api.sperant.com/v3/clients → lead en el CRM
       └─ do_action( 'armando_paredes_sperant_client_created' )
            ├─ Meta Conversions API (evento Lead)          [siempre, si hay credenciales]
            └─ Webhook a algoritmo.digital                 [solo si ARMANDO_PAREDES_WEBHOOK_ON_LEAD]
```

Un solo POST basta. El webhook también existe como endpoint aparte para replicar el comportamiento del sitio antiguo, que hacía dos llamadas.

---

## Configuración

**El tema funciona sin configurar nada.** Todas las credenciales traen el valor heredado de `theme-antiguo-function.php` escrito en el propio archivo, así que basta con subirlo.

| Constante | Valor por defecto | Origen |
|---|---|---|
| `SPERANT_API_TOKEN` | `nXnVOS…qV6z` | `AUTHORIZATION` del tema antiguo |
| `ARMANDO_PAREDES_SPERANT_URL` | `https://api.sperant.com/v3` | `SPERANT_URL` |
| `ARMANDO_PAREDES_META_PIXEL_ID` | `272056255262784` | `$pixelId` de `enviar_lead_a_meta()` |
| `ARMANDO_PAREDES_META_TOKEN` | `EAAClp…ZDZD` | `$accessToken` de `enviar_lead_a_meta()` |
| `ARMANDO_PAREDES_META_API_VERSION` | `v21.0` | El antiguo usaba `v18.0`, ya fuera de soporte |
| `ARMANDO_PAREDES_WEBHOOK_URL` | `https://algoritmo.digital/armandoparedes/api/v1/clientecreado.php` | `CURLOPT_URL` de `webhook_send()` |
| `ARMANDO_PAREDES_LIBRO_FORM_ID` | `6` | `if (6 == $form_id)` |
| `ARMANDO_PAREDES_ALLOWED_ORIGINS` | `https://armandoparedes2026-frontend.vercel.app` | Nuevo |
| `ARMANDO_PAREDES_REST_NAMESPACE` | `armando-paredes/v1` | Nuevo |

### Orden de prioridad

Para las credenciales: **constante de `wp-config.php` → variable de entorno → valor heredado en el código**. Como `wp-config.php` se carga antes que el tema, cualquier constante que definas ahí gana.

### Constantes opcionales

```php
// Mover las credenciales fuera del código (recomendado en producción).
define( 'SPERANT_API_TOKEN', '...' );
define( 'ARMANDO_PAREDES_META_TOKEN', '...' );

// Comportamiento.
define( 'ARMANDO_PAREDES_META_ENABLED', false );       // Apaga el envío a Meta.
define( 'ARMANDO_PAREDES_WEBHOOK_ON_LEAD', true );     // Webhook junto con Sperant, una sola llamada.
define( 'ARMANDO_PAREDES_SPERANT_LOG', true );         // Registra cada envío.

// Seguridad.
define( 'ARMANDO_PAREDES_ALLOWED_ORIGINS', 'https://www.armandoparedes.com,https://armandoparedes2026-frontend.vercel.app' );
define( 'ARMANDO_PAREDES_ALLOW_LOCALHOST', false );    // Bloquea entornos locales.
define( 'ARMANDO_PAREDES_LEAD_TOKEN', 'cadena-larga-aleatoria' ); // Llamadas servidor a servidor.
```

### Sobre los tokens en el código

Los tokens de Sperant y Meta están escritos en `theme-nuevo-function.php`, igual que lo estaban en el tema anterior. Dos cosas a tener en cuenta:

- **Ninguno de los dos archivos está en git** (`git ls-files` no los lista y el token no aparece en el historial). Si algún día los commiteas, los tokens entran al repositorio: conviene añadirlos a `.gitignore` o moverlos antes a `wp-config.php`.
- **El token de Meta caduca.** Si los eventos dejan de llegar al pixel, es lo primero que hay que revisar.

---

## Identificadores obligatorios de Sperant

La API **rechaza el alta con 400** si falta cualquiera de estos cuatro. El tema los completa solo, con estos valores por defecto:

| Constante | Valor | Significa | Catálogo |
|---|---|---|---|
| `ARMANDO_PAREDES_SPERANT_INPUT_CHANNEL_ID` | `6` | formulario web | `GET /v3/input_channels` |
| `ARMANDO_PAREDES_SPERANT_SOURCE_ID` | `1` | página web | `GET /v3/captation_ways` |
| `ARMANDO_PAREDES_SPERANT_INTEREST_TYPE_ID` | `11` | por contactar | `GET /v3/interest_types` |
| `ARMANDO_PAREDES_SPERANT_PROJECT_ID` | `28` | Campañas (respaldo) | `GET /v3/projects` |

Lo que envíe el formulario siempre gana sobre el valor por defecto. La regla heredada de `geolocalizacion` sigue forzando `source_id = 45`.

> `source_id` sale de `captation_ways`. La ruta `/v3/sources` **no existe**: devuelve 404.

### IDs de proyecto en Sperant

| ID | Proyecto | | ID | Proyecto |
|---|---|---|---|---|
| 37 | Los Ángeles | | 24 | **Libertad 277** |
| 36 | Guardia Civil | | 22 | Pasaje Los Pinos |
| 35 | Parque Dammert | | 20 | Pasaje Dos de Mayo |
| 34 | Melitón Porras 320 | | 19 | Toribio Polo 322 |
| 33 | Pasaje Santa Cruz 480 | | 16 | Ugarte y Moscoso 370 |
| 30 | Nuevo Pasaje Los Pinos | | 15 | Pasaje Los Laureles |
| 28 | Campañas | | 12 | Ugarte y Moscoso 330 |
| 27 | Parque Incario | | 10 | Machaypuito 160 |
| 26 | Pasaje Ugarte 546 | | 7 | Tacna |

Lista completa y al día: `GET https://api.sperant.com/v3/projects` con el encabezado `Authorization: <token>`.

Estos son los valores que hay que cargar en el campo ACF `sperant_project_id` de cada proyecto.

---

## Endpoints

Base = `NEXT_PUBLIC_CMS_URL` (QA: `https://apros-qa.net.pe/armandoparedes2026`).

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/wp-json/armando-paredes/v1/sperant/clients` | Registra el lead en Sperant y dispara Meta |
| `GET` | `/wp-json/armando-paredes/v1/sperant/captation-ways` | Medios de captación (caché 1 h, `?refresh=1`) |
| `POST` | `/wp-json/armando-paredes/v1/webhook/lead` | Envía el lead al webhook externo |
| `GET` | `/wp-json/armando-paredes/v1/libro-reclamaciones/counter` | Correlativo del libro de reclamaciones |
| `GET` | `/wp-json/armando-paredes/v1/client-ip` | IP del visitante |

### Alias heredados del tema anterior

Existen para no romper el sitio en producción durante la migración. Devuelven exactamente el mismo formato que antes.

| Método | Ruta |
|---|---|
| `POST` | `/wp-json/wp/v2/create/clients` |
| `GET` | `/wp-json/wp/v2/get/captation_ways` |
| `POST` | `/wp-json/webhook/v1/send` |
| `GET` | `/wp-json/codReclamo/v1/codReclamo4` |
| `GET` | `/wp-json/ipAddress/v1/ip` |

---

## Sperant

### Cuerpo de la petición

Acepta JSON (`Content-Type: application/json`) o `form-data`.

| Campo | Tipo | Obligatorio | Nota |
|---|---|---|---|
| `email` | string | Sí | Validado con `is_email()` |
| `fname` | string | Sí | Nombres |
| `phone` | string | Sí | Celular |
| `lname` | string | No | Apellidos |
| `document` | string | No | Número de documento |
| `document_type_id` | int | No | |
| `project_id` | int | No | Proyecto de interés en Sperant |
| `input_channel_id` | int | No | Canal de ingreso |
| `source_id` | int | No | Fuente |
| `interest_type_id` | int | No | Tipo de interés |
| `utm_source` … `utm_content` | string | No | Los cinco parámetros UTM |
| `gclid` | string | No | Se envía dentro de `extra_fields.gclid` |
| `extra_fields` | objeto | No | Contenedor libre: distrito, presupuesto, etc. Claves normalizadas con `sanitize_key()` |

Campos que **no** van a Sperant pero sí se usan en Meta y en el webhook: `client_ip_address`, `client_user_agent`, `fbc`, `fbp`, `event_id`, `event_source_url`, `form_source`.

Los textos pasan por `sanitize_text_field()` y el correo por `sanitize_email()`. Los `*_id` vacíos no se envían.

**Regla heredada:** si `utm_source` es `geolocalizacion` (sin distinguir mayúsculas), `source_id` se fuerza a `45`.

### Respuestas

Éxito (`200`):

```json
{
  "success": true,
  "client_id": "123456",
  "status": "nuevo",
  "event_id": "9f3c...",
  "data": { "...respuesta completa de Sperant..." }
}
```

Errores:

| HTTP | `code` | Causa |
|---|---|---|
| `400` | `rest_invalid_param` | Falta o es inválido `email`, `fname` o `phone`. No se llama a Sperant. |
| `403` | `rest_forbidden_origin` | El `Origin`/`Referer` no está en la lista blanca, o la petición no trae ninguno de los dos ni `X-Lead-Token` |
| `500` | `sperant_missing_token` | No está definido `SPERANT_API_TOKEN` |
| `502` | `sperant_unreachable` | No se pudo contactar con la API (timeout, DNS, TLS) |
| `502` | `sperant_error` | Sperant respondió con error; incluye `sperant_status` y `sperant_response` |

---

## Meta Conversions API

Se dispara automáticamente tras registrar el lead en Sperant. Si Sperant falla, el evento **no** se envía.

Se envía a `https://graph.facebook.com/{version}/{pixel_id}/events` con el `access_token` **en el cuerpo**, no en la URL, para que no quede escrito en logs de acceso.

| Campo del evento | Origen |
|---|---|
| `event_name` | `Lead` |
| `event_id` | Parámetro `event_id` de la petición, o un UUID generado |
| `action_source` | `website` |
| `event_source_url` | Parámetro `event_source_url`, o el `Referer` |
| `custom_data.form_source` | Parámetro `form_source` (por defecto `Formulario de Contacto Principal`) |

`user_data`, con SHA-256 donde corresponde:

| Clave | Normalización |
|---|---|
| `em` | `trim` + minúsculas, luego SHA-256 |
| `fn`, `ln` | `trim` + minúsculas, luego SHA-256 |
| `ph` | Solo dígitos; si quedan 9 se antepone `51` (Perú); luego SHA-256 |
| `fbc`, `fbp` | Sin hashear, tal como los entrega el navegador |
| `client_ip_address` | Parámetro homónimo, o la IP resuelta en el servidor |
| `client_user_agent` | Parámetro homónimo, o el `User-Agent` de la petición |

### Deduplicación con el pixel del navegador

El frontend debe generar un id, usarlo en el pixel y mandarlo en el mismo POST:

```ts
const eventId = crypto.randomUUID();

fbq("track", "Lead", {}, { eventID: eventId });

await fetch(`${cmsUrl}/wp-json/armando-paredes/v1/sperant/clients`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ ...values, event_id: eventId, fbc, fbp }),
});
```

Si no lo envía, el servidor genera uno y lo devuelve en `event_id` dentro de la respuesta.

> **Versión de la Graph API:** el tema anterior usaba `v18.0`, fuera de soporte desde 2025. El valor por defecto aquí es `v21.0`; conviene revisar el [changelog de la Graph API](https://developers.facebook.com/docs/graph-api/changelog) y ajustar `ARMANDO_PAREDES_META_API_VERSION` a una versión vigente.

---

## Webhook externo

Destino por defecto: `https://algoritmo.digital/armandoparedes/api/v1/clientecreado.php`.

El cuerpo conserva **las mismas 18 claves** que enviaba `webhook_send()` en el tema anterior, para no romper el script receptor:

```
email, fname, lname, phone, project_id, input_channel_id, source_id, interest_type_id,
document_type_id, document, utm_source, utm_medium, utm_campaign, utm_term, utm_content,
client_ip_address, fbc, fbp
```

Dos formas de usarlo:

1. **Como endpoint aparte** (comportamiento del sitio antiguo): el frontend hace un POST a `/webhook/lead` además del de Sperant.
2. **Automático** (recomendado): `define( 'ARMANDO_PAREDES_WEBHOOK_ON_LEAD', true );` y el webhook sale solo, junto con el alta en Sperant, con una sola llamada del frontend.

Respuesta de éxito, idéntica a la anterior:

```json
{ "status": "success", "message": "Datos recibidos y enviados correctamente", "data": { } }
```

---

## Libro de Reclamaciones

Correlativo guardado en la opción `codReclamo`.

- `cf7dtx_counter_libro()` — devuelve el siguiente código con tres dígitos (`007`). **El nombre no se puede cambiar**: el formulario de Contact Form 7 lo invoca como tag dinámico.
- `cf7dtx_increment_mail_counter()` — incrementa el contador en `wpcf7_mail_sent`, solo para el formulario `ARMANDO_PAREDES_LIBRO_FORM_ID` (por defecto el **6**).
- `GET /armando-paredes/v1/libro-reclamaciones/counter` → `{ "current": 12, "next": "013" }`
- `GET /codReclamo/v1/codReclamo4` → `"12"` (formato heredado)

---

## IP del visitante

`GET /armando-paredes/v1/client-ip` → `{ "ip_address": "190.12.3.4" }`

Resuelve en este orden: `CF-Connecting-IP`, `X-Forwarded-For`, `Client-IP`, `REMOTE_ADDR`. A diferencia del tema anterior, valida cada valor con `FILTER_VALIDATE_IP` y de una cadena `X-Forwarded-For` toma **solo la primera IP** en vez de devolverla completa.

> Estos encabezados los puede falsificar el cliente. Sirven para enriquecer eventos de Meta, no para autenticar ni para decisiones de seguridad.

---

## Administración

`armando_paredes_headless_hide_classic_editor()` oculta el editor de contenido (`#postdivrich`) en `post`, `page`, `proyecto` y `proyecto-entregado`, porque el contenido se arma con ACF. Ajustable con el filtro `armando_paredes_headless_hidden_editor_post_types`.

---

## Frontend

### Piezas

| Archivo | Rol |
|---|---|
| `lib/lead.ts` | Traduce los campos en español al contrato de Sperant, reúne UTM, `gclid`, `fbc`, `fbp` y genera el `event_id` |
| `hooks/useLeadSubmit.ts` | Hace el POST, dispara el pixel con el mismo `event_id` y expone `status` / `isPending` |
| `hooks/useCf7Submit.ts` | Se conserva para los formularios que siguen en Contact Form 7 |

### Formularios conectados

| Formulario | Dónde aparece | `form_source` |
|---|---|---|
| `ProyectoLeadForm` | Sección "Quiero más información" de la interna de proyecto | `Quiero más información` |
| `FormularioContacto` | Sección de contacto de la interna de proyecto | `Formulario de contacto` |
| `ModalLeadForm` | Modal del botón flotante | `Formulario flotante` |
| `ContactoForm` | Página `/contacto` | `Página de contacto` |

En la interna de proyecto el contexto se arma en `app/proyectos/[slug]/page.tsx` y baja por `ProjectSectionMapper` y `FloatingButtons` mediante la prop `lead`.

### Contact Form 7 sigue vivo

Cada envío sale a **dos destinos en paralelo**: el endpoint de Sperant, que decide si el formulario se considera enviado, y Contact Form 7, que sigue mandando el correo de aviso al equipo comercial. El resultado de CF7 es best-effort y no altera el mensaje que ve el visitante.

### Mapeo de campos

| Formulario | Sperant |
|---|---|
| `nombres` | `fname` |
| `apellido` | `lname` |
| `correo` | `email` |
| `celular` | `phone` |
| `distrito`, `presupuesto`, `proyecto`, `medio` | `extra_fields` |
| `marketing` | `extra_fields.acepta_marketing` |

### Atribución

`captureTracking()` guarda los UTM y el `gclid` en `sessionStorage` la primera vez que aparecen en la URL, de modo que el lead conserva la atribución aunque el visitante navegue antes de enviar. `fbc` y `fbp` se leen de las cookies del pixel; si falta `_fbc` pero la URL trae `fbclid`, se arma con el formato `fb.1.<timestamp>.<fbclid>`.

### Falta: el ID de proyecto en Sperant

`lead.projectId` sale de `proyecto.acf.sperant_project_id`, **un campo ACF que todavía no existe**. Hasta crearlo, los leads llegan a Sperant sin `project_id`. Hay que añadirlo al grupo de campos del CPT `proyecto` (texto o número) y llenarlo con el ID que cada proyecto tiene en el CRM.

Ojo: `formulario_id` de ACF es el ID del formulario de Contact Form 7, no sirve como `project_id`.

---

## Orígenes y CORS

Los endpoints de **escritura** (`sperant/clients`, `webhook/lead` y sus alias) solo aceptan solicitudes de orígenes autorizados. Los de **lectura** (`captation-ways`, `client-ip`, `libro-reclamaciones/counter`) siguen siendo públicos: no reciben datos ni exponen nada sensible.

### Quién puede enviar

Por defecto, definido en el propio tema:

| Origen | Estado |
|---|---|
| `https://armandoparedes2026-frontend.vercel.app` | Permitido |
| `http://localhost:*`, `127.0.0.1`, `::1`, `.local`, `.test` | Permitido |
| Con encabezado `X-Lead-Token` válido | Permitido (servidor a servidor) |
| Cualquier otro dominio | **403** |
| Sin `Origin` ni `Referer` y sin token | **403** |

Orden de evaluación en `armando_paredes_rest_origin_allowed()`:

1. Lista blanca vacía → todo permitido. **Solo para depurar**; vaciarla abre los endpoints a cualquiera.
2. `X-Lead-Token` válido → permitido, sin mirar el origen.
3. Entorno local → permitido, salvo `ARMANDO_PAREDES_ALLOW_LOCALHOST` en `false`.
4. `Origin` o `Referer` que coincida con la lista blanca → permitido.
5. Todo lo demás → `403 rest_forbidden_origin`.

### Cómo se compara

`armando_paredes_rest_origin_matches()` compara **esquema, host y puerto**, ignorando la ruta, así que sirve igual para `Origin` que para `Referer`.

- `http://` no vale por `https://`.
- `https://armandoparedes2026-frontend.vercel.app.otro-sitio.com` no cuela.
- La barra final en la lista blanca no estorba.
- Se admite un comodín por etiqueta: `https://*.vercel.app` acepta `app-git-devjc-equipo.vercel.app` pero no `a.b.vercel.app`.

Para habilitar los previews de Vercel, que cambian de subdominio en cada deploy:

```php
define( 'ARMANDO_PAREDES_ALLOWED_ORIGINS', 'https://armandoparedes2026-frontend.vercel.app,https://armandoparedes2026-frontend-*.vercel.app' );
```

### Alcance real de esta protección

`Origin` y `Referer` los impone el navegador, no el servidor. Esto impide que **otra web** publique en tus endpoints desde el navegador de un visitante, y que un navegador lea la respuesta. **No detiene a un script**, que puede enviar el `Origin` que quiera con `curl`.

Para cerrarlo de verdad hay que dejar de aceptar peticiones directas del navegador:

1. El formulario publica en una Route Handler de Next.js (`app/api/lead/route.ts`).
2. Esa ruta llama a WordPress de servidor a servidor con `X-Lead-Token`.
3. Se agrega rate limit por IP y Vercel BotID o Turnstile en la ruta de Next.js.

Genera el token con `openssl rand -hex 32` y guárdalo en `wp-config.php` y en las variables de entorno de Vercel (sin prefijo `NEXT_PUBLIC_`, para que no llegue al navegador).

### Encabezados CORS

`armando_paredes_headless_cors_headers()` (filtro `rest_pre_serve_request`) actúa **solo en estas rutas**:

- Origen permitido → reafirma los encabezados, por si un plugin de seguridad los elimina:

```
Access-Control-Allow-Origin: <origen de la solicitud>
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Accept, Authorization, X-WP-Nonce
Access-Control-Max-Age: 86400
Vary: Origin
```

- Origen no permitido → **retira** `Access-Control-Allow-Origin`, que WordPress emite para cualquier origen en la REST API, de modo que el navegador tampoco pueda leer el 403.

---

## Logs

Van al log de PHP con el prefijo `[Sperant]`. Se activan con `WP_DEBUG` o `ARMANDO_PAREDES_SPERANT_LOG`; los errores se registran siempre.

| Etiqueta | Cuándo |
|---|---|
| `ENVIO` | Cuerpo normalizado, antes de llamar a Sperant |
| `RESPUESTA` | Código HTTP, `client_id`, `status` y cuerpo devuelto |
| `ERROR` | Fallo de red, token ausente o rechazo de Sperant |
| `META` / `META ERROR` | Resultado del evento de Meta |
| `WEBHOOK ENVIO` / `WEBHOOK RESPUESTA` / `WEBHOOK ERROR` | Resultado del webhook externo |

---

## Puntos de extensión

| Hook | Tipo | Uso |
|---|---|---|
| `armando_paredes_sperant_client_created` | acción | Se dispara tras registrar el lead: `( $client_id, $payload, $request )` |
| `armando_paredes_sperant_token` | filtro | Resolver el token desde otra fuente |
| `armando_paredes_sperant_client_defaults` | filtro | IDs por defecto cuando el formulario no los envía |
| `armando_paredes_sperant_client_payload` | filtro | Último ajuste del cuerpo de Sperant |
| `armando_paredes_meta_credentials` | filtro | Pixel y token de Meta |
| `armando_paredes_meta_lead_event` | filtro | Último ajuste del evento de Meta |
| `armando_paredes_webhook_url` | filtro | Destino del webhook |
| `armando_paredes_webhook_payload` | filtro | Cuerpo del webhook |
| `armando_paredes_rest_allowed_origins` | filtro | Lista blanca de orígenes |
| `armando_paredes_headless_hidden_editor_post_types` | filtro | Tipos de contenido sin editor clásico |

---

## Pruebas

```bash
CMS=https://apros-qa.net.pe/armandoparedes2026

# Lead completo, simulando el frontend local.
# El encabezado Origin es obligatorio: sin él la respuesta es 403.
curl -i -X POST $CMS/wp-json/armando-paredes/v1/sperant/clients \
  -H "Content-Type: application/json" -H "Origin: http://localhost:3000" \
  -d '{"email":"prueba@test.com","fname":"Juan","lname":"Perez","phone":"999999999","project_id":1}'

# Debe responder 403: origen no autorizado
curl -s -o /dev/null -w "%{http_code}\n" -X POST $CMS/wp-json/armando-paredes/v1/sperant/clients \
  -H "Content-Type: application/json" -H "Origin: https://sitio-cualquiera.com" -d '{}'

curl -s $CMS/wp-json/armando-paredes/v1/sperant/captation-ways
curl -s $CMS/wp-json/armando-paredes/v1/client-ip
curl -s $CMS/wp-json/armando-paredes/v1/libro-reclamaciones/counter

# Verificar que todas las rutas quedaron registradas
curl -s $CMS/wp-json/armando-paredes/v1 | python3 -m json.tool
```

---

## Diferencias respecto al tema anterior

| Antes (`theme-antiguo-function.php`) | Ahora |
|---|---|
| `fetch()` propia con cURL crudo | `wp_remote_request()` / `wp_remote_post()` |
| Tokens de Sperant y Meta hardcodeados | Constantes de `wp-config.php`, entorno o filtro |
| Sin validación: todo se enviaba a Sperant | Valida `email`, `fname` y `phone`; responde 400 sin llamar a la API |
| `wp_send_json($string)` — JSON dentro de un string | `WP_REST_Response` con el cuerpo ya decodificado |
| Log en `sperant_log.log` dentro del tema, accesible por URL | `error_log()` con prefijo `[Sperant]` |
| Lista blanca de dominios comentada en el código | Constante + filtro, con localhost siempre permitido |
| `captation_ways` sin caché | Transient de 1 hora |
| Meta con `'blocking' => false`: los errores pasaban en silencio | Envío bloqueante con timeout de 10 s y log del resultado |
| Meta sin `event_id` | `event_id` para deduplicar con el pixel del navegador |
| Meta en Graph API `v18.0` (fuera de soporte) | Versión configurable, `v21.0` por defecto |
| `webhook_send()` llamaba `curl_error()` sobre un handle ya cerrado | Manejo de error real con `WP_Error` |
| Webhook restringido a `https://www.armandoparedes.com` por código | Misma lista blanca que el resto de endpoints |
| IP: devolvía el `X-Forwarded-For` completo, sin validar | Valida con `FILTER_VALIDATE_IP` y toma la primera IP |
| Contador del libro atado al formulario 6 por código | `ARMANDO_PAREDES_LIBRO_FORM_ID` |

### Lo que no se portó, a propósito

- `register_nav_menus()` (`menu_movil`, `menu_footer`): el header y el footer vienen de ACF a través del plugin `wp-next-headless` (`/options/header`, `/options/footer`), no de los menús nativos de WordPress.
- `create_client()` v1: su ruta estaba comentada y `create_clientv2` la reemplazaba.
- El bloque `register_rest_field('blocks')` y el bloque CORS: estaban comentados en el tema anterior.

---

## Pendientes

- **Agregar el dominio de producción a la lista blanca** cuando el sitio salga de Vercel: hoy `https://www.armandoparedes.com` responde 403.
- **Crear el campo ACF `sperant_project_id`** en el CPT `proyecto` y cargarlo con el ID de cada proyecto (ver tabla arriba). Sin él, todos los leads caen en el proyecto de respaldo `28 = Campañas`.
- **Dos formularios siguen solo en Contact Form 7**: el de la sección de planos (`PlanosProyecto.tsx`), que pide nombre, correo y mensaje pero **no celular**, obligatorio para Sperant; y el de referidos (`SeParte.tsx`), que tiene otra naturaleza.
- Revisar y fijar la versión vigente de la Graph API de Meta.
- El namespace `armando-paredes/v1` lo comparte el plugin `wp-next-headless` (`/options/header`, `/options/footer`, `/options/blog`). No hay colisión con las rutas de aquí, y la constante `ARMANDO_PAREDES_REST_NAMESPACE` se define con guarda `if ( ! defined( ... ) )`.

---

## Verificación realizada (16/09/2026)

Contra el CMS de QA, con el tema ya subido:

| Comprobación | Resultado |
|---|---|
| Rutas registradas en `/wp-json/armando-paredes/v1` | Las 5 presentes |
| `POST` sin celular ni correo válido | `400 rest_invalid_param`, no llama a Sperant |
| `POST` con `Origin: https://sitio-cualquiera.com` | `403 rest_forbidden_origin` |
| `POST` sin `Origin` ni `Referer` | `403` |
| Preflight `OPTIONS` desde `http://localhost:3000` | Encabezados CORS correctos |
| `GET /sperant/captation-ways` | 47 medios reales: el token de Sperant funciona |
| Alta de cliente completa | `200`, **client_id 79107**, `status: interested` |
| `extra_fields` personalizados | Sperant los guarda: `distrito`, `presupuesto`, `acepta_marketing`, `gclid` |
| Teléfono | Sperant lo normaliza a `+51999000111` |
| Token de Meta y Graph API `v21.0` | Autentican correctamente |

El lead de prueba `PRUEBA QA / Ignorar Este Lead / prueba.qa.formulario@example.com` quedó registrado en Sperant con el ID 79107 y conviene borrarlo.
