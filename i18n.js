/* ============================================
   A LA GLORIA — motor de idioma ES/EN
   ============================================
   Cómo usarlo en una página nueva:
   1. Antes de cargar este archivo, define (opcional):
        window.PAGE_I18N = { es:{ clave:"texto" }, en:{ clave:"text" } };
   2. En el HTML, marca los textos con:
        data-i18n="clave"        -> reemplaza el texto
        data-i18n-html="clave"   -> reemplaza el HTML interno
        data-i18n-attr="alt:clave; title:otraClave" -> reemplaza atributos
   3. Agrega un botón <button class="lang-toggle"></button> donde
      quieras que aparezca el cambio de idioma (normalmente en el nav).
   ============================================ */

(function () {
  const COMMON = {
    es: {
      nav_sabores: "Sabores",
      nav_fechas: "¿Dónde estámos?",
      nav_conocenos: "Conócenos",
      footer_rights: "Hecho con cariño, un bazar a la vez.",
      aria_whatsapp: "Escríbenos por WhatsApp",
      aria_music: "Activar o pausar la música",
      music_modal_title: "¿Con música o sin música?",
      music_modal_text: "Tenemos canciones propias para acompañar tu visita. Tú decides.",
      music_yes: "Con música 🎵",
      music_no: "Sin música",
    },
    en: {
      nav_sabores: "Flavors",
      nav_fechas: "Where are we?",
      nav_conocenos: "About us",
      footer_rights: "Made with love, one bazaar at a time.",
      aria_whatsapp: "Message us on WhatsApp",
      aria_music: "Turn music on or off",
      music_modal_title: "With music or without?",
      music_modal_text: "We have our own songs to go along with your visit. You choose.",
      music_yes: "With music 🎵",
      music_no: "Without music",
    },
  };

  function getLang() {
    return localStorage.getItem("algloria-lang") || "es";
  }

  function setLang(lang) {
    localStorage.setItem("algloria-lang", lang);
    applyLang(lang);
  }

  function applyLang(lang) {
    const pageDict = (window.PAGE_I18N && window.PAGE_I18N[lang]) || {};
    const dict = Object.assign({}, COMMON[lang] || {}, pageDict);

    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      el.getAttribute("data-i18n-attr")
        .split(";")
        .map((pair) => pair.trim())
        .filter(Boolean)
        .forEach((pair) => {
          const [attr, key] = pair.split(":").map((s) => s.trim());
          if (dict[key] !== undefined) el.setAttribute(attr, dict[key]);
        });
    });

    document.querySelectorAll(".lang-toggle").forEach((btn) => {
      btn.textContent = lang === "es" ? "EN" : "ES";
      btn.setAttribute(
        "aria-label",
        lang === "es" ? "Switch to English" : "Cambiar a español"
      );
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyLang(getLang());
    document.querySelectorAll(".lang-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        setLang(getLang() === "es" ? "en" : "es");
      });
    });
  });

  window.AlGloriaI18n = { getLang, setLang, applyLang };
})();
