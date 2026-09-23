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
