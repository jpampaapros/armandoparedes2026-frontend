/* La intro del home (telón + texto animado) se ejecuta al entrar al sitio. Para no
   repetirla mientras el usuario navega, se guarda CUÁNDO se ejecutó en
   sessionStorage: la ventana dura 5 minutos y vive en la pestaña, así que al
   cerrarla y volver a abrir el sitio la intro se muestra otra vez. */

export const HOME_INTRO_STORAGE_KEY = "home-intro-seen-at";

/** Ventana en la que volver al home (en la misma pestaña) no repite la intro. */
export const HOME_INTRO_TTL_MS = 5 * 60 * 1000;

/* Atributo en <html> que marca "esta visita al home salta la intro". Lo pone el
   script del <head> antes del primer pintado (sin parpadeo del texto) y luego el
   Banner al montar, que es quien decide. */
export const HOME_INTRO_SKIP_ATTRIBUTE = "data-home-intro-seen";

function readHomeIntroSeenAt() {
  try {
    const seenAt = Number(window.sessionStorage.getItem(HOME_INTRO_STORAGE_KEY));
    return seenAt > 0 ? seenAt : null;
  } catch {
    return null;
  }
}

/** true si la intro ya se ejecutó en esta pestaña hace menos de HOME_INTRO_TTL_MS. */
export function hasSeenHomeIntroRecently() {
  const seenAt = readHomeIntroSeenAt();
  return seenAt !== null && Date.now() - seenAt < HOME_INTRO_TTL_MS;
}

export function markHomeIntroSeen() {
  try {
    window.sessionStorage.setItem(HOME_INTRO_STORAGE_KEY, String(Date.now()));
  } catch {
    // Sin almacenamiento la intro simplemente se vuelve a mostrar.
  }
}

export const homeIntroSkipScript = `try{var t=Number(sessionStorage.getItem("${HOME_INTRO_STORAGE_KEY}"));if(t>0&&Date.now()-t<${HOME_INTRO_TTL_MS})document.documentElement.setAttribute("${HOME_INTRO_SKIP_ATTRIBUTE}","")}catch(e){}`;
