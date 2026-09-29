<?php
/**
 * Configuración del tema headless de Armando Paredes.
 *
 * @package ArmandoParedesHeadless
 */

defined( 'ABSPATH' ) || exit;

/**
 * Habilita capacidades editoriales usadas por WordPress y la REST API.
 */
function armando_paredes_headless_setup(): void {
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'title-tag' );
	add_theme_support(
		'html5',
		array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' )
	);
}
add_action( 'after_setup_theme', 'armando_paredes_headless_setup' );

/**
 * Registra la ruta interna que identifica la pantalla informativa del CMS.
 */
function armando_paredes_headless_register_rewrite(): void {
	add_rewrite_rule(
		'^headless-info/?$',
		'index.php?armando_paredes_headless_info=1',
		'top'
	);
}
add_action( 'init', 'armando_paredes_headless_register_rewrite' );

/**
 * Añade la variable de consulta usada por la pantalla informativa.
 *
 * @param string[] $vars Variables públicas de WordPress.
 * @return string[]
 */
function armando_paredes_headless_query_vars( array $vars ): array {
	$vars[] = 'armando_paredes_headless_info';

	return $vars;
}
add_filter( 'query_vars', 'armando_paredes_headless_query_vars' );

/**
 * Renderiza una respuesta mínima para explicar el rol headless del CMS.
 */
function armando_paredes_headless_render_info(): void {
	if ( ! get_query_var( 'armando_paredes_headless_info' ) ) {
		return;
	}

	status_header( 200 );
	nocache_headers();
	header( 'Content-Type: text/html; charset=' . get_option( 'blog_charset' ) );

	$site_name = get_bloginfo( 'name' );
	$rest_url  = rest_url();
	$admin_url = admin_url();
	?>
	<!doctype html>
	<html lang="es">
	<head>
		<meta charset="<?php echo esc_attr( get_option( 'blog_charset' ) ); ?>">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="robots" content="noindex,nofollow">
		<title><?php echo esc_html( $site_name ); ?> — Headless CMS</title>
		<style>
			body{font-family:system-ui,sans-serif;max-width:640px;margin:4rem auto;padding:0 1.5rem;color:#1b1c1c;line-height:1.6}
			code{background:#f0eded;padding:.2rem .4rem;border-radius:4px}
			a{color:#00629e}
		</style>
	</head>
	<body>
		<h1><?php echo esc_html( $site_name ); ?> Headless CMS</h1>
		<p>Este WordPress administra contenido. El sitio público se sirve desde Next.js.</p>
		<p>REST API: <a href="<?php echo esc_url( $rest_url ); ?>"><code><?php echo esc_html( $rest_url ); ?></code></a></p>
		<p><a href="<?php echo esc_url( $admin_url ); ?>">Ir al panel de administración →</a></p>
	</body>
	</html>
	<?php
	exit;
}
add_action( 'template_redirect', 'armando_paredes_headless_render_info', 5 );

/**
 * Mantiene las visitas públicas de WordPress en la pantalla informativa.
 */
function armando_paredes_headless_redirect_frontend(): void {
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
		return;
	}

	wp_safe_redirect( home_url( '/headless-info/' ) );
	exit;
}
add_action( 'template_redirect', 'armando_paredes_headless_redirect_frontend' );

/**
 * Regenera reglas solamente cuando se activa el tema.
 */
function armando_paredes_headless_flush_rewrites(): void {
	armando_paredes_headless_register_rewrite();
	flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'armando_paredes_headless_flush_rewrites' );

/**
 * ---------------------------------------------------------------------------
 * Sperant CRM — envío de leads del cotizador y formularios del sitio.
 *
 * Todas las credenciales traen el valor heredado del tema anterior, así que
 * funciona sin configurar nada. Definirlas en wp-config.php las sobrescribe.
 *
 *     define( 'SPERANT_API_TOKEN', 'xxxxxxxxxxxxxxxx' );            // Sobrescribe el token.
 *     define( 'ARMANDO_PAREDES_SPERANT_LOG', true );                // Opcional: registra cada envío.
 *     define( 'ARMANDO_PAREDES_ALLOWED_ORIGINS', 'https://a,https://b' ); // Lista blanca de orígenes.
 *     define( 'ARMANDO_PAREDES_ALLOW_LOCALHOST', false );           // Opcional: bloquea entornos locales.
 *     define( 'ARMANDO_PAREDES_LEAD_TOKEN', '...' );                // Opcional: llamadas servidor a servidor.
 *
 * Endpoints expuestos:
 *     POST /wp-json/armando-paredes/v1/sperant/clients
 *     GET  /wp-json/armando-paredes/v1/sperant/captation-ways
 *     POST /wp-json/wp/v2/create/clients      (alias heredado del tema anterior)
 *     GET  /wp-json/wp/v2/get/captation_ways  (alias heredado del tema anterior)
 *
 * Tras registrar el lead se dispara armando_paredes_sperant_client_created, del
 * que cuelgan el evento de Meta y, si se activa, el webhook externo. Ambos
 * bloques están más abajo en este archivo.
 *
 * Documentación completa: docs/sperant-cotizador.md
 * ---------------------------------------------------------------------------
 */

if ( ! defined( 'ARMANDO_PAREDES_REST_NAMESPACE' ) ) {
	define( 'ARMANDO_PAREDES_REST_NAMESPACE', 'armando-paredes/v1' );
}

if ( ! defined( 'ARMANDO_PAREDES_SPERANT_URL' ) ) {
	define( 'ARMANDO_PAREDES_SPERANT_URL', 'https://api.sperant.com/v3' );
}

/**
 * Token de la API de Sperant, heredado del tema anterior.
 *
 * El orden de prioridad es: constante en wp-config.php, variable de entorno y,
 * como último recurso, este valor. Conviene moverlo a wp-config.php y rotarlo.
 */
if ( ! defined( 'SPERANT_API_TOKEN' ) ) {
	define( 'SPERANT_API_TOKEN', getenv( 'SPERANT_API_TOKEN' ) ?: 'nXnVOSGFSz3L8JoPUBsOb5An09J91tII8ituqV6z' );
}

/**
 * Identificadores obligatorios de Sperant.
 *
 * La API rechaza el alta si falta cualquiera de los cuatro. Los valores salen
 * de los catálogos del CRM:
 *
 *   input_channel_id  6  = "formulario web"        (GET /v3/input_channels)
 *   source_id         1  = "página web"            (GET /v3/captation_ways)
 *   interest_type_id  11 = "por contactar"         (GET /v3/interest_types)
 *   project_id        28 = "Campañas"              (GET /v3/projects)
 *
 * project_id es el respaldo para cuando el formulario no manda uno propio. Lo
 * ideal es que cada proyecto envíe el suyo: Libertad 277 es 24, Guardia Civil
 * 36, Parque Dammert 35, etc.
 */
if ( ! defined( 'ARMANDO_PAREDES_SPERANT_INPUT_CHANNEL_ID' ) ) {
	define( 'ARMANDO_PAREDES_SPERANT_INPUT_CHANNEL_ID', 6 );
}

if ( ! defined( 'ARMANDO_PAREDES_SPERANT_SOURCE_ID' ) ) {
	define( 'ARMANDO_PAREDES_SPERANT_SOURCE_ID', 1 );
}

if ( ! defined( 'ARMANDO_PAREDES_SPERANT_INTEREST_TYPE_ID' ) ) {
	define( 'ARMANDO_PAREDES_SPERANT_INTEREST_TYPE_ID', 11 );
}

if ( ! defined( 'ARMANDO_PAREDES_SPERANT_PROJECT_ID' ) ) {
	define( 'ARMANDO_PAREDES_SPERANT_PROJECT_ID', 28 );
}

/**
 * Completa los identificadores que el formulario no envía.
 *
 * Solo rellena los que falten: lo que mande el formulario siempre gana.
 *
 * @param array $defaults Valores por defecto acumulados.
 * @return array
 */
function armando_paredes_sperant_default_ids( array $defaults ): array {
	return array_merge(
		array(
			'input_channel_id' => (int) ARMANDO_PAREDES_SPERANT_INPUT_CHANNEL_ID,
			'source_id'        => (int) ARMANDO_PAREDES_SPERANT_SOURCE_ID,
			'interest_type_id' => (int) ARMANDO_PAREDES_SPERANT_INTEREST_TYPE_ID,
			'project_id'       => (int) ARMANDO_PAREDES_SPERANT_PROJECT_ID,
		),
		$defaults
	);
}
add_filter( 'armando_paredes_sperant_client_defaults', 'armando_paredes_sperant_default_ids' );

/**
 * Obtiene el token de la API de Sperant desde wp-config.php o el entorno.
 */
function armando_paredes_sperant_token(): string {
	$token = defined( 'SPERANT_API_TOKEN' ) ? (string) SPERANT_API_TOKEN : '';

	/**
	 * Permite resolver el token desde otra fuente (gestor de secretos, opción, etc.).
	 *
	 * @param string $token Token actual.
	 */
	return trim( (string) apply_filters( 'armando_paredes_sperant_token', $token ) );
}

/**
 * Registra la actividad del cotizador en el log de PHP.
 *
 * @param string $label Etiqueta del evento (ENVIO, RESPUESTA, ERROR).
 * @param mixed  $data  Datos a serializar.
 * @param bool   $force Fuerza el registro aunque el log esté desactivado.
 */
function armando_paredes_sperant_log( string $label, $data, bool $force = false ): void {
	$enabled = ( defined( 'ARMANDO_PAREDES_SPERANT_LOG' ) && ARMANDO_PAREDES_SPERANT_LOG )
		|| ( defined( 'WP_DEBUG' ) && WP_DEBUG );

	if ( ! $force && ! $enabled ) {
		return;
	}

	$payload = is_string( $data )
		? $data
		: wp_json_encode( $data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );

	error_log( sprintf( '[Sperant] %s: %s', $label, $payload ) );
}

/**
 * Ejecuta una llamada HTTP contra la API v3 de Sperant.
 *
 * @param string     $path   Ruta relativa, por ejemplo "/clients".
 * @param string     $method Método HTTP.
 * @param array|null $body   Cuerpo que se serializa como JSON.
 * @return array|WP_Error Arreglo con las claves code, raw y data.
 */
function armando_paredes_sperant_request( string $path, string $method = 'GET', ?array $body = null ) {
	$token = armando_paredes_sperant_token();

	if ( '' === $token ) {
		armando_paredes_sperant_log( 'ERROR', 'SPERANT_API_TOKEN no está definido.', true );

		return new WP_Error(
			'sperant_missing_token',
			'Falta configurar SPERANT_API_TOKEN en wp-config.php.',
			array( 'status' => 500 )
		);
	}

	$args = array(
		'method'  => $method,
		'timeout' => 30,
		'headers' => array(
			'Content-Type'  => 'application/json',
			'Accept'        => 'application/json',
			'Authorization' => $token,
		),
	);

	if ( null !== $body ) {
		$args['body'] = wp_json_encode( $body );
	}

	$response = wp_remote_request( ARMANDO_PAREDES_SPERANT_URL . $path, $args );

	if ( is_wp_error( $response ) ) {
		armando_paredes_sperant_log( 'ERROR ' . $path, $response->get_error_message(), true );

		return new WP_Error(
			'sperant_unreachable',
			'No se pudo contactar con Sperant: ' . $response->get_error_message(),
			array( 'status' => 502 )
		);
	}

	$raw  = (string) wp_remote_retrieve_body( $response );
	$data = json_decode( $raw, true );

	return array(
		'code' => (int) wp_remote_retrieve_response_code( $response ),
		'raw'  => $raw,
		'data' => is_array( $data ) ? $data : null,
	);
}

/**
 * Normaliza el objeto extra_fields que envía el formulario.
 *
 * Sperant lo trata como un contenedor libre: ahí viajan el gclid y los campos
 * que el formulario recoge pero el CRM no tiene como propios, por ejemplo el
 * distrito de residencia o el rango de presupuesto.
 *
 * @param WP_REST_Request $request Solicitud entrante.
 * @return array<string,string>
 */
function armando_paredes_sperant_extra_fields( WP_REST_Request $request ): array {
	$extra = $request->get_param( 'extra_fields' );

	// En form-data el objeto puede llegar como JSON serializado.
	if ( is_string( $extra ) ) {
		$decoded = json_decode( $extra, true );
		$extra   = is_array( $decoded ) ? $decoded : array();
	}

	$fields = array();

	if ( is_array( $extra ) ) {
		foreach ( $extra as $key => $value ) {
			if ( is_array( $value ) || is_object( $value ) ) {
				continue;
			}

			$key = sanitize_key( (string) $key );

			if ( '' !== $key ) {
				$fields[ $key ] = sanitize_text_field( (string) $value );
			}
		}
	}

	$fields['gclid'] = sanitize_text_field( (string) $request->get_param( 'gclid' ) );

	return $fields;
}

/**
 * Arma la observación que el equipo comercial lee en la ficha del cliente.
 *
 * Replica el formato del sitio anterior: presupuesto y los identificadores de
 * seguimiento, que Sperant no guarda como campos propios.
 *
 * @param WP_REST_Request $request Solicitud entrante.
 */
function armando_paredes_sperant_observation( WP_REST_Request $request ): string {
	$propia = sanitize_text_field( (string) $request->get_param( 'observation' ) );

	if ( '' !== $propia ) {
		return $propia;
	}

	$partes = array();

	$presupuesto = sanitize_text_field( (string) $request->get_param( 'presupuesto' ) );

	if ( '' !== $presupuesto ) {
		$partes[] = 'Presupuesto: ' . $presupuesto;
	}

	$fbc = sanitize_text_field( (string) $request->get_param( 'fbc' ) );
	$fbp = sanitize_text_field( (string) $request->get_param( 'fbp' ) );
	$ip  = sanitize_text_field( (string) $request->get_param( 'client_ip_address' ) ) ?: armando_paredes_client_ip();

	if ( '' !== $fbc ) {
		$partes[] = 'fbc: ' . $fbc;
	}

	if ( '' !== $fbp ) {
		$partes[] = 'fbp: ' . $fbp;
	}

	if ( '' !== $ip ) {
		$partes[] = 'ip_address: ' . $ip;
	}

	return implode( ', ', $partes );
}

/**
 * Deduce el source_id a partir del utm_source.
 *
 * Si el utm_source coincide por nombre con un medio de captación de Sperant, se
 * usa su id. Es la misma regla del sitio anterior, que así atribuía los leads a
 * "google", "facebook", "instagram", etc. sin configurar nada.
 *
 * @param string $utm_source Valor recibido.
 * @return int|null Identificador, o null si no hay coincidencia.
 */
function armando_paredes_sperant_source_from_utm( string $utm_source ): ?int {
	$utm_source = strtolower( trim( $utm_source ) );

	if ( '' === $utm_source || 'organic' === $utm_source ) {
		return null;
	}

	// Regla heredada: la geolocalización tiene su propio medio de captación.
	if ( 'geolocalizacion' === $utm_source ) {
		return 45;
	}

	$ways = armando_paredes_sperant_captation_ways();

	if ( is_wp_error( $ways ) || empty( $ways['data']['data'] ) ) {
		return null;
	}

	foreach ( $ways['data']['data'] as $way ) {
		$name = strtolower( trim( (string) ( $way['attributes']['name'] ?? '' ) ) );

		if ( '' !== $name && $name === $utm_source ) {
			return (int) $way['id'];
		}
	}

	return null;
}

/**
 * Normaliza los campos del formulario al contrato de Sperant.
 *
 * @param WP_REST_Request $request Solicitud entrante (JSON o form-data).
 * @return array
 */
function armando_paredes_sperant_client_payload( WP_REST_Request $request ): array {
	$payload = array(
		'email'        => sanitize_email( (string) $request->get_param( 'email' ) ),
		'fname'        => sanitize_text_field( (string) $request->get_param( 'fname' ) ),
		'lname'        => sanitize_text_field( (string) $request->get_param( 'lname' ) ),
		'phone'        => sanitize_text_field( (string) $request->get_param( 'phone' ) ),
		'address'      => sanitize_text_field( (string) $request->get_param( 'address' ) ),
		'observation'  => armando_paredes_sperant_observation( $request ),
		'document'     => sanitize_text_field( (string) $request->get_param( 'document' ) ),
		'utm_source'   => sanitize_text_field( (string) $request->get_param( 'utm_source' ) ),
		'utm_medium'   => sanitize_text_field( (string) $request->get_param( 'utm_medium' ) ),
		'utm_campaign' => sanitize_text_field( (string) $request->get_param( 'utm_campaign' ) ),
		'utm_term'     => sanitize_text_field( (string) $request->get_param( 'utm_term' ) ),
		'utm_content'  => sanitize_text_field( (string) $request->get_param( 'utm_content' ) ),
		'extra_fields' => armando_paredes_sperant_extra_fields( $request ),
	);

	$ids = array( 'project_id', 'input_channel_id', 'source_id', 'interest_type_id', 'document_type_id' );

	foreach ( $ids as $key ) {
		$value = $request->get_param( $key );

		if ( null !== $value && '' !== $value ) {
			$payload[ $key ] = (int) $value;
		}
	}

	/**
	 * Valores por defecto para los identificadores que el formulario no envía
	 * (canal de ingreso, tipo de interés, proyecto genérico, etc.).
	 *
	 * @param array           $defaults Identificadores por defecto.
	 * @param WP_REST_Request $request  Solicitud entrante.
	 */
	$payload += (array) apply_filters( 'armando_paredes_sperant_client_defaults', array(), $request );

	// La campaña manda sobre el source_id configurado en el proyecto: si el
	// utm_source identifica un medio de captación, ese es el origen real del lead.
	$desde_utm = armando_paredes_sperant_source_from_utm( $payload['utm_source'] );

	if ( null !== $desde_utm ) {
		$payload['source_id'] = $desde_utm;
	}

	/**
	 * Último ajuste del cuerpo antes de enviarlo a Sperant.
	 *
	 * @param array           $payload Cuerpo normalizado.
	 * @param WP_REST_Request $request Solicitud entrante.
	 */
	return (array) apply_filters( 'armando_paredes_sperant_client_payload', $payload, $request );
}

/**
 * Verifica los campos mínimos que Sperant necesita para registrar un lead.
 *
 * @param array $payload Cuerpo normalizado.
 * @return true|WP_Error
 */
function armando_paredes_sperant_validate_client( array $payload ) {
	$invalid = array();

	if ( '' === $payload['email'] || ! is_email( $payload['email'] ) ) {
		$invalid[] = 'email';
	}

	if ( '' === $payload['fname'] ) {
		$invalid[] = 'fname';
	}

	if ( '' === $payload['phone'] ) {
		$invalid[] = 'phone';
	}

	if ( ! empty( $invalid ) ) {
		return new WP_Error(
			'rest_invalid_param',
			'Campos obligatorios ausentes o inválidos: ' . implode( ', ', $invalid ),
			array(
				'status' => 400,
				'params' => $invalid,
			)
		);
	}

	return true;
}

/**
 * Registra el lead del cotizador en Sperant.
 *
 * @param WP_REST_Request $request Solicitud entrante.
 * @return array|WP_Error Resultado con code, raw, data, client_id y status.
 */
function armando_paredes_sperant_create_client( WP_REST_Request $request ) {
	$payload = armando_paredes_sperant_client_payload( $request );
	$valid   = armando_paredes_sperant_validate_client( $payload );

	if ( is_wp_error( $valid ) ) {
		return $valid;
	}

	armando_paredes_sperant_log( 'ENVIO', $payload );

	$result = armando_paredes_sperant_request( '/clients', 'POST', $payload );

	if ( is_wp_error( $result ) ) {
		return $result;
	}

	$result['client_id'] = $result['data']['data']['id'] ?? null;
	$result['status']    = $result['data']['data']['attributes']['status'] ?? null;

	if ( $result['code'] < 200 || $result['code'] >= 300 ) {
		armando_paredes_sperant_log(
			'ERROR',
			array(
				'http'      => $result['code'],
				'enviado'   => $payload,
				'respuesta' => $result['raw'],
			),
			true
		);

		return new WP_Error(
			'sperant_error',
			'Sperant rechazó el registro del cliente.',
			array(
				'status'           => 502,
				'sperant_status'   => $result['code'],
				'sperant_response' => $result['data'],
			)
		);
	}

	armando_paredes_sperant_log(
		'RESPUESTA',
		array(
			'http'      => $result['code'],
			'client_id' => $result['client_id'],
			'status'    => $result['status'],
			'body'      => $result['data'],
		)
	);

	/**
	 * Punto de extensión posterior al registro del lead (Meta CAPI, webhooks, etc.).
	 *
	 * @param int|string|null $client_id Identificador devuelto por Sperant.
	 * @param array           $payload   Cuerpo enviado.
	 * @param WP_REST_Request $request   Solicitud entrante.
	 */
	do_action( 'armando_paredes_sperant_client_created', $result['client_id'], $payload, $request );

	return $result;
}

/**
 * Devuelve los medios de captación configurados en Sperant, con caché de una hora.
 *
 * @param bool $refresh Ignora la caché cuando es true.
 * @return array|WP_Error
 */
function armando_paredes_sperant_captation_ways( bool $refresh = false ) {
	$cache_key = 'armando_paredes_sperant_captation_ways';
	$cached    = $refresh ? false : get_transient( $cache_key );

	if ( is_array( $cached ) ) {
		return $cached;
	}

	$result = armando_paredes_sperant_request( '/captation_ways' );

	if ( is_wp_error( $result ) ) {
		return $result;
	}

	if ( $result['code'] < 200 || $result['code'] >= 300 ) {
		return new WP_Error(
			'sperant_error',
			'No se pudieron obtener los medios de captación.',
			array(
				'status'         => 502,
				'sperant_status' => $result['code'],
			)
		);
	}

	set_transient( $cache_key, $result, HOUR_IN_SECONDS );

	return $result;
}

/**
 * Origen permitido por defecto. wp-config.php puede sobrescribirlo, porque se
 * carga antes que el tema. Se admiten varios separados por coma y comodines en
 * el subdominio, por ejemplo https://*.vercel.app para los previews.
 */
if ( ! defined( 'ARMANDO_PAREDES_ALLOWED_ORIGINS' ) ) {
	define( 'ARMANDO_PAREDES_ALLOWED_ORIGINS', 'https://armandoparedes2026-frontend.vercel.app' );
}

/**
 * Lista blanca de orígenes permitidos para los endpoints públicos.
 *
 * @return string[]
 */
function armando_paredes_rest_allowed_origins(): array {
	$origins = array();

	if ( defined( 'ARMANDO_PAREDES_ALLOWED_ORIGINS' ) && ARMANDO_PAREDES_ALLOWED_ORIGINS ) {
		$origins = array_filter( array_map( 'trim', explode( ',', (string) ARMANDO_PAREDES_ALLOWED_ORIGINS ) ) );
	}

	/**
	 * Orígenes autorizados. Una lista vacía deja los endpoints abiertos a
	 * cualquier dominio, así que solo tiene sentido vaciarla para depurar.
	 *
	 * @param string[] $origins Orígenes configurados.
	 */
	return (array) apply_filters( 'armando_paredes_rest_allowed_origins', $origins );
}

/**
 * Token compartido para las llamadas servidor a servidor, que no llevan Origin.
 */
function armando_paredes_rest_shared_token(): string {
	$token = defined( 'ARMANDO_PAREDES_LEAD_TOKEN' )
		? (string) ARMANDO_PAREDES_LEAD_TOKEN
		: (string) getenv( 'ARMANDO_PAREDES_LEAD_TOKEN' );

	return trim( $token );
}

/**
 * Comprueba el encabezado X-Lead-Token contra el token compartido.
 */
function armando_paredes_rest_token_valid(): bool {
	$expected = armando_paredes_rest_shared_token();

	if ( '' === $expected ) {
		return false;
	}

	$given = isset( $_SERVER['HTTP_X_LEAD_TOKEN'] )
		? trim( sanitize_text_field( wp_unslash( (string) $_SERVER['HTTP_X_LEAD_TOKEN'] ) ) )
		: '';

	return '' !== $given && hash_equals( $expected, $given );
}

/**
 * Indica si una URL corresponde a un entorno de desarrollo local.
 *
 * Cubre localhost, 127.0.0.1, ::1, host.docker.internal y los dominios
 * .local / .test / .localhost, en cualquier puerto.
 *
 * @param string $url Origin o Referer de la solicitud.
 */
function armando_paredes_rest_is_local_url( string $url ): bool {
	if ( '' === $url ) {
		return false;
	}

	$host = strtolower( trim( (string) wp_parse_url( $url, PHP_URL_HOST ), '[]' ) );

	if ( '' === $host ) {
		return false;
	}

	$hosts = array( 'localhost', '127.0.0.1', '0.0.0.0', '::1', 'host.docker.internal' );

	if ( in_array( $host, $hosts, true ) ) {
		return true;
	}

	return 1 === preg_match( '/\\.(local|test|localhost)$/', $host );
}

/**
 * Compara una URL contra una entrada de la lista blanca.
 *
 * Se comparan esquema, host y puerto; la ruta se ignora, de modo que sirve
 * tanto para el encabezado Origin como para el Referer. El host admite un
 * comodín por etiqueta, por ejemplo https://*.vercel.app.
 *
 * @param string $url     Origin o Referer recibido.
 * @param string $pattern Entrada de la lista blanca.
 */
function armando_paredes_rest_origin_matches( string $url, string $pattern ): bool {
	if ( '' === $url || '' === $pattern ) {
		return false;
	}

	$url_parts     = wp_parse_url( $url );
	$pattern_parts = wp_parse_url( untrailingslashit( trim( $pattern ) ) );

	if ( empty( $url_parts['host'] ) || empty( $pattern_parts['host'] ) ) {
		return false;
	}

	// El esquema debe coincidir cuando la lista blanca lo declara.
	if ( ! empty( $pattern_parts['scheme'] ) ) {
		$url_scheme = strtolower( (string) ( $url_parts['scheme'] ?? '' ) );

		if ( $url_scheme !== strtolower( (string) $pattern_parts['scheme'] ) ) {
			return false;
		}
	}

	// Lo mismo con el puerto.
	if ( isset( $pattern_parts['port'] ) && (int) $pattern_parts['port'] !== (int) ( $url_parts['port'] ?? 0 ) ) {
		return false;
	}

	$url_host     = strtolower( (string) $url_parts['host'] );
	$pattern_host = strtolower( (string) $pattern_parts['host'] );

	if ( false === strpos( $pattern_host, '*' ) ) {
		return $url_host === $pattern_host;
	}

	// El comodín cubre una sola etiqueta: *.vercel.app no acepta a.b.vercel.app.
	$regex = '/^' . str_replace( '\\*', '[a-z0-9-]+', preg_quote( $pattern_host, '/' ) ) . '$/';

	return 1 === preg_match( $regex, $url_host );
}

/**
 * Comprueba que la solicitud provenga de un origen autorizado.
 *
 * Orden de evaluación:
 *   1. Lista blanca vacía  → todo permitido (solo para depurar).
 *   2. X-Lead-Token válido → permitido (llamadas servidor a servidor).
 *   3. Entorno local       → permitido salvo ARMANDO_PAREDES_ALLOW_LOCALHOST.
 *   4. Origin o Referer    → debe coincidir con la lista blanca.
 *   5. Cualquier otra cosa, incluidas las peticiones sin Origin ni Referer,
 *      se rechaza.
 */
function armando_paredes_rest_origin_allowed(): bool {
	$allowed = armando_paredes_rest_allowed_origins();

	if ( empty( $allowed ) ) {
		return true;
	}

	if ( armando_paredes_rest_token_valid() ) {
		return true;
	}

	$origin  = (string) get_http_origin();
	$referer = isset( $_SERVER['HTTP_REFERER'] )
		? esc_url_raw( wp_unslash( (string) $_SERVER['HTTP_REFERER'] ) )
		: '';

	// Desarrollo local (npm run dev) siempre habilitado salvo que se desactive.
	$allow_local = ! defined( 'ARMANDO_PAREDES_ALLOW_LOCALHOST' ) || ARMANDO_PAREDES_ALLOW_LOCALHOST;

	if ( $allow_local && ( armando_paredes_rest_is_local_url( $origin ) || armando_paredes_rest_is_local_url( $referer ) ) ) {
		return true;
	}

	foreach ( $allowed as $candidate ) {
		if ( armando_paredes_rest_origin_matches( $origin, $candidate ) ) {
			return true;
		}

		if ( armando_paredes_rest_origin_matches( $referer, $candidate ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Permiso de los endpoints públicos del cotizador.
 *
 * @return true|WP_Error
 */
function armando_paredes_rest_public_permission() {
	if ( ! armando_paredes_rest_origin_allowed() ) {
		return new WP_Error(
			'rest_forbidden_origin',
			'Acceso denegado: origen no autorizado.',
			array(
				'status' => 403,
				'hint'   => 'Envía la solicitud desde un origen de ARMANDO_PAREDES_ALLOWED_ORIGINS, o incluye el encabezado X-Lead-Token.',
			)
		);
	}

	return true;
}

/**
 * Refuerza los encabezados CORS de los endpoints del cotizador.
 *
 * WordPress ya emite Access-Control-Allow-Origin en la REST API, pero algunos
 * plugins de seguridad o reglas del servidor lo eliminan y el formulario deja de
 * enviarse desde localhost o desde el dominio de Vercel.
 *
 * @param bool             $served  Si la respuesta ya fue servida.
 * @param WP_HTTP_Response $result  Respuesta.
 * @param WP_REST_Request  $request Solicitud entrante.
 * @return bool
 */
function armando_paredes_headless_cors_headers( $served, $result, $request ) {
	if ( ! $request instanceof WP_REST_Request ) {
		return $served;
	}

	$route    = (string) $request->get_route();
	$prefixes = array(
		'/' . ARMANDO_PAREDES_REST_NAMESPACE . '/sperant',
		'/' . ARMANDO_PAREDES_REST_NAMESPACE . '/webhook',
		'/' . ARMANDO_PAREDES_REST_NAMESPACE . '/libro-reclamaciones',
		'/' . ARMANDO_PAREDES_REST_NAMESPACE . '/client-ip',
		'/wp/v2/create/clients',
		'/wp/v2/get/captation_ways',
		'/webhook/v1/send',
		'/codReclamo/v1',
		'/ipAddress/v1',
	);

	$matches = false;

	foreach ( $prefixes as $prefix ) {
		if ( 0 === strpos( $route, $prefix ) ) {
			$matches = true;
			break;
		}
	}

	$origin = (string) get_http_origin();

	if ( ! $matches || '' === $origin ) {
		return $served;
	}

	if ( ! armando_paredes_rest_origin_allowed() ) {
		// WordPress devuelve Access-Control-Allow-Origin para cualquier origen en
		// la REST API. Se retira para que el navegador tampoco pueda leer el 403.
		header_remove( 'Access-Control-Allow-Origin' );
		header_remove( 'Access-Control-Allow-Credentials' );

		return $served;
	}

	header( 'Access-Control-Allow-Origin: ' . esc_url_raw( $origin ) );
	header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
	header( 'Access-Control-Allow-Headers: Content-Type, Accept, Authorization, X-WP-Nonce' );
	header( 'Access-Control-Max-Age: 86400' );
	header( 'Vary: Origin', false );

	return $served;
}
add_filter( 'rest_pre_serve_request', 'armando_paredes_headless_cors_headers', 20, 3 );

/**
 * Respuesta del endpoint de creación de clientes.
 *
 * @param WP_REST_Request $request Solicitud entrante.
 * @return WP_REST_Response|WP_Error
 */
function armando_paredes_headless_create_client_response( WP_REST_Request $request ) {
	$result = armando_paredes_sperant_create_client( $request );

	if ( is_wp_error( $result ) ) {
		return $result;
	}

	return new WP_REST_Response(
		array(
			'success'   => true,
			'client_id' => $result['client_id'],
			'status'    => $result['status'],
			// El navegador debe reusarlo como eventID del pixel para deduplicar.
			'event_id'  => armando_paredes_meta_event_id( $request ),
			'data'      => $result['data'],
		),
		200
	);
}

/**
 * Alias heredado: responde con el cuerpo crudo de Sperant, igual que el tema anterior.
 *
 * @param WP_REST_Request $request Solicitud entrante.
 * @return void|WP_Error
 */
function armando_paredes_headless_create_client_legacy( WP_REST_Request $request ) {
	$result = armando_paredes_sperant_create_client( $request );

	if ( is_wp_error( $result ) ) {
		return $result;
	}

	wp_send_json( $result['raw'] );
}

/**
 * Respuesta del endpoint de medios de captación.
 *
 * @param WP_REST_Request $request Solicitud entrante.
 * @return WP_REST_Response|WP_Error
 */
function armando_paredes_headless_captation_ways_response( WP_REST_Request $request ) {
	$result = armando_paredes_sperant_captation_ways( (bool) $request->get_param( 'refresh' ) );

	if ( is_wp_error( $result ) ) {
		return $result;
	}

	return new WP_REST_Response( $result['data'], 200 );
}

/**
 * Alias heredado de los medios de captación.
 *
 * @param WP_REST_Request $request Solicitud entrante.
 * @return void|WP_Error
 */
function armando_paredes_headless_captation_ways_legacy( WP_REST_Request $request ) {
	$result = armando_paredes_sperant_captation_ways( (bool) $request->get_param( 'refresh' ) );

	if ( is_wp_error( $result ) ) {
		return $result;
	}

	wp_send_json( $result['raw'] );
}

/**
 * Registra las rutas REST de la integración con Sperant.
 */
function armando_paredes_headless_register_sperant_routes(): void {
	register_rest_route(
		ARMANDO_PAREDES_REST_NAMESPACE,
		'/sperant/clients',
		array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => 'armando_paredes_headless_create_client_response',
			'permission_callback' => 'armando_paredes_rest_public_permission',
		)
	);

	register_rest_route(
		ARMANDO_PAREDES_REST_NAMESPACE,
		'/sperant/captation-ways',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => 'armando_paredes_headless_captation_ways_response',
			'permission_callback' => '__return_true',
		)
	);

	// Alias heredados del tema anterior para no romper el sitio en producción.
	register_rest_route(
		'wp/v2',
		'/create/clients',
		array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => 'armando_paredes_headless_create_client_legacy',
			'permission_callback' => 'armando_paredes_rest_public_permission',
		)
	);

	register_rest_route(
		'wp/v2',
		'/get/captation_ways',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => 'armando_paredes_headless_captation_ways_legacy',
			'permission_callback' => '__return_true',
		)
	);
}
add_action( 'rest_api_init', 'armando_paredes_headless_register_sperant_routes' );

/**
 * ---------------------------------------------------------------------------
 * Meta Conversions API — evento Lead enviado desde el servidor.
 *
 * Se dispara con la acción armando_paredes_sperant_client_created, es decir,
 * cada vez que un lead se registra correctamente en Sperant.
 *
 * El pixel y el token vienen del tema anterior y están más abajo. Para
 * sobrescribirlos, en wp-config.php:
 *     define( 'ARMANDO_PAREDES_META_PIXEL_ID', '...' );
 *     define( 'ARMANDO_PAREDES_META_TOKEN', 'EAA...' );
 *     define( 'ARMANDO_PAREDES_META_API_VERSION', 'v21.0' ); // Opcional.
 *     define( 'ARMANDO_PAREDES_META_ENABLED', false );       // Opcional: apaga el envío.
 * ---------------------------------------------------------------------------
 */

/**
 * Pixel y token de Meta, heredados del tema anterior.
 *
 * Igual que con Sperant: wp-config.php y las variables de entorno mandan sobre
 * estos valores. El token de Meta caduca, así que si los eventos dejan de
 * llegar, lo primero que hay que revisar es este dato.
 */
if ( ! defined( 'ARMANDO_PAREDES_META_PIXEL_ID' ) ) {
	define( 'ARMANDO_PAREDES_META_PIXEL_ID', getenv( 'ARMANDO_PAREDES_META_PIXEL_ID' ) ?: '272056255262784' );
}

if ( ! defined( 'ARMANDO_PAREDES_META_TOKEN' ) ) {
	define( 'ARMANDO_PAREDES_META_TOKEN', getenv( 'ARMANDO_PAREDES_META_TOKEN' ) ?: 'EAAClpuOZBzsEBPubwYSUwRhAgeDY5jtvGWeqmzU0KmLbFhZCO2wxsp6brkyg7auVd2vjJC7pXVJBs0pcRAwl03H1ssZBsOzh4DoRffajbl5nYKzOBg6Wpc8p3Badok6DoYO6lVWXbly6Hq6ZCisXSAOybUHliDRCZBCnZAr5U4QxQZCqtvF1rfL1jB8zCRjlpp9cQZDZD' );
}

/**
 * Credenciales del pixel de Meta.
 *
 * @return array{pixel_id:string,token:string}
 */
function armando_paredes_meta_credentials(): array {
	$pixel_id = defined( 'ARMANDO_PAREDES_META_PIXEL_ID' ) ? (string) ARMANDO_PAREDES_META_PIXEL_ID : '';
	$token    = defined( 'ARMANDO_PAREDES_META_TOKEN' ) ? (string) ARMANDO_PAREDES_META_TOKEN : '';

	/**
	 * Permite resolver las credenciales desde otra fuente.
	 *
	 * @param array $credentials Pixel y token actuales.
	 */
	return (array) apply_filters(
		'armando_paredes_meta_credentials',
		array(
			'pixel_id' => trim( $pixel_id ),
			'token'    => trim( $token ),
		)
	);
}

/**
 * Identificador del evento, compartido entre el pixel del navegador y el servidor.
 *
 * Si el frontend envía "event_id" se respeta, de modo que Meta pueda deduplicar
 * el evento del navegador con el del servidor. Si no, se genera uno.
 *
 * @param WP_REST_Request $request Solicitud entrante.
 */
function armando_paredes_meta_event_id( WP_REST_Request $request ): string {
	static $event_id = '';

	if ( '' !== $event_id ) {
		return $event_id;
	}

	$param    = sanitize_text_field( (string) $request->get_param( 'event_id' ) );
	$event_id = '' !== $param ? $param : wp_generate_uuid4();

	return $event_id;
}

/**
 * Normaliza y aplica SHA-256 a un dato personal según las reglas de Meta.
 *
 * @param string $value Valor en claro.
 * @param string $type  "phone" para teléfonos, cualquier otra cosa para texto.
 */
function armando_paredes_meta_hash( string $value, string $type = 'text' ): string {
	$value = trim( $value );

	if ( '' === $value ) {
		return '';
	}

	if ( 'phone' === $type ) {
		$value = (string) preg_replace( '/\D/', '', $value );

		// Los celulares peruanos de 9 dígitos se envían con código de país.
		if ( 9 === strlen( $value ) ) {
			$value = '51' . $value;
		}
	} elseif ( function_exists( 'mb_strtolower' ) ) {
		$value = mb_strtolower( $value );
	} else {
		$value = strtolower( $value );
	}

	return '' === $value ? '' : hash( 'sha256', $value );
}

/**
 * Resuelve la IP real del visitante descartando valores inválidos.
 */
function armando_paredes_client_ip(): string {
	$keys = array( 'HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_CLIENT_IP', 'REMOTE_ADDR' );

	foreach ( $keys as $key ) {
		if ( empty( $_SERVER[ $key ] ) ) {
			continue;
		}

		$value = sanitize_text_field( wp_unslash( (string) $_SERVER[ $key ] ) );

		// X-Forwarded-For puede traer una cadena de IPs: la primera es el cliente.
		foreach ( explode( ',', $value ) as $candidate ) {
			$candidate = trim( $candidate );

			if ( filter_var( $candidate, FILTER_VALIDATE_IP ) ) {
				return $candidate;
			}
		}
	}

	return '';
}

/**
 * Envía el evento Lead a la API de Conversiones de Meta.
 *
 * @param array           $payload Cuerpo normalizado del lead.
 * @param WP_REST_Request $request Solicitud entrante.
 * @return bool True si Meta aceptó el evento.
 */
function armando_paredes_meta_send_lead( array $payload, WP_REST_Request $request ): bool {
	if ( defined( 'ARMANDO_PAREDES_META_ENABLED' ) && ! ARMANDO_PAREDES_META_ENABLED ) {
		return false;
	}

	$credentials = armando_paredes_meta_credentials();

	if ( '' === $credentials['pixel_id'] || '' === $credentials['token'] ) {
		armando_paredes_sperant_log( 'META', 'Sin ARMANDO_PAREDES_META_PIXEL_ID o ARMANDO_PAREDES_META_TOKEN: evento omitido.' );

		return false;
	}

	if ( '' === $payload['email'] || ! is_email( $payload['email'] ) ) {
		return false;
	}

	$user_data = array_filter(
		array(
			'em'                => armando_paredes_meta_hash( $payload['email'] ),
			'fn'                => armando_paredes_meta_hash( $payload['fname'] ),
			'ln'                => armando_paredes_meta_hash( $payload['lname'] ),
			'ph'                => armando_paredes_meta_hash( $payload['phone'], 'phone' ),
			'fbc'               => sanitize_text_field( (string) $request->get_param( 'fbc' ) ),
			'fbp'               => sanitize_text_field( (string) $request->get_param( 'fbp' ) ),
			'client_ip_address' => sanitize_text_field( (string) $request->get_param( 'client_ip_address' ) ) ?: armando_paredes_client_ip(),
			'client_user_agent' => sanitize_text_field( (string) $request->get_param( 'client_user_agent' ) )
				?: ( isset( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_text_field( wp_unslash( (string) $_SERVER['HTTP_USER_AGENT'] ) ) : '' ),
		)
	);

	$form_source = sanitize_text_field( (string) $request->get_param( 'form_source' ) );

	$event = array(
		'event_name'    => 'Lead',
		'event_time'    => time(),
		'event_id'      => armando_paredes_meta_event_id( $request ),
		'action_source' => 'website',
		'user_data'     => $user_data,
		'custom_data'   => array(
			'form_source' => '' !== $form_source ? $form_source : 'Formulario de Contacto Principal',
		),
	);

	$source_url = esc_url_raw( (string) $request->get_param( 'event_source_url' ) );

	if ( '' === $source_url && ! empty( $_SERVER['HTTP_REFERER'] ) ) {
		$source_url = esc_url_raw( wp_unslash( (string) $_SERVER['HTTP_REFERER'] ) );
	}

	if ( '' !== $source_url ) {
		$event['event_source_url'] = $source_url;
	}

	$version = defined( 'ARMANDO_PAREDES_META_API_VERSION' )
		? (string) ARMANDO_PAREDES_META_API_VERSION
		: 'v21.0';

	/**
	 * Último ajuste del evento antes de enviarlo.
	 *
	 * @param array           $event   Evento de Meta.
	 * @param array           $payload Cuerpo del lead.
	 * @param WP_REST_Request $request Solicitud entrante.
	 */
	$event = (array) apply_filters( 'armando_paredes_meta_lead_event', $event, $payload, $request );

	$response = wp_remote_post(
		sprintf( 'https://graph.facebook.com/%s/%s/events', $version, $credentials['pixel_id'] ),
		array(
			'timeout' => 10,
			'headers' => array( 'Content-Type' => 'application/json' ),
			// El token va en el cuerpo para no dejarlo escrito en logs de URLs.
			'body'    => wp_json_encode(
				array(
					'data'         => array( $event ),
					'access_token' => $credentials['token'],
				)
			),
		)
	);

	if ( is_wp_error( $response ) ) {
		armando_paredes_sperant_log( 'META ERROR', $response->get_error_message(), true );

		return false;
	}

	$code = (int) wp_remote_retrieve_response_code( $response );
	$raw  = (string) wp_remote_retrieve_body( $response );

	if ( $code < 200 || $code >= 300 ) {
		armando_paredes_sperant_log(
			'META ERROR',
			array(
				'http'      => $code,
				'respuesta' => $raw,
			),
			true
		);

		return false;
	}

	armando_paredes_sperant_log(
		'META',
		array(
			'http'      => $code,
			'event_id'  => $event['event_id'],
			'respuesta' => $raw,
		)
	);

	return true;
}

/**
 * Envía el evento Lead después de registrar el cliente en Sperant.
 *
 * @param int|string|null $client_id Identificador devuelto por Sperant.
 * @param array           $payload   Cuerpo enviado.
 * @param mixed           $request   Solicitud entrante.
 */
function armando_paredes_meta_on_client_created( $client_id, array $payload, $request ): void {
	if ( ! $request instanceof WP_REST_Request ) {
		return;
	}

	armando_paredes_meta_send_lead( $payload, $request );
}
add_action( 'armando_paredes_sperant_client_created', 'armando_paredes_meta_on_client_created', 10, 3 );

/**
 * ---------------------------------------------------------------------------
 * Webhook externo — copia del lead hacia algoritmo.digital.
 *
 * Configuración en wp-config.php:
 *     define( 'ARMANDO_PAREDES_WEBHOOK_URL', 'https://...' );   // Opcional: cambia el destino.
 *     define( 'ARMANDO_PAREDES_WEBHOOK_ON_LEAD', true );        // Opcional: envía junto con Sperant.
 *
 * Endpoints:
 *     POST /wp-json/armando-paredes/v1/webhook/lead
 *     POST /wp-json/webhook/v1/send  (alias heredado del tema anterior)
 * ---------------------------------------------------------------------------
 */

if ( ! defined( 'ARMANDO_PAREDES_WEBHOOK_URL' ) ) {
	define( 'ARMANDO_PAREDES_WEBHOOK_URL', 'https://algoritmo.digital/armandoparedes/api/v1/clientecreado.php' );
}

/**
 * Arma el cuerpo del webhook con las mismas claves que usaba el tema anterior.
 *
 * @param WP_REST_Request $request Solicitud entrante.
 * @return array
 */
function armando_paredes_webhook_payload( WP_REST_Request $request ): array {
	$lead = armando_paredes_sperant_client_payload( $request );

	$body = array(
		'email'            => $lead['email'],
		'fname'            => $lead['fname'],
		'lname'            => $lead['lname'],
		'phone'            => $lead['phone'],
		'project_id'       => $lead['project_id'] ?? null,
		'input_channel_id' => $lead['input_channel_id'] ?? null,
		'source_id'        => $lead['source_id'] ?? null,
		'interest_type_id' => $lead['interest_type_id'] ?? null,
		'document_type_id' => $lead['document_type_id'] ?? null,
		'document'         => $lead['document'],
		'utm_source'       => $lead['utm_source'],
		'utm_medium'       => $lead['utm_medium'],
		'utm_campaign'     => $lead['utm_campaign'],
		'utm_term'         => $lead['utm_term'],
		'utm_content'      => $lead['utm_content'],
		'client_ip_address' => sanitize_text_field( (string) $request->get_param( 'client_ip_address' ) ) ?: armando_paredes_client_ip(),
		'fbc'              => sanitize_text_field( (string) $request->get_param( 'fbc' ) ),
		'fbp'              => sanitize_text_field( (string) $request->get_param( 'fbp' ) ),
	);

	/**
	 * Permite ajustar el cuerpo enviado al webhook externo.
	 *
	 * @param array           $body    Cuerpo del webhook.
	 * @param WP_REST_Request $request Solicitud entrante.
	 */
	return (array) apply_filters( 'armando_paredes_webhook_payload', $body, $request );
}

/**
 * Entrega el lead al webhook externo.
 *
 * @param array $body Cuerpo a enviar.
 * @return array|WP_Error Arreglo con code, raw y data.
 */
function armando_paredes_webhook_send( array $body ) {
	/**
	 * URL de destino del webhook.
	 *
	 * @param string $url Destino configurado.
	 */
	$url = (string) apply_filters( 'armando_paredes_webhook_url', ARMANDO_PAREDES_WEBHOOK_URL );

	if ( '' === $url ) {
		return new WP_Error(
			'webhook_missing_url',
			'No hay una URL de webhook configurada.',
			array( 'status' => 500 )
		);
	}

	armando_paredes_sperant_log( 'WEBHOOK ENVIO', $body );

	$response = wp_remote_post(
		$url,
		array(
			'timeout'     => 20,
			'redirection' => 10,
			'headers'     => array( 'Content-Type' => 'application/json' ),
			'body'        => wp_json_encode( $body ),
		)
	);

	if ( is_wp_error( $response ) ) {
		armando_paredes_sperant_log( 'WEBHOOK ERROR', $response->get_error_message(), true );

		return new WP_Error(
			'webhook_unreachable',
			'Error al enviar datos al webhook: ' . $response->get_error_message(),
			array( 'status' => 502 )
		);
	}

	$code = (int) wp_remote_retrieve_response_code( $response );
	$raw  = (string) wp_remote_retrieve_body( $response );
	$data = json_decode( $raw, true );

	if ( $code < 200 || $code >= 300 ) {
		armando_paredes_sperant_log(
			'WEBHOOK ERROR',
			array(
				'http'      => $code,
				'respuesta' => $raw,
			),
			true
		);

		return new WP_Error(
			'webhook_error',
			'El webhook respondió con un error.',
			array(
				'status'           => 502,
				'webhook_status'   => $code,
				'webhook_response' => $data,
			)
		);
	}

	armando_paredes_sperant_log(
		'WEBHOOK RESPUESTA',
		array(
			'http'      => $code,
			'respuesta' => $data,
		)
	);

	return array(
		'code' => $code,
		'raw'  => $raw,
		'data' => is_array( $data ) ? $data : null,
	);
}

/**
 * Respuesta del endpoint del webhook.
 *
 * @param WP_REST_Request $request Solicitud entrante.
 * @return WP_REST_Response|WP_Error
 */
function armando_paredes_headless_webhook_response( WP_REST_Request $request ) {
	$result = armando_paredes_webhook_send( armando_paredes_webhook_payload( $request ) );

	if ( is_wp_error( $result ) ) {
		return $result;
	}

	return new WP_REST_Response(
		array(
			'status'  => 'success',
			'message' => 'Datos recibidos y enviados correctamente',
			'data'    => $result['data'],
		),
		200
	);
}

/**
 * Envía el webhook junto con el alta en Sperant cuando así se configura.
 *
 * @param int|string|null $client_id Identificador devuelto por Sperant.
 * @param array           $payload   Cuerpo enviado.
 * @param mixed           $request   Solicitud entrante.
 */
function armando_paredes_webhook_on_client_created( $client_id, array $payload, $request ): void {
	if ( ! $request instanceof WP_REST_Request ) {
		return;
	}

	armando_paredes_webhook_send( armando_paredes_webhook_payload( $request ) );
}

if ( defined( 'ARMANDO_PAREDES_WEBHOOK_ON_LEAD' ) && ARMANDO_PAREDES_WEBHOOK_ON_LEAD ) {
	add_action( 'armando_paredes_sperant_client_created', 'armando_paredes_webhook_on_client_created', 20, 3 );
}

/**
 * ---------------------------------------------------------------------------
 * Libro de Reclamaciones — correlativo del formulario de Contact Form 7.
 *
 * Configuración en wp-config.php:
 *     define( 'ARMANDO_PAREDES_LIBRO_FORM_ID', 6 ); // Opcional: ID del formulario CF7.
 *
 * Endpoints:
 *     GET /wp-json/armando-paredes/v1/libro-reclamaciones/counter
 *     GET /wp-json/codReclamo/v1/codReclamo4  (alias heredado del tema anterior)
 * ---------------------------------------------------------------------------
 */

if ( ! defined( 'CF7_COUNTER_LIBRO' ) ) {
	define( 'CF7_COUNTER_LIBRO', 'cf7-counter-libro' );
}

if ( ! defined( 'ARMANDO_PAREDES_LIBRO_FORM_ID' ) ) {
	define( 'ARMANDO_PAREDES_LIBRO_FORM_ID', 6 );
}

/**
 * Asegura que exista la opción con el correlativo.
 */
function armando_paredes_libro_register_option(): void {
	add_option( 'codReclamo', '0', '', 'yes' );
}
add_action( 'init', 'armando_paredes_libro_register_option' );

/**
 * Correlativo actual del libro de reclamaciones.
 */
function armando_paredes_libro_current(): int {
	return (int) get_option( 'codReclamo', 0 );
}

if ( ! function_exists( 'cf7dtx_counter_libro' ) ) {
	/**
	 * Siguiente código con tres dígitos.
	 *
	 * El nombre se conserva porque el formulario de CF7 lo invoca como tag
	 * dinámico (dynamic text). Renombrarlo rompe el formulario.
	 *
	 * @return string
	 */
	function cf7dtx_counter_libro() {
		return sprintf( '%03d', armando_paredes_libro_current() + 1 );
	}
}

if ( ! function_exists( 'cf7dtx_increment_mail_counter' ) ) {
	/**
	 * Incrementa el correlativo cuando el formulario del libro se envía con éxito.
	 *
	 * @param WPCF7_ContactForm $contact_form Formulario enviado.
	 */
	function cf7dtx_increment_mail_counter( $contact_form ) {
		if ( ! is_object( $contact_form ) || ! method_exists( $contact_form, 'id' ) ) {
			return;
		}

		if ( (int) ARMANDO_PAREDES_LIBRO_FORM_ID !== (int) $contact_form->id() ) {
			return;
		}

		update_option( 'codReclamo', armando_paredes_libro_current() + 1 );
	}
}
add_action( 'wpcf7_mail_sent', 'cf7dtx_increment_mail_counter' );

/**
 * Respuesta del endpoint del correlativo.
 *
 * @return WP_REST_Response
 */
function armando_paredes_headless_libro_counter_response(): WP_REST_Response {
	nocache_headers();

	$current = armando_paredes_libro_current();

	return new WP_REST_Response(
		array(
			'current' => $current,
			'next'    => sprintf( '%03d', $current + 1 ),
		),
		200
	);
}

/**
 * Alias heredado: devuelve el valor crudo de la opción, como el tema anterior.
 *
 * @return string
 */
function armando_paredes_headless_libro_counter_legacy(): string {
	nocache_headers();

	return (string) get_option( 'codReclamo', '0' );
}

/**
 * ---------------------------------------------------------------------------
 * IP del visitante — usada para enriquecer los eventos de Meta.
 *
 * Endpoints:
 *     GET /wp-json/armando-paredes/v1/client-ip
 *     GET /wp-json/ipAddress/v1/ip  (alias heredado del tema anterior)
 * ---------------------------------------------------------------------------
 */

/**
 * Respuesta del endpoint de IP.
 *
 * @return WP_REST_Response
 */
function armando_paredes_headless_client_ip_response(): WP_REST_Response {
	nocache_headers();

	return new WP_REST_Response( array( 'ip_address' => armando_paredes_client_ip() ), 200 );
}

/**
 * Registra las rutas portadas del tema anterior.
 */
function armando_paredes_headless_register_legacy_routes(): void {
	// Webhook externo.
	register_rest_route(
		ARMANDO_PAREDES_REST_NAMESPACE,
		'/webhook/lead',
		array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => 'armando_paredes_headless_webhook_response',
			'permission_callback' => 'armando_paredes_rest_public_permission',
		)
	);

	register_rest_route(
		'webhook/v1',
		'/send',
		array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => 'armando_paredes_headless_webhook_response',
			'permission_callback' => 'armando_paredes_rest_public_permission',
		)
	);

	// Libro de reclamaciones.
	register_rest_route(
		ARMANDO_PAREDES_REST_NAMESPACE,
		'/libro-reclamaciones/counter',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => 'armando_paredes_headless_libro_counter_response',
			'permission_callback' => '__return_true',
		)
	);

	register_rest_route(
		'codReclamo/v1',
		'/codReclamo4',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => 'armando_paredes_headless_libro_counter_legacy',
			'permission_callback' => '__return_true',
		)
	);

	// IP del visitante.
	register_rest_route(
		ARMANDO_PAREDES_REST_NAMESPACE,
		'/client-ip',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => 'armando_paredes_headless_client_ip_response',
			'permission_callback' => '__return_true',
		)
	);

	register_rest_route(
		'ipAddress/v1',
		'/ip',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => 'armando_paredes_headless_client_ip_response',
			'permission_callback' => '__return_true',
		)
	);
}
add_action( 'rest_api_init', 'armando_paredes_headless_register_legacy_routes' );

/**
 * ---------------------------------------------------------------------------
 * Administración de WordPress.
 * ---------------------------------------------------------------------------
 */

/**
 * Oculta el editor clásico en los tipos de contenido que se arman con ACF.
 */
function armando_paredes_headless_hide_classic_editor(): void {
	if ( ! function_exists( 'get_current_screen' ) ) {
		return;
	}

	$screen = get_current_screen();

	if ( ! isset( $screen->post_type ) ) {
		return;
	}

	/**
	 * Tipos de contenido cuyo editor de contenido se oculta.
	 *
	 * @param string[] $post_types Tipos de contenido.
	 */
	$post_types = (array) apply_filters(
		'armando_paredes_headless_hidden_editor_post_types',
		array( 'post', 'page', 'proyecto', 'proyecto-entregado' )
	);

	if ( in_array( $screen->post_type, $post_types, true ) ) {
		echo '<style>#postdivrich{display:none;}</style>';
	}
}
add_action( 'admin_head', 'armando_paredes_headless_hide_classic_editor' );
