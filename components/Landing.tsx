"use client";

import { useEffect, useState } from "react";
import ChatWidget, { type OpenChatDetail } from "./ChatWidget";
import Wordmark from "./Wordmark";
import { DICT } from "@/lib/i18n";
import type { Lang, Slot } from "@/lib/types";

function openChat(detail: OpenChatDetail = {}) {
  window.dispatchEvent(new CustomEvent<OpenChatDetail>("ralu:open", { detail }));
}

const ICONS: Record<string, React.ReactNode> = {
  street_outreach: (
    <svg viewBox="0 0 48 48" aria-hidden>
      <path d="M24 6c-4 0-7 3-7 7s3 7 7 7 7-3 7-7-3-7-7-7Z" />
      <path d="M10 42c0-8 6-14 14-14s14 6 14 14" />
      <path d="M24 28v14" />
    </svg>
  ),
  dropin: (
    <svg viewBox="0 0 48 48" aria-hidden>
      <rect x="6" y="10" width="36" height="24" rx="4" />
      <path d="M18 42h12M24 34v8" />
      <path d="M20 18l10 5-10 5v-10Z" />
    </svg>
  ),
  referral: (
    <svg viewBox="0 0 48 48" aria-hidden>
      <circle cx="12" cy="24" r="5" />
      <circle cx="36" cy="12" r="5" />
      <circle cx="36" cy="36" r="5" />
      <path d="M17 22l14-8M17 26l14 8" />
    </svg>
  ),
};

export default function Landing() {
  const [lang, setLang] = useState<Lang>("en");
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const t = DICT[lang];

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ralu-lang");
      if (saved === "en" || saved === "es") setLang(saved);
      else if (navigator.language?.toLowerCase().startsWith("es")) setLang("es");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem("ralu-lang", lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  useEffect(() => {
    let alive = true;
    fetch("/api/slots")
      .then((r) => r.json())
      .then((d: { slots: Slot[] }) => alive && setSlots(d.slots))
      .catch(() => alive && setSlots([]));
    return () => {
      alive = false;
    };
  }, []);

  const pickHeroSlot = (s: Slot) => {
    const label = lang === "es" ? s.labelEs : s.labelEn;
    const q = DICT[lang].chat.iPick;
    openChat({ text: `${q} ${label}`, apiText: `${q} ${label} (slot_id: ${s.id})` });
  };

  const serviceCta = (key: string) => {
    const prompts: Record<string, { en: string; es: string }> = {
      street_outreach: { en: "I'd like to request street outreach.", es: "Quisiera pedir alcance en la calle." },
      dropin: { en: "I'd like to book a Virtual Drop-In.", es: "Quisiera reservar una cita en el Centro Virtual." },
      referral: { en: "I'd like a community referral.", es: "Quisiera un referido comunitario." },
    };
    openChat({ text: prompts[key][lang] });
  };

  return (
    <>
      <header className="nav">
        <div className="wrap nav__inner">
          <a href="#top" className="nav__brand" aria-label="RALU">
            <Wordmark small />
          </a>
          <nav className="nav__links" aria-label="Main">
            <a href="#services">{t.nav.services}</a>
            <a href="#how">{t.nav.how}</a>
            <a href="#help">{t.nav.help}</a>
          </nav>
          <div className="nav__right">
            <div className="lang" role="group" aria-label="Language">
              <button className={lang === "en" ? "is-on" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>
                EN
              </button>
              <button className={lang === "es" ? "is-on" : ""} onClick={() => setLang("es")} aria-pressed={lang === "es"}>
                ES
              </button>
            </div>
            <button className="btn btn--blue nav__cta" onClick={() => openChat()}>
              {t.nav.cta}
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero__bg" aria-hidden />
          <div className="wrap hero__grid">
            <div className="hero__copy">
              <p className="kicker">{t.hero.kicker}</p>
              <h1 className="hero__title">
                <span>{t.hero.line1}</span>
                <span className="hero__title-blue">{t.hero.line2}</span>
              </h1>
              <p className="hero__sub">{t.hero.sub}</p>
              <div className="hero__actions">
                <button
                  className="btn btn--blue btn--lg"
                  onClick={() => openChat({ text: lang === "es" ? "Quisiera reservar una cita." : "I'd like to book a drop-in." })}
                >
                  {t.hero.primary}
                </button>
                <button className="btn btn--outline btn--lg" onClick={() => openChat()}>
                  {t.hero.secondary}
                </button>
              </div>
            </div>

            <aside className="next" aria-label={t.hero.nextTitle}>
              <div className="next__head">
                <span className="next__pulse" aria-hidden />
                <div>
                  <h2>{t.hero.nextTitle}</h2>
                  <p>{t.hero.nextSub}</p>
                </div>
              </div>
              <div className="next__list">
                {slots === null && <p className="next__loading">{t.hero.loading}</p>}
                {slots?.map((s) => (
                  <button key={s.id} className="next__slot" onClick={() => pickHeroSlot(s)}>
                    <span>{lang === "es" ? s.labelEs : s.labelEn}</span>
                    <span aria-hidden>→</span>
                  </button>
                ))}
              </div>
              <p className="next__cta">{t.hero.nextCta}</p>
            </aside>
          </div>
        </section>

        <section className="strip" aria-label="Emergency">
          <div className="wrap strip__inner">
            <strong>{t.crisis.text}</strong>
            <span>{t.crisis.call}</span>
            <a className="strip__btn" href="tel:911">
              911
            </a>
            <a className="strip__btn" href="tel:988">
              988
            </a>
          </div>
        </section>

        <section id="services" className="section">
          <div className="wrap">
            <h2 className="section__title">{t.services.title}</h2>
            <p className="section__sub">{t.services.sub}</p>
            <div className="cards">
              {t.services.items.map((s) => (
                <article className="svc" key={s.key}>
                  <div className="svc__icon">{ICONS[s.key]}</div>
                  <h3>{s.name}</h3>
                  <p>{s.body}</p>
                  <button className="btn btn--outline-dark" onClick={() => serviceCta(s.key)}>
                    {s.cta} →
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="band" aria-label="Message">
          <div className="wrap">
            <blockquote>
              <p>{t.message.quote}</p>
              <cite>{t.message.by}</cite>
            </blockquote>
          </div>
        </section>

        <section id="how" className="section section--light">
          <div className="wrap">
            <h2 className="section__title section__title--dark">{t.how.title}</h2>
            <ol className="steps">
              {t.how.steps.map((s, i) => (
                <li key={s.title}>
                  <span className="steps__n">{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="help" className="section">
          <div className="wrap">
            <h2 className="section__title">{t.help.title}</h2>
            <p className="section__sub">{t.help.sub}</p>
            <div className="cards">
              {t.help.cards.map((c) => (
                <button className="door" key={c.title} onClick={() => openChat({ text: c.prompt })}>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                  <span>{c.cta} →</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer__inner">
          <Wordmark small />
          <div>
            <p>{t.footer.ai}</p>
            <p className="footer__demo">{t.footer.demo}</p>
          </div>
        </div>
      </footer>

      <ChatWidget lang={lang} />
    </>
  );
}
