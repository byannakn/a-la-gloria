/* ============================================
   A LA GLORIA — comportamiento compartido
   Menú móvil + burbuja de WhatsApp + música
   ============================================ */

(function () {
  /* ---- Menú móvil ---- */
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  /* ---- Música ----
     El modal solo aparece una vez por sesión de navegación
     (sessionStorage se borra al cerrar la pestaña/navegador).
     Para agregar la pista real, coloca el archivo en
     assets/audio/ y actualiza el <source> del <audio id="bg-audio">
     en el HTML de cada página. */
  const modal = document.getElementById("music-modal");
  const audio = document.getElementById("bg-audio");
  const floatMusicBtn = document.getElementById("float-music");

  function setMusicState(on) {
    sessionStorage.setItem("algloria-music", on ? "on" : "off");
    if (audio) {
      if (on) {
        audio.play().catch(() => {
          /* el navegador puede bloquear si no hubo interacción; se ignora */
        });
      } else {
        audio.pause();
      }
    }
    if (floatMusicBtn) {
      floatMusicBtn.setAttribute("aria-pressed", String(on));
      floatMusicBtn.textContent = on ? "🔊" : "🔇";
    }
  }

  const storedChoice = sessionStorage.getItem("algloria-music");
  if (storedChoice === null) {
    if (modal) modal.hidden = false;
  } else {
    if (modal) modal.hidden = true;
    setMusicState(storedChoice === "on");
  }

  document.querySelectorAll("[data-music-choice]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setMusicState(btn.getAttribute("data-music-choice") === "on");
      if (modal) modal.hidden = true;
    });
  });

  if (floatMusicBtn) {
    floatMusicBtn.addEventListener("click", () => {
      const isOn = sessionStorage.getItem("algloria-music") === "on";
      setMusicState(!isOn);
    });
  }
})();

/* ============================================
   Pestañas accesibles (usadas en Sabores)
   Soporta flechas de teclado y enlaces directos
   tipo sabores.html#huellitas para abrir esa
   pestaña automáticamente.
   ============================================ */
(function () {
  function initTabs() {
    document.querySelectorAll("[data-tabs]").forEach((group) => {
      const tabs = Array.from(group.querySelectorAll('[role="tab"]'));
      const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));

      function activate(index, focus) {
        tabs.forEach((t, i) => {
          const selected = i === index;
          t.setAttribute("aria-selected", String(selected));
          t.tabIndex = selected ? 0 : -1;
          if (panels[i]) panels[i].hidden = !selected;
        });
        if (focus) tabs[index].focus();
      }

      const hash = window.location.hash.replace("#", "");
      let startIndex = tabs.findIndex((t) => t.getAttribute("aria-controls") === "panel-" + hash);
      if (startIndex === -1) startIndex = 0;
      activate(startIndex, false);

      tabs.forEach((tab, i) => {
        tab.addEventListener("click", () => activate(i, false));
        tab.addEventListener("keydown", (e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); activate((i + 1) % tabs.length, true); }
          if (e.key === "ArrowLeft") { e.preventDefault(); activate((i - 1 + tabs.length) % tabs.length, true); }
          if (e.key === "Home") { e.preventDefault(); activate(0, true); }
          if (e.key === "End") { e.preventDefault(); activate(tabs.length - 1, true); }
        });
      });
    });
  }
  document.addEventListener("DOMContentLoaded", initTabs);
})();
