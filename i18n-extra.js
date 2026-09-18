(() => {
  const extra = {
    en: {
      tut7: "Perks pause the flight. Pick one and the menu folds away. DCA auto-buys dips. A.I. bud trades. Jukebox plays. Marketplace spends cash on lives.",
      tut8: "Arc cards are story beats. Choose, then Got it. Ranked starts with no lives. Training is practice. Speed sits on the buy/sell dock.",
      graphics: "GRAPHICS",
      palette: "COLOR STYLE",
      animHero: "ANIMATED HERO",
      pickOne: "Pick one."
    },
    es: {
      tut7: "Los perks pausan el vuelo. Elegí uno y el menú se pliega. DCA compra bajas solo. A.I. bud opera. Jukebox suena. El marketplace gasta cash en vidas.",
      tut8: "Las cartas Arc son un corte de historia. Elegí y tocá Entendido. Ranked arranca sin vidas. Training es práctica. La velocidad está en el dock de compra/venta.",
      graphics: "GRÁFICOS",
      palette: "ESTILO DE COLOR",
      animHero: "HÉROE ANIMADO",
      pickOne: "Elige uno."
    }
  };
  function wrap() {
    if (!window.BZ || typeof BZ.t !== "function") return;
    if (BZ._extraWrapped) return;
    const orig = BZ.t.bind(BZ);
    BZ.t = function (k) {
      const lang = (typeof BZ.lang === "function" && BZ.lang()) || "en";
      const pack = extra[lang] || extra.en;
      if (pack[k] != null) return pack[k];
      return orig(k);
    };
    BZ._extraWrapped = true;
    if (typeof BZ.apply === "function") BZ.apply(document);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wrap);
  else wrap();
})();
