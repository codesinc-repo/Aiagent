import type { Lang } from "./types";

type Dict = {
  nav: { services: string; how: string; help: string; cta: string };
  hero: {
    kicker: string;
    line1: string;
    line2: string;
    sub: string;
    primary: string;
    secondary: string;
    nextTitle: string;
    nextSub: string;
    nextCta: string;
    loading: string;
  };
  crisis: { text: string; call: string };
  services: {
    title: string;
    sub: string;
    items: { key: string; name: string; body: string; cta: string }[];
  };
  how: { title: string; steps: { title: string; body: string }[] };
  message: { quote: string; by: string };
  help: {
    title: string;
    sub: string;
    cards: { title: string; body: string; cta: string; prompt: string }[];
  };
  footer: { demo: string; ai: string; rights: string };
  chat: {
    name: string;
    status: string;
    greeting: string;
    chips: { label: string; prompt: string }[];
    placeholder: string;
    send: string;
    close: string;
    open: string;
    thinking: string;
    errMissingKey: string;
    errBusy: string;
    errGeneric: string;
    slotsTitle: string;
    bookedTitle: string;
    bookedBody: string;
    addCal: string;
    loggedTitle: string;
    loggedBody: string;
    crisisTitle: string;
    crisisCall911: string;
    crisisCall988: string;
    iPick: string;
  };
};

export const DICT: Record<Lang, Dict> = {
  en: {
    nav: { services: "Services", how: "How it works", help: "Get help", cta: "Talk to RALU Guide" },
    hero: {
      kicker: "Street Outreach · Virtual Drop-In Center · Community Referral Services",
      line1: "There's a way out.",
      line2: "And His way is Jesus.",
      sub: "If you or someone you love is struggling with addiction, you don't have to figure it out alone. Talk with our guide, pick a time, and meet our team.",
      primary: "Book a Drop-In",
      secondary: "Ask RALU Guide",
      nextTitle: "Next available Virtual Drop-In",
      nextSub: "Puerto Rico time (AST)",
      nextCta: "Tap a time to start",
      loading: "Checking the calendar…",
    },
    crisis: {
      text: "In crisis or an emergency?",
      call: "Call 911 · Call or text 988 (Spanish available)",
    },
    services: {
      title: "Three ways we walk with you",
      sub: "Start wherever you are. We'll help you find the next step.",
      items: [
        {
          key: "street_outreach",
          name: "Street Outreach",
          body: "Our team meets people where they are, on the street, with care and a way forward.",
          cta: "Request outreach",
        },
        {
          key: "dropin",
          name: "Virtual Drop-In Center",
          body: "Talk with the RALU team online. Choose a time that works and we'll be there.",
          cta: "Book a drop-in",
        },
        {
          key: "referral",
          name: "Community Referral Services",
          body: "We connect people and families with community resources and the right next steps.",
          cta: "Ask for a referral",
        },
      ],
    },
    how: {
      title: "How it works",
      steps: [
        { title: "Say hello", body: "Chat with RALU Guide any time, in English or Spanish. Share only what you're comfortable with." },
        { title: "Pick a time", body: "Choose from open times shown in Puerto Rico time. You get a confirmation right away." },
        { title: "Meet the team", body: "Join your Virtual Drop-In. A real person from RALU is there for you." },
      ],
    },
    message: {
      quote: "Anybody that's addicted to drugs, there's a way out, and His way is Jesus.",
      by: "Recognize & Level Up",
    },
    help: {
      title: "Where would you like to start?",
      sub: "Pick the one that fits. There's no wrong door.",
      cards: [
        {
          title: "I need help",
          body: "For yourself. Private, respectful, no judgment.",
          cta: "Start here",
          prompt: "I'm reaching out for myself.",
        },
        {
          title: "Someone I love needs help",
          body: "For a family member or friend.",
          cta: "Start here",
          prompt: "I'm reaching out for someone I love.",
        },
        {
          title: "I want to support RALU",
          body: "Volunteer, partner or give.",
          cta: "Start here",
          prompt: "I'd like to support the ministry.",
        },
      ],
    },
    footer: {
      demo: "Demo build prepared for Bishop Luis Melendez.",
      ai: "RALU Guide is an AI assistant. It does not give medical advice. In an emergency call 911 or 988.",
      rights: "Recognize & Level Up",
    },
    chat: {
      name: "RALU Guide",
      status: "AI assistant · English / Español",
      greeting:
        "Hi, I'm RALU Guide. I'm here to help you take a next step. Are you reaching out for yourself, for someone you love, or to support the ministry?",
      chips: [
        { label: "For myself", prompt: "I'm reaching out for myself." },
        { label: "For someone I love", prompt: "I'm reaching out for someone I love." },
        { label: "Support the ministry", prompt: "I'd like to support the ministry." },
        { label: "Español", prompt: "Hola, necesito ayuda." },
      ],
      placeholder: "Type a message…",
      send: "Send",
      close: "Close chat",
      open: "Talk to RALU Guide",
      thinking: "Typing",
      errMissingKey: "The assistant isn't connected yet (API key missing). Please call or message the team.",
      errBusy: "I'm a little busy right now. Please try again in a moment.",
      errGeneric: "Something went wrong. Please try again. If it's urgent, call 911 or 988.",
      slotsTitle: "Pick a time (Puerto Rico time)",
      bookedTitle: "You're booked",
      bookedBody: "The RALU team will meet you then.",
      addCal: "Add to calendar",
      loggedTitle: "Request received",
      loggedBody: "The RALU team will follow up.",
      crisisTitle: "Help is available right now",
      crisisCall911: "Call 911",
      crisisCall988: "Call 988",
      iPick: "I'd like",
    },
  },
  es: {
    nav: { services: "Servicios", how: "Cómo funciona", help: "Pedir ayuda", cta: "Hablar con RALU Guide" },
    hero: {
      kicker: "Alcance en la calle · Centro virtual de apoyo · Servicios de referido comunitario",
      line1: "Hay una salida.",
      line2: "Y Su camino es Jesús.",
      sub: "Si tú o alguien que amas lucha con la adicción, no tienes que enfrentarlo solo. Habla con nuestra guía, elige una hora y conoce a nuestro equipo.",
      primary: "Reservar una cita",
      secondary: "Preguntar a RALU Guide",
      nextTitle: "Próximas citas del Centro Virtual",
      nextSub: "Hora de Puerto Rico (AST)",
      nextCta: "Toca una hora para empezar",
      loading: "Revisando el calendario…",
    },
    crisis: {
      text: "¿En crisis o emergencia?",
      call: "Llama al 911 · Llama o envía texto al 988 (ayuda en español)",
    },
    services: {
      title: "Tres formas de caminar contigo",
      sub: "Empieza donde estés. Te ayudamos a encontrar el próximo paso.",
      items: [
        {
          key: "street_outreach",
          name: "Alcance en la calle",
          body: "Nuestro equipo encuentra a las personas donde están, en la calle, con cuidado y una salida.",
          cta: "Pedir alcance",
        },
        {
          key: "dropin",
          name: "Centro Virtual de Apoyo",
          body: "Habla con el equipo de RALU en línea. Elige una hora que te sirva y allí estaremos.",
          cta: "Reservar cita",
        },
        {
          key: "referral",
          name: "Referidos comunitarios",
          body: "Conectamos a personas y familias con recursos de la comunidad y el próximo paso correcto.",
          cta: "Pedir un referido",
        },
      ],
    },
    how: {
      title: "Cómo funciona",
      steps: [
        { title: "Saluda", body: "Escribe a RALU Guide cuando quieras, en español o inglés. Comparte solo lo que te sientas cómodo/a." },
        { title: "Elige una hora", body: "Escoge entre las horas disponibles, en hora de Puerto Rico. Recibes confirmación al instante." },
        { title: "Conoce al equipo", body: "Entra a tu cita virtual. Una persona real de RALU te acompaña." },
      ],
    },
    message: {
      quote: "Cualquiera que esté adicto a las drogas, hay una salida, y Su camino es Jesús.",
      by: "Recognize & Level Up",
    },
    help: {
      title: "¿Por dónde quieres empezar?",
      sub: "Elige la que mejor encaje. No hay puerta equivocada.",
      cards: [
        {
          title: "Necesito ayuda",
          body: "Para ti. Privado, respetuoso, sin juicio.",
          cta: "Empezar",
          prompt: "Estoy buscando ayuda para mí.",
        },
        {
          title: "Alguien que amo necesita ayuda",
          body: "Para un familiar o amigo.",
          cta: "Empezar",
          prompt: "Estoy buscando ayuda para alguien que amo.",
        },
        {
          title: "Quiero apoyar a RALU",
          body: "Ser voluntario, aliarte o donar.",
          cta: "Empezar",
          prompt: "Quiero apoyar al ministerio.",
        },
      ],
    },
    footer: {
      demo: "Versión de demostración preparada para el Obispo Luis Meléndez.",
      ai: "RALU Guide es un asistente de IA. No da consejo médico. En una emergencia llama al 911 o al 988.",
      rights: "Recognize & Level Up",
    },
    chat: {
      name: "RALU Guide",
      status: "Asistente de IA · English / Español",
      greeting:
        "Hola, soy RALU Guide. Estoy aquí para ayudarte a dar un próximo paso. ¿Buscas ayuda para ti, para alguien que amas, o quieres apoyar al ministerio?",
      chips: [
        { label: "Para mí", prompt: "Estoy buscando ayuda para mí." },
        { label: "Para alguien que amo", prompt: "Estoy buscando ayuda para alguien que amo." },
        { label: "Apoyar al ministerio", prompt: "Quiero apoyar al ministerio." },
        { label: "English", prompt: "Hi, I need help." },
      ],
      placeholder: "Escribe un mensaje…",
      send: "Enviar",
      close: "Cerrar chat",
      open: "Hablar con RALU Guide",
      thinking: "Escribiendo",
      errMissingKey: "El asistente aún no está conectado (falta la clave de API). Llama o escribe al equipo.",
      errBusy: "Estoy un poco ocupado ahora. Intenta de nuevo en un momento.",
      errGeneric: "Algo salió mal. Intenta de nuevo. Si es urgente, llama al 911 o al 988.",
      slotsTitle: "Elige una hora (hora de Puerto Rico)",
      bookedTitle: "Tu cita está reservada",
      bookedBody: "El equipo de RALU te atenderá a esa hora.",
      addCal: "Añadir al calendario",
      loggedTitle: "Solicitud recibida",
      loggedBody: "El equipo de RALU te contactará.",
      crisisTitle: "Hay ayuda disponible ahora mismo",
      crisisCall911: "Llamar al 911",
      crisisCall988: "Llamar al 988",
      iPick: "Quisiera",
    },
  },
};
