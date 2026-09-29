# API de Revalidación - Documentación

## Descripción General

El endpoint `/api/revalidate` es un endpoint POST que permite revalidar el caché ISR (Incremental Static Regeneration) del sitio. Se utiliza para invalidar páginas en caché cuando el contenido en WordPress es actualizado.

## Endpoint

```
POST /api/revalidate
```

## Autenticación

El endpoint requiere un token de autenticación Bearer en el header `Authorization`:

```
Authorization: Bearer <REVALIDATE_SECRET>
```

Donde `<REVALIDATE_SECRET>` es la variable de entorno configurada en el servidor.

## Request Body

El body debe ser un JSON con la siguiente estructura:

```json
{
  "paths": ["/ruta/1", "/ruta/2", "/ruta/3"]
}
```

### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `paths` | `string[]` | No | Array de rutas a revalidar. Máximo 10 rutas por request. |

### Rutas Permitidas

Solo se pueden revalidar las siguientes rutas:

- `/` - Página de inicio
- `/armando` - Página de Armando
- `/proyectos/:slug` - Páginas de proyectos individuales (ej: `/proyectos/mi-proyecto`)
- `/blog/:slug` - Páginas de blog (ej: `/blog/mi-articulo`)

## Validaciones

El servidor realiza las siguientes validaciones:

1. **Autenticación**: La solicitud debe incluir el Bearer token correcto
2. **Tamaño de payload**: Máximo 16KB
3. **Número de rutas**: Máximo 10 rutas por request
4. **Rutas permitidas**: Solo se acepta revalidar rutas en la lista permitida
5. **Formato JSON**: El body debe ser JSON válido

## Response

### Success (200 OK)

```json
{
  "revalidated": true,
  "tags": ["wordpress-content", "wordpress-header", "wordpress-footer"],
  "paths": ["/", "/proyectos/mi-proyecto"]
}
```

### Errores

#### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```
**Causa**: Bearer token inválido o faltante.

#### 400 Bad Request
```json
{
  "message": "Invalid JSON body"
}
```
**Causa**: El JSON del body es inválido.

```json
{
  "message": "Requested paths are not allowed"
}
```
**Causa**: Una o más rutas no están en la lista permitida o se excedió el máximo de 10 rutas.

#### 413 Payload Too Large
```json
{
  "message": "Payload too large"
}
```
**Causa**: El payload excede los 16KB.

## Ejemplos

### Ejemplo 1: Revalidar la página de inicio

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer tu_secret_token" \
  -H "Content-Type: application/json" \
  -d '{
    "paths": ["/"]
  }'
```

**Response:**
```json
{
  "revalidated": true,
  "tags": ["wordpress-content", "wordpress-header", "wordpress-footer"],
  "paths": ["/"]
}
```

### Ejemplo 2: Revalidar múltiples rutas

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer tu_secret_token" \
  -H "Content-Type: application/json" \
  -d '{
    "paths": [
      "/",
      "/proyectos/proyecto-a",
      "/blog/articulo-1"
    ]
  }'
```

**Response:**
```json
{
  "revalidated": true,
  "tags": ["wordpress-content", "wordpress-header", "wordpress-footer"],
  "paths": ["/", "/proyectos/proyecto-a", "/blog/articulo-1"]
}
```

### Ejemplo 3: Sin especificar paths (revalida todos los tags)

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer tu_secret_token" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response:**
```json
{
  "revalidated": true,
  "tags": ["wordpress-content", "wordpress-header", "wordpress-footer"],
  "paths": []
}
```

## Casos de Uso

### Webhook desde WordPress

Cuando el contenido en WordPress es actualizado, se puede enviar una solicitud a este endpoint para revalidar el caché:

```javascript
// En WordPress (via plugin o hook)
async function revalidateSite() {
  const response = await fetch('https://tu-dominio.com/api/revalidate', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + process.env.REVALIDATE_SECRET,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      paths: ['/']
    })
  });
  
  const data = await response.json();
  console.log('Revalidated:', data);
}
```

### Revalidación selectiva por proyecto

Cuando se actualiza un proyecto específico en WordPress:

```javascript
async function revalidateProject(projectSlug) {
  const response = await fetch('https://tu-dominio.com/api/revalidate', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + process.env.REVALIDATE_SECRET,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      paths: [`/proyectos/${projectSlug}`]
    })
  });
  
  return response.json();
}
```

## Tags de Caché

El endpoint revalida automáticamente los siguientes tags:

- `wordpress-content` - Contenido general de WordPress
- `wordpress-header` - Header del sitio
- `wordpress-footer` - Footer del sitio

Estos tags se revalidan sin importar si se especifican paths o no.

## Consideraciones de Seguridad

1. **Secret Token**: Asegúrate de que `REVALIDATE_SECRET` sea fuerte y única
2. **HTTPS**: Usa HTTPS en producción para evitar exposición del token
3. **Límites de Rate**: Considera implementar rate limiting en tu servidor
4. **Validación**: El servidor valida automáticamente las rutas permitidas
5. **Payload Size**: Hay un límite de 16KB para proteger contra ataques DoS

## Integración con WordPress

Para usar este endpoint desde WordPress, puedes crear un plugin que envíe un webhook cuando el contenido es actualizado:

```php
<?php
/**
 * Plugin Name: Next.js Revalidation Webhook
 */

add_action('post_updated', 'trigger_nextjs_revalidation');

function trigger_nextjs_revalidation($post_id) {
  $post = get_post($post_id);
  
  if (!$post || $post->post_status !== 'publish') {
    return;
  }

  $paths = [];
  
  if ($post->post_type === 'page') {
    if ($post->post_name === 'inicio') {
      $paths[] = '/';
    } elseif ($post->post_name === 'armando') {
      $paths[] = '/armando';
    }
  } elseif ($post->post_type === 'proyectos') {
    $paths[] = '/proyectos/' . $post->post_name;
  } elseif ($post->post_type === 'post') {
    $paths[] = '/blog/' . $post->post_name;
  }

  if (empty($paths)) {
    return;
  }

  $response = wp_remote_post(
    get_option('nextjs_revalidate_url') . '/api/revalidate',
    [
      'headers' => [
        'Authorization' => 'Bearer ' . get_option('nextjs_revalidate_secret'),
        'Content-Type' => 'application/json'
      ],
      'body' => wp_json_encode(['paths' => $paths]),
      'timeout' => 10
    ]
  );

  if (is_wp_error($response)) {
    error_log('Revalidation failed: ' . $response->get_error_message());
  }
}
?>
```

## Environment Variables

Asegúrate de configurar la siguiente variable de entorno:

```bash
REVALIDATE_SECRET=tu_secret_token_seguro
```

Esta variable debe ser fuerte y única. Se recomienda usar una cadena aleatoria de al menos 32 caracteres.
