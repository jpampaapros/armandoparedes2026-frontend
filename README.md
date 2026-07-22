# armando-paredes-frontend

Frontend Next.js (App Router) del sitio público de Armando Paredes. Consume WordPress como CMS headless por REST del lado servidor y se revalida por ISR.

## Contexto

Se ejecuta dentro del stack Docker del repo `armando-paredes` (server): se clona en `./frontend` y su `compose.yaml` lo construye (prod) o lo monta con hot reload (dev, `compose.dev.yaml`). No está pensado para correr suelto fuera de ese stack.

## Variables de entorno

| Var | Uso |
|---|---|
| `WORDPRESS_API_URL` | Base REST de WordPress, solo lado servidor (p. ej. `http://litespeed`) |
| `NEXT_PUBLIC_CMS_URL` | URL pública del CMS para assets/enlaces |
| `NEXT_PUBLIC_SITE_URL` | URL pública del propio frontend |
| `REVALIDATE_SECRET` | Bearer que valida `POST /api/revalidate` |

Las define el `.env` del repo server; ver su `.env.example`.

## Revalidación (ISR)

El plugin `wp-next-headless` (repo server) hace `POST` a `/api/revalidate` con `Authorization: Bearer $REVALIDATE_SECRET`; el route handler invalida los paths/tags afectados.
