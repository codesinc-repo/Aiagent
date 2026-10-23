import type { Lang } from "./types";

// Deterministic safety check. This runs BEFORE the language model, so a crisis message
// always gets the same safe, human-reviewed response regardless of model behavior.

const EN = [
  /\bsuicid/i,
  /\bkill (myself|me)\b/i,
  /\bend (it all|my life)\b/i,
  /\bwant(ed)? to die\b/i,
  /\b(don'?t|do not|no longer) want to (live|be alive|be here)\b/i,
  /\bnot worth living\b/i,
  /\bbetter off (dead|without me)\b/i,
  /\bover-?dos/i,
  /\bod'?ing\b/i,
  /\b(hurt|harm|cut|cutting) myself\b/i,
  /\bself[- ]harm/i,
  /\b(not breathing|stopped breathing|unconscious|unresponsive|turning blue)\b/i,
  /\b(dying|is dying|am dying)\b/i,
  /\b(going to|gonna|will) kill (him|her|them|someone)\b/i,
];

const ES = [
  /\bsuicid/i,
  /\bmatarme\b/i,
  /\bquitarme la vida\b/i,
  /\bquiero morir(me)?\b/i,
  /\bno quiero (vivir|seguir viviendo|estar vivo|estar viva)\b/i,
  /\bno vale la pena vivir\b/i,
  /\bsobre-?dosis\b/i,
  /\b(hacerme da[nñ]o|lastimarme|cortarme)\b/i,
  /\bno respira\b/i,
  /\binconsciente\b/i,
  /\bse (est[aá]|esta) muriendo\b/i,
  /\bme voy a morir\b/i,
  /\bvoy a matar\b/i,
];

const ES_HINT = /\b(hola|ayuda|necesito|quiero|gracias|por favor|mi (hijo|hija|esposo|esposa|hermano|hermana)|estoy|tengo|puedo|cita)\b/i;

export function looksSpanish(text: string): boolean {
  return ES_HINT.test(text) || /[¿¡ñáéíóú]/i.test(text);
}

export function isCrisis(text: string): boolean {
  return EN.some((r) => r.test(text)) || ES.some((r) => r.test(text));
}

export function crisisReply(lang: Lang): string {
  if (lang === "es") {
    return (
      "Me alegra mucho que hayas escrito, y lamento que estés pasando por esto. Tu seguridad es lo primero.\n\n" +
      "Si tú o alguien más está en peligro inmediato o tiene una sobredosis, **llama al 911 ahora**. " +
      "También puedes llamar o enviar un texto al **988** (Línea de Prevención del Suicidio y Crisis, con ayuda en español), " +
      "llamar a la **Línea PAS de Puerto Rico: 1-800-981-0023**, o a la línea de SAMHSA: **1-800-662-4357**.\n\n" +
      "He avisado al equipo de RALU. Si quieres que alguien del equipo te llame, comparte un número de teléfono solo si te sientes cómodo/a."
    );
  }
  return (
    "I'm really glad you reached out, and I'm sorry you're going through this. Your safety comes first.\n\n" +
    "If you or someone else is in immediate danger or having an overdose, **call 911 now**. " +
    "You can also call or text **988** (Suicide & Crisis Lifeline, Spanish available), call the **Línea PAS in Puerto Rico: 1-800-981-0023**, " +
    "or SAMHSA's helpline: **1-800-662-4357**.\n\n" +
    "I've alerted the RALU team. If you'd like someone from the team to call you back, share a phone number only if you're comfortable."
  );
}
