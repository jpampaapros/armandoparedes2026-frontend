<?php

/**
 * GeneratePress child theme functions and definitions.
 *
 * Add your custom PHP in this file.
 * Only edit this file if you have direct access to it on your server (to fix errors if they happen).
 */

register_nav_menus( array(
	'menu_movil' => __( 'Menú Movil', 'generatepress' ),
	'menu_footer' => __( 'Menú Footer', 'generatepress' )
) );

// CONTADOR LIBRO
add_option('codReclamo','0','','yes');

define( 'CF7_COUNTER_LIBRO', 'cf7-counter-libro' );

function cf7dtx_counter_libro(){
    $val = get_option('codReclamo') + 1;
	return sprintf("%03d", $val);	
}

function cf7dtx_increment_mail_counter($contact_form){
    $form_id = $contact_form->id();
	if (6 == $form_id) {
		$val = get_option('codReclamo') + 1;
		update_option('codReclamo', $val);		
	}
}

add_action('wpcf7_mail_sent', 'cf7dtx_increment_mail_counter');

add_action( 'rest_api_init', function () {
	register_rest_route( 'codReclamo/v1', '/codReclamo4/',
		array(
			'methods' => 'GET', 
			'callback' => 'convuls_customquery'
		)
	);
});

function convuls_customquery(){
	global $wpdb;
	$row = $wpdb->get_row( $wpdb->prepare( "SELECT option_value FROM $wpdb->options WHERE option_name = 'codReclamo' LIMIT 1") );
	return $row->option_value;
}

// add_action(
//   'rest_api_init',
//   function () {

//     if ( ! function_exists( 'use_block_editor_for_post_type' ) ) {
//       require ABSPATH . 'wp-admin/includes/post.php';
//     }

//     // Surface all Gutenberg blocks in the WordPress REST API
//     $post_types = get_post_types_by_support( [ 'editor' ] );
//     foreach ( $post_types as $post_type ) {
//       if ( use_block_editor_for_post_type( $post_type ) ) {
//         register_rest_field(
//           $post_type,
//           'blocks',
//           [
//             'get_callback' => function ( array $post ) {
//               return parse_blocks( $post['content']['raw'] );
//             },
//           ]
//         );
//       }
//     }
//   }
// );
// 
// 


// API V3 SPERANT

define('AUTHORIZATION', "nXnVOSGFSz3L8JoPUBsOb5An09J91tII8ituqV6z");
define('SPERANT_URL', "https://api.sperant.com/v3");
define('SPERANT_LOG_FILE', __DIR__ . '/sperant_log.log');

function sperant_log($label, $data) {
	$separator = str_repeat('=', 50);
	$payload = is_string($data)
		? $data
		: json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

	$entry = sprintf(
		"\n%s\n[%s] %s\n%s\n",
		$separator,
		date('Y-m-d H:i:s'),
		$label,
		$payload
	);

	error_log($entry, 3, SPERANT_LOG_FILE);
}

function fetch(
  string $url,
  array $options = [
    'headers' => [],
    'method' => 'GET',
    'body' => []
  ]
) {
  if (!isset($url)) {
    throw new Exception("No esxiste ninguna URL", 1);
    return;
  }

  $curl = curl_init();

  curl_setopt_array($curl, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => $options['method'],
    CURLOPT_POSTFIELDS => $options['body'],
    CURLOPT_HTTPHEADER => $options['headers'],
  ]);

  $response = curl_exec($curl);

  $err = curl_error($curl);

  if ($err) {
    throw new Exception('Curl err: ' . $err);
    return;
  }

  curl_close($curl);

  return $response;
}

function create_client($request){
	
	$email = $request->get_param('email');
	$fname = $request->get_param('fname');
	$lname = $request->get_param('lname');
	$phone = $request->get_param('phone');
	$project_id = $request->get_param('project_id');
	$input_channel_id = $request->get_param('input_channel_id');
	$source_id = $request->get_param('source_id');
	$interest_type_id = $request->get_param('interest_type_id');
	$document_type_id = $request->get_param('document_type_id');
	$document = $request->get_param('document');
	$utm_source = $request->get_param('utm_source');
	$utm_medium= $request->get_param('utm_medium');
	$utm_campaign = $request->get_param('utm_campaign');
	$utm_content = $request->get_param('utm_content');
	$utm_term = $request->get_param('utm_term');
	
	$client_ip_address = $request->get_param('client_ip_address');
	$client_user_agent = $request->get_param('client_user_agent');
	$fbc = $request->get_param('fbc');
	$fbp = $request->get_param('fbp');

	$body = (object) array(
		"email" => $email,
		"fname" => $fname,
		"lname" => $lname,
		"phone" => $phone,
		"project_id" => $project_id,
		"input_channel_id" => $input_channel_id,
		"source_id" => $source_id,
		"interest_type_id" => $interest_type_id,
		"document_type_id" => $document_type_id,
		"document" => $document,
		"utm_source" => $utm_source,
		"utm_medium" => $utm_medium,
		"utm_campaign" => $utm_campaign,
		"utm_term" => $utm_term,
		"utm_content" => $utm_content,
        "extra_fields" => array(
        	"gclid" => $request->get_param('gclid')
    	)
	);
	
	return fetch(
    	SPERANT_URL . "/clients",
		[
		  'method' => 'POST',
		  'headers' => [
			"Content-Type: application/json",
			"Authorization:" . AUTHORIZATION
		  ],
		  'body' => json_encode($body)
		]
	);
}


/*
add_action('rest_api_init', function () {
  register_rest_route('wp/v2', "/create/clients", [
    'methods' => 'POST',
    'callback' => function ($request) {
      try {
		  
		$response = create_client($request);
		return wp_send_json($response);

      } catch (\Throwable $th) {
        return new WP_Error('error', $th->getMessage(), ['status' => 500]);
      }
    },
    'permission_callback' => '__return_true'
  ]);
});
*/


// START

add_action('rest_api_init', function () {
    register_rest_route('wp/v2', "/create/clients", [
        'methods' => 'POST',
        'callback' => function ($request) {
            try {
                // Verificar el origen de la solicitud
                $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
                $referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';
                
                // Comprobar que la solicitud viene del dominio permitido
                $allowed_domain = 'https://www.armandoparedes.com';
                $origin_allowed = ($origin === $allowed_domain);
                $referer_allowed = (strpos($referer, $allowed_domain) === 0);
                /*
                if (!$origin_allowed && !$referer_allowed) {
                    return new WP_Error(
                        'rest_forbidden',
                        'Acceso denegado: solo se permiten solicitudes desde ' . $allowed_domain,
                        ['status' => 403]
                    );
                }
                */
                $response = create_clientv2($request);
                return wp_send_json($response);
            } catch (\Throwable $th) {
                return new WP_Error('error', $th->getMessage(), ['status' => 500]);
            }
        },
        'permission_callback' => '__return_true' // Mantenemos esto simple ya que la restricción está en el callback
    ]);
});

// Configurar los encabezados CORS específicamente para este dominio
/*
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    
    add_filter('rest_pre_serve_request', function($served, $result) {
        $allowed_domain = 'https://www.armandoparedes.com';
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        
        if ($origin === $allowed_domain) {
            header('Access-Control-Allow-Origin: ' . $allowed_domain);
            header('Access-Control-Allow-Methods: POST');
            header('Access-Control-Allow-Headers: Content-Type');
            
            // Si la solicitud es un preflight OPTIONS
            if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
                header('Access-Control-Max-Age: 86400'); // Cache por 24 horas
                exit(0);
            }
        } else {
            // Si el origen no está permitido, no enviamos encabezados CORS
            header('HTTP/1.1 403 Forbidden');
            exit(0);
        }
        
        return $served;
    }, 10, 2);
}, 15);
*/
// END


function get_captation_ways(){
	
	return fetch(
    	SPERANT_URL . "/captation_ways",
		[
		  'method' => 'GET',
		  'headers' => [
			"Content-Type: application/json",
			"Authorization:" . AUTHORIZATION
		  ],
		  'body' => ''
		]
	);
}


add_action('rest_api_init', function () {
  /**
   * get project types
   */
  register_rest_route('wp/v2', "/get/captation_ways", [
    'methods' => 'GET',
    'callback' => function ($request) {
      try {
		  
		$response = get_captation_ways();

		return wp_send_json($response);

      } catch (\Throwable $th) {
        return new WP_Error('error', $th->getMessage(), ['status' => 500]);
      }
    },
    'permission_callback' => '__return_true'
  ]);
});

// GET IP ADDRESS

add_action('rest_api_init', function () {
    register_rest_route('ipAddress/v1', '/ip', array(
        'methods' => 'GET',
        'callback' => 'get_user_ip',
    ));
});

function get_user_ip(WP_REST_Request $request) {
    $ip_address = '';
    
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip_address = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip_address = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        $ip_address = $_SERVER['REMOTE_ADDR'];
    }

    return new WP_REST_Response(array(
        'ip_address' => $ip_address,
    ), 200);
}

// WEBHOOK

add_action('rest_api_init', function () {
    register_rest_route('webhook/v1', '/send', array(
        'methods' => 'POST',
        'callback' => function ($request) {
            // Verificar el origen de la solicitud
            $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
            $referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';
            
            // Comprobar que la solicitud viene del dominio permitido
            $allowed_domain = 'https://www.armandoparedes.com';
            $origin_allowed = ($origin === $allowed_domain);
            $referer_allowed = (strpos($referer, $allowed_domain) === 0);
            
            if (!$origin_allowed && !$referer_allowed) {
                return new WP_Error(
                    'rest_forbidden',
                    'Acceso denegado: solo se permiten solicitudes desde ' . $allowed_domain,
                    ['status' => 403]
                );
            }
            
            // Si el origen está permitido, proceder con la función original
            return webhook_send($request);
        },
        'permission_callback' => '__return_true',
    ));
});



/*
add_action('rest_api_init', function () {
    register_rest_route('webhook/v1', '/send', array(
        'methods' => 'POST',
        'callback' => 'webhook_send',
        'permission_callback' => '__return_true',
    ));
});
*/



function webhook_send(WP_REST_Request $request) {

    $nombre = $request->get_param('nombre');
    $edad = $request->get_param('edad');
    $email = $request->get_param('email');

    $data = array(
		"email" => $request->get_param('email'),
		"fname" => $request->get_param('fname'),
		"lname" => $request->get_param('lname'),
		"phone" => $request->get_param('phone'),
		"project_id" => $request->get_param('project_id'),
		"input_channel_id" => $request->get_param('input_channel_id'),
		"source_id" => $request->get_param('source_id'),
		"interest_type_id" => $request->get_param('interest_type_id'),
		"document_type_id" => $request->get_param('document_type_id'),
		"document" => $request->get_param('document'),
		"utm_source" => $request->get_param('utm_source'),
		"utm_medium" => $request->get_param('utm_medium'),
		"utm_campaign" => $request->get_param('utm_campaign'),
		"utm_term" => $request->get_param('utm_term'),
		"utm_content" => $request->get_param('utm_content'),
		"client_ip_address" => $request->get_param('client_ip_address'),
		"fbc" => $request->get_param('fbc'),
		"fbp" => $request->get_param('fbp'),
    );

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://algoritmo.digital/armandoparedes/api/v1/clientecreado.php',         // 'https://algoritmo.site/armandoparedes/api/v1/clienteweb.php', // URL del webhook
        //CURLOPT_URL => 'https://webhook.site/49ea8025-fdae-49a5-af17-deba2455a690',
		    //CURLOPT_URL => 'https://hooks.zapier.com/hooks/catch/18451911/2ojijf8/', // URL del webhook
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => json_encode($data), // Convertir los datos a JSON
        CURLOPT_HTTPHEADER => array(
            'Content-Type: application/json'
        ),
    ));

    $response = curl_exec($curl);

    curl_close($curl);


    if ($response === false) {
        return new WP_REST_Response(array(
            'status' => 'error',
            'message' => 'Error al enviar datos al webhook',
            'data' => curl_error($curl)
        ), 500);
    }

    return new WP_REST_Response(array(
        'status' => 'success',
        'message' => 'Datos recibidos y enviados correctamente',
        'data' => json_decode($response, true)
    ), 200);
}


function ocultar_div_editor_contenido() {
    $pantalla_actual = get_current_screen();
    // Verificamos que la propiedad 'post_type' esté definida y que sea 'post', 'page' o 'proyectos'
    if ( isset( $pantalla_actual->post_type ) && in_array( $pantalla_actual->post_type, array( 'post', 'page', 'proyecto', 'proyecto-entregado' ) ) ) {
        echo '<style>
            #postdivrich { display: none; }
        </style>';
    }
}
add_action( 'admin_head', 'ocultar_div_editor_contenido' );





// Creac cliente, version 2

// add_action('rest_api_init', function () {
//     register_rest_route('wp/v2', "/create/clientsv2", [
//         'methods' => 'POST',
//         'callback' => function ($request) {
//             try {
//                 $response = create_clientv2($request);
//                 return wp_send_json($response);
//             } catch (\Throwable $th) {
//                 return new WP_Error('error', $th->getMessage(), ['status' => 500]);
//             }
//         },
//         'permission_callback' => '__return_true' // Mantenemos esto simple ya que la restricción está en el callback
//     ]);
// });

function create_clientv2($request){
	
	$email = $request->get_param('email');
	$fname = $request->get_param('fname');
	$lname = $request->get_param('lname');
	$phone = $request->get_param('phone');
	$project_id = $request->get_param('project_id');
	$input_channel_id = $request->get_param('input_channel_id');
	$source_id = $request->get_param('source_id');
	$interest_type_id = $request->get_param('interest_type_id');
	$document_type_id = $request->get_param('document_type_id');
	$document = $request->get_param('document');
	$utm_source = $request->get_param('utm_source');
	$utm_medium= $request->get_param('utm_medium');
	$utm_campaign = $request->get_param('utm_campaign');
	$utm_content = $request->get_param('utm_content');
	$utm_term = $request->get_param('utm_term');
	
	$client_ip_address = $request->get_param('client_ip_address');
	$client_user_agent = $request->get_param('client_user_agent');
	$fbc = $request->get_param('fbc');
	$fbp = $request->get_param('fbp');

	if (strtolower(trim($utm_source)) === 'geolocalizacion') {
		$source_id = 45;
	}
	
	$body = (object) array(
		"email" => $email,
		"fname" => $fname,
		"lname" => $lname,
		"phone" => $phone,
		"project_id" => $project_id,
		"input_channel_id" => $input_channel_id,
		"source_id" => $source_id,
		"interest_type_id" => $interest_type_id,
		"document_type_id" => $document_type_id,
		"document" => $document,
		"utm_source" => $utm_source,
		"utm_medium" => $utm_medium,
		"utm_campaign" => $utm_campaign,
		"utm_term" => $utm_term,
		"utm_content" => $utm_content,
        "extra_fields" => array(
        	"gclid" => $request->get_param('gclid')
    	)
	);
	
	$request_url = SPERANT_URL . "/clients";
	$body_json = json_encode($body);

	sperant_log('ENVIO', $body);

	try {
		$sperant_response = fetch(
			$request_url,
			[
			  'method' => 'POST',
			  'headers' => [
				"Content-Type: application/json",
				"Authorization:" . AUTHORIZATION
			  ],
			  'body' => $body_json
			]
		);

		$response_data = json_decode($sperant_response, true);
		$client_id = $response_data['data']['id'] ?? null;
		$client_status = $response_data['data']['attributes']['status'] ?? null;

		sperant_log('RESPUESTA', array(
			'client_id' => $client_id,
			'status' => $client_status,
			'body' => $response_data,
		));
	} catch (Exception $e) {
		sperant_log('ERROR', array(
			'message' => $e->getMessage(),
			'body' => $body,
		));
		throw $e;
	}
	
    $response_enviar_lead_a_meta = enviar_lead_a_meta($email, $fname, $lname, $phone, $client_ip_address, $client_user_agent, $fbc, $fbp);
	
    return $sperant_response;
    // return $response_enviar_lead_a_meta;
}

function enviar_lead_a_meta($email, $first_name, $last_name, $phone, $client_ip_address, $client_user_agent, $fbc, $fbp) {
    // --- CONFIGURACIÓN ---
    $accessToken = 'EAAClpuOZBzsEBPubwYSUwRhAgeDY5jtvGWeqmzU0KmLbFhZCO2wxsp6brkyg7auVd2vjJC7pXVJBs0pcRAwl03H1ssZBsOzh4DoRffajbl5nYKzOBg6Wpc8p3Badok6DoYO6lVWXbly6Hq6ZCisXSAOybUHliDRCZBCnZAr5U4QxQZCqtvF1rfL1jB8zCRjlpp9cQZDZD';
    $pixelId = '272056255262784';
    
    // Validación básica
    if (!$email || !is_email($email)) {
        error_log('Email inválido para envío a Meta: ' . $email);
        return false;
    }
    
    // --- PREPARACIÓN DEL EVENTO PARA META ---
    $userData = array(
        'em' => hash('sha256', strtolower($email)),
        'client_ip_address' => $client_ip_address ?: $_SERVER['REMOTE_ADDR'],
        'client_user_agent' => $client_user_agent ?: $_SERVER['HTTP_USER_AGENT']
    );
    
    // Agregar datos opcionales solo si existen
    if ($first_name) {
        $userData['fn'] = hash('sha256', strtolower($first_name));
    }
    if ($last_name) {
        $userData['ln'] = hash('sha256', strtolower($last_name));
    }
    if ($phone) {
        $userData['ph'] = hash('sha256', preg_replace('/[^0-9]/', '', $phone));
    }
    if ($fbc) {
        $userData['fbc'] = $fbc;
    }
    if ($fbp) {
        $userData['fbp'] = $fbp;
    }
    
    $eventData = array(
        'data' => array(
            array(
                'event_name' => 'Lead',
                'event_time' => time(),
                'action_source' => 'website',
                'user_data' => $userData,
                'custom_data' => array(
                    'form_source' => 'Formulario de Contacto Principal'
                )
            )
        )
    );
    
    // --- ENVÍO A LA API DE CONVERSIONES DE META ---
    $url = "https://graph.facebook.com/v18.0/{$pixelId}/events?access_token={$accessToken}";
    
    $response = wp_remote_post($url, array(
        'headers' => array('Content-Type' => 'application/json'),
        'body' => json_encode($eventData),
        'timeout' => 15,
        'blocking' => false // Envío asíncrono para no retrasar la respuesta
    ));
    
    // Log para debugging (opcional)
    if (is_wp_error($response)) {
        error_log('Error al enviar lead a Meta: ' . $response->get_error_message());
        return false;
    }
    
    return true;
}



