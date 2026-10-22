/* La intro del home (telón + texto animado) se muestra una vez al día. La cookie
   vence a la medianoche local, así que su sola existencia indica "ya se vio hoy". */

export const HOME_INTRO_COOKIE = "home-intro-seen";

/* Atributo en <html> que marca "esta visita al home salta la intro". Lo pone el
   script del <head> antes del primer pintado (sin parpadeo del texto) y luego el
   Banner al montar, que es quien decide. */
export const HOME_INTRO_SKIP_ATTRIBUTE = "data-home-intro-seen";

export function hasSeenHomeIntroToday() {
  try {
    return document.cookie.split("; ").some((cookie) => cookie.startsWith(`${HOME_INTRO_COOKIE}=`));
  } catch {
    return false;
  }
}

export function markHomeIntroSeen() {
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  try {
    document.cookie = `${HOME_INTRO_COOKIE}=1; expires=${midnight.toUTCString()}; path=/; SameSite=Lax`;
  } catch {
    // Sin cookies la intro simplemente se vuelve a mostrar.
  }
}

export const homeIntroSkipScript = `try{if(document.cookie.split("; ").some(function(c){return c.indexOf("${HOME_INTRO_COOKIE}=")===0}))document.documentElement.setAttribute("${HOME_INTRO_SKIP_ATTRIBUTE}","")}catch(e){}`;
