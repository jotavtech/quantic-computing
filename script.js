// ============================================================================
// script.js — boot sequence, renderização do log, efeitos de scroll e a
// armadilha final. Todo o texto/narrativa vem de content.js (CONTENT).
// ============================================================================

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $boot = document.getElementById("boot");
  const $log = document.getElementById("log");
  const $terminal = document.getElementById("terminal");
  const $finalZone = document.getElementById("final-zone");
  const $btn = document.getElementById("final-btn");
  const $btnLabel = document.getElementById("btn-label");

  let fired = false; // true depois do clique no botão final

  // P2 (caminho aberto): ?v=OUTRO_ID troca o vídeo-alvo (mesma plataforma) sem editar código
  const qsVideo = new URLSearchParams(location.search).get("v") || "";
  const videoId = /^[A-Za-z0-9_-]{6,24}$/.test(qsVideo) ? qsVideo : CONTENT.video.id;
  const videoPlatform = CONTENT.video.platform;

  function embedUrl(platform, id) {
    if (platform === "tiktok") {
      return (
        "https://www.tiktok.com/player/v1/" +
        id +
        "?autoplay=1&loop=1&controls=0&progress_bar=0&play_button=0" +
        "&volume_control=0&fullscreen_button=0&timestamp=0" +
        "&music_info=0&description=0&rel=0&closed_caption=0&native_context_menu=0"
      );
    }
    return (
      "https://www.youtube.com/embed/" +
      id +
      "?autoplay=1&playsinline=1&rel=0&modestbranding=1"
    );
  }

  // ---------- helpers de renderização ----------

  function makeLine(entry) {
    if (entry.t === "pre") {
      const pre = document.createElement("pre");
      pre.className = "pre";
      pre.textContent = entry.s;
      return pre;
    }
    if (entry.t === "hr") {
      const div = document.createElement("div");
      div.className = "hr";
      return div;
    }
    const div = document.createElement("div");
    div.className = "line " + (entry.t || "out");
    if (entry.t === "blank") return div;
    if (entry.t === "cmd") {
      const prompt = document.createElement("span");
      prompt.className = "prompt";
      prompt.textContent = "user@qlab:~$";
      div.appendChild(prompt);
      div.appendChild(document.createTextNode(" " + entry.s));
      return div;
    }
    div.textContent = entry.s;
    return div;
  }

  function renderLog() {
    const frag = document.createDocumentFragment();
    CONTENT.log.forEach((entry) => frag.appendChild(makeLine(entry)));
    $log.appendChild(frag);
    renderFinalZone();
  }

  function renderFinalZone() {
    document.getElementById("seal-top").textContent = CONTENT.finalZone.sealTop;
    const $sealLines = document.getElementById("seal-lines");
    CONTENT.finalZone.sealLines.forEach((s) => {
      const div = document.createElement("div");
      div.className = "seal-line";
      div.textContent = s;
      $sealLines.appendChild(div);
    });
    $btnLabel.textContent = CONTENT.finalZone.buttonLabels[0];
    document.getElementById("microcopy").textContent = CONTENT.finalZone.microcopy;
    $finalZone.hidden = false;
    startLabelGlitch();
    setupScrollShake();
  }

  // ---------- boot sequence ----------

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function bootLine(text) {
    const div = document.createElement("div");
    div.className = "line " + (text.startsWith("[ OK ]") ? "out" : "dim");
    div.textContent = text;
    return div;
  }

  async function runBoot() {
    if (reduceMotion) {
      // sem animação: tudo aparece de uma vez
      CONTENT.boot.lines.forEach((s) => $boot.appendChild(bootLine(s)));
      const cmd = makeLine({ t: "cmd", s: CONTENT.boot.command });
      $boot.appendChild(cmd);
      renderLog();
      return;
    }

    for (const s of CONTENT.boot.lines) {
      $boot.appendChild(bootLine(s));
      await sleep(90 + Math.random() * 160);
    }

    // digita o comando `cat ...` com cursor piscando
    const div = document.createElement("div");
    div.className = "line cmd";
    const prompt = document.createElement("span");
    prompt.className = "prompt";
    prompt.textContent = "user@qlab:~$";
    const typed = document.createElement("span");
    const cursor = document.createElement("span");
    cursor.className = "cursor";
    cursor.textContent = "▊";
    div.appendChild(prompt);
    div.appendChild(document.createTextNode(" "));
    div.appendChild(typed);
    div.appendChild(cursor);
    $boot.appendChild(div);

    await sleep(420);
    for (const ch of CONTENT.boot.command) {
      typed.textContent += ch;
      await sleep(28 + Math.random() * 46);
    }
    await sleep(320);
    cursor.remove();
    renderLog();
  }

  // ---------- shake crescente conforme o scroll se aproxima do fim ----------

  function setupScrollShake() {
    if (reduceMotion) return;

    let intensity = 0;
    let rafId = null;

    function tick() {
      rafId = null;
      if (fired || intensity <= 0.02) {
        $terminal.style.transform = "";
        return;
      }
      const dx = (Math.random() * 2 - 1) * intensity;
      const dy = (Math.random() * 2 - 1) * intensity;
      $terminal.style.transform = "translate(" + dx.toFixed(2) + "px, " + dy.toFixed(2) + "px)";
      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener(
      "scroll",
      () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const frac = max > 0 ? window.scrollY / max : 0;
        // só começa a tremer nos últimos ~35% da página, até ~2.4px
        intensity = Math.max(0, (frac - 0.65) / 0.35) * 2.4;
        if (intensity > 0.02 && rafId === null) tick();
      },
      { passive: true }
    );
  }

  // ---------- glitch do texto do botão ----------

  function startLabelGlitch() {
    if (reduceMotion) return;
    const labels = CONTENT.finalZone.buttonLabels;

    (function next() {
      if (fired) return;
      const delay = 300 + Math.random() * 900;
      setTimeout(() => {
        if (fired) return;
        // maior parte do tempo mostra o rótulo "normal"
        const i = Math.random() < 0.55 ? 0 : 1 + Math.floor(Math.random() * (labels.length - 1));
        $btnLabel.textContent = labels[i];
        next();
      }, delay);
    })();
  }

  // ---------- a armadilha ----------

  function buildVideoOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "video-overlay";

    const iframe = document.createElement("iframe");
    iframe.src = embedUrl(videoPlatform, videoId);
    iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    iframe.allowFullscreen = true;
    iframe.title = "…";
    overlay.appendChild(iframe);

    if (CONTENT.reveal.enabled) {
      const reveal = document.createElement("div");
      reveal.className = "reveal";
      reveal.textContent = CONTENT.reveal.text;
      overlay.appendChild(reveal);
      setTimeout(() => reveal.remove(), CONTENT.reveal.durationMs);
    }

    return overlay;
  }

  function springTrap() {
    if (fired) return;
    fired = true;
    $terminal.style.transform = "";

    // o iframe entra no DOM imediatamente (dentro do gesto de clique,
    // para o autoplay funcionar no mobile) — escondido sob o glitch
    const overlay = buildVideoOverlay();
    document.body.appendChild(overlay);

    if (reduceMotion) {
      overlay.classList.add("visible");
      return;
    }

    // 0.45s de glitch/tela rasgando antes do reveal
    const fx = document.createElement("div");
    fx.id = "glitch-fx";
    document.body.appendChild(fx);
    document.body.classList.add("glitching");

    setTimeout(() => {
      fx.remove();
      document.body.classList.remove("glitching");
      overlay.classList.add("visible");
    }, 450);
  }

  $btn.addEventListener("click", springTrap);

  // ---------- go ----------

  runBoot();
})();
