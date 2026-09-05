(() => {
  const KEY = "bitcoinizate-lang";
  const dict = {
    en: {
      brandSub: "Free bitcoin-themed games",
      signIn: "Sign in",
      signUp: "Sign up",
      createAccount: "Create account",
      haveAccount: "Have an account?",
      needAccount: "Need an account?",
      forgot: "Forgot password?",
      close: "Close",
      save: "Save",
      signOut: "Sign out",
      profile: "Profile",
      alias: "Alias",
      email: "Email",
      password: "Password",
      confirmPass: "Confirm password",
      btcAddr: "BTC address",
      lightning: "Lightning",
      highScore: "High score",
      lead1: "Bitcoinizate is a new games site. This is our first title. September 2026 prizes in satoshis for the top 3 with a bitcoin address on their profile: 5,000 first, 3,000 second, 2,000 third.",
      lead2: "Fly through Japanese candles. The price moves while you fly. Score is total net worth in BTC at the in-game price.",
      playNow: "Play now",
      playSub: "Free in the browser · no download",
      ctaAccount: "Create a free account",
      ctaSub: "Save score and a BTC address to qualify for sats prizes",
      faqPrize: "How do the September prizes work?",
      faqPrizeA: "September 2026, paid in satoshis to a saved bitcoin address: 5,000 for 1st, 3,000 for 2nd, 2,000 for 3rd. Guest scores do not count. We may ignore runs that look automated.",
      playMoney: "In-game cash, price and score are play money. They are not real bitcoin.",
      tut1: "You are the ₿. Tap or press space to flap through the candle gaps. A wick or the floor liquidates you.",
      tut2: "Candles pay cash. Buy BTC on the dip, sell on the rip. Score is your whole bag in BTC: cash and coins priced at the live in-game rate.",
      tut3a: "Bull pumps price.",
      tut3b: "Bear dumps it.",
      tut4a: "Black swan is a hard crash.",
      tut4b: "Halving is a fat bull — grab it up or down when told.",
      tut5: "Cold storage saves a hit. Ten colds become one multisig life.",
      tut6: "Laser eyes eat a bear and unlock a perk.",
      faq: "FAQ",
      faqWhat: "What is Bitcoinizate?",
      faqWhatA: "A Bitcoin arcade. One game: Choppy Bitcoin. No token. In the browser.",
      faqAcc: "Do I need an account?",
      faqAccA: "No. Play is free. Sign in only if you want the cloud leaderboard.",
      playLink: "play Choppy Bitcoin",
      privacy: "Privacy",
      options: "Options",
      paused: "Paused",
      resume: "Resume",
      back: "Back",
      sound: "Sound",
      jukebox: "Jukebox",
      tutorial: "Tutorial",
      aiLog: "A.I. bud log",
      aiNeed: "Unlock the A.I. bud perk first.",
      jukeNeed: "Unlock the Jukebox perk first.",
      cash: "Cash",
      btc: "BTC",
      btcPx: "BTC price",
      cold: "Cold storage",
      msig: "Multisig",
      lasers: "Laser eyes",
      speed: "Speed",
      perks: "Perks",
      pickOne: "Pick one. Then tap ▶.",
      selected: "Selected. Tap ▶ to keep playing.",
      play: "Play",
      tryAgain: "Try again",
      playAgain: "Play again",
      rekt: "Rekt · net worth",
      board: "Leaderboard",
      aliasMonth: "Alias can change once every 30 days.",
      aliasWait: "Next alias change after ",
      best: "Best",
      congrats: "The float is yours",
      stacked: "You stacked the cap. Here is the tape of the run.",
      newPass: "New password",
      savePass: "Save password",
      choosePass: "Choose a new password.",
      privacyH: "Privacy policy",
      privacyB1: "Bitcoinizate is a browser games site. We do not sell a token and we do not sell your data.",
      privacyB2: "If you play as a guest we only store a high score on this device (local storage).",
      privacyB3: "If you create an account we keep email, password hash (handled by Supabase), alias, optional bitcoin/lightning addresses, and your cloud high score.",
      privacyB4: "We use that to sign you in, show the leaderboard, and contact winners if prizes start. We do not sell lists.",
      privacyB5: "You can sign out anytime. To delete an account write to the site operator from the email you registered.",
      lookUp: "Look up!",
      lookDown: "Look down!",
      welcome: "Welcome to Choppy Bitcoin: Survive the market!",
      liquidated: "Rekt! You got liquidated",
      floatYours: "Twenty one million The float is yours",
      bullSongs: "Bull/bear songs",
      gameFx: "Game FX",
      voices: "Voices",
    },
    es: {
      brandSub: "Juegos gratis de temática bitcoin",
      signIn: "Iniciar sesión",
      signUp: "Crear cuenta",
      createAccount: "Crear cuenta",
      haveAccount: "¿Ya tienes cuenta?",
      needAccount: "¿No tienes cuenta?",
      forgot: "¿Olvidaste la contraseña?",
      close: "Cerrar",
      save: "Guardar",
      signOut: "Cerrar sesión",
      profile: "Perfil",
      alias: "Alias",
      email: "Correo",
      password: "Contraseña",
      confirmPass: "Confirmar contraseña",
      btcAddr: "Dirección BTC",
      lightning: "Lightning",
      highScore: "Mejor puntaje",
      lead1: "Bitcoinizate es un sitio nuevo de juegos. Este es nuestro primer título. Premios septiembre 2026 en satoshis para el top 3 con dirección bitcoin en el perfil: 5.000 el primero, 3.000 el segundo, 2.000 el tercero.",
      lead2: "Vuela entre velas japonesas. El precio se mueve mientras vuelas. El puntaje es el patrimonio total en BTC al precio del juego.",
      playNow: "Jugar ahora",
      playSub: "Gratis en el navegador · sin descargar",
      ctaAccount: "Crea una cuenta gratis",
      ctaSub: "Guarda puntaje y una dirección BTC para calificar por premios en sats",
      faqPrize: "¿Cómo son los premios de septiembre?",
      faqPrizeA: "Septiembre 2026, se paga en satoshis a una dirección bitcoin guardada: 5.000 al 1.°, 3.000 al 2.°, 2.000 al 3.°. El puntaje de invitado no cuenta. Podemos descartar partidas que parezcan automáticas.",
      playMoney: "El efectivo, el precio y el puntaje del juego son play money. No es bitcoin real.",
      tut1: "Eres el ₿. Toca o aprieta espacio para pasar por el hueco de las velas. Una mecha o el piso te liquida.",
      tut2: "Las velas pagan efectivo. Compra BTC en la baja, vende en la subida. El puntaje es todo tu bag en BTC: efectivo y monedas al precio en vivo del juego.",
      tut3a: "El bull sube el precio.",
      tut3b: "El bear lo tira.",
      tut4a: "El cisne negro es una caída fuerte.",
      tut4b: "El halving es un bull grande: agárralo arriba o abajo cuando te avisen.",
      tut5: "El cold storage salva un golpe. Diez colds se vuelven una vida multisig.",
      tut6: "Los laser eyes se comen un bear y desbloquean un perk.",
      faq: "Preguntas",
      faqWhat: "¿Qué es Bitcoinizate?",
      faqWhatA: "Un arcade de Bitcoin. Un juego: Choppy Bitcoin. Sin token. En el navegador.",
      faqAcc: "¿Necesito una cuenta?",
      faqAccA: "No. Jugar es gratis. Inicia sesión solo si quieres el ranking en la nube.",
      playLink: "jugar Choppy Bitcoin",
      privacy: "Privacidad",
      options: "Opciones",
      paused: "Pausa",
      resume: "Seguir",
      back: "Volver",
      sound: "Sonido",
      jukebox: "Jukebox",
      tutorial: "Tutorial",
      aiLog: "Registro de A.I. bud",
      aiNeed: "Primero desbloquea el perk A.I. bud.",
      jukeNeed: "Primero desbloquea el Jukebox.",
      cash: "Efectivo",
      btc: "BTC",
      btcPx: "Precio BTC",
      cold: "Cold storage",
      msig: "Multisig",
      lasers: "Laser eyes",
      speed: "Velocidad",
      perks: "Perks",
      pickOne: "Elige uno. Después toca ▶.",
      selected: "Elegido. Toca ▶ para seguir.",
      play: "Jugar",
      tryAgain: "Otra vez",
      playAgain: "Jugar de nuevo",
      rekt: "Rekt · patrimonio",
      board: "Ranking",
      aliasMonth: "El alias se puede cambiar una vez cada 30 días.",
      aliasWait: "Próximo cambio de alias después del ",
      best: "Mejor",
      congrats: "El float es tuyo",
      stacked: "Llenaste el tope. Esta es la cinta de la partida.",
      newPass: "Nueva contraseña",
      savePass: "Guardar contraseña",
      choosePass: "Elige una contraseña nueva.",
      privacyH: "Política de privacidad",
      privacyB1: "Bitcoinizate es un sitio de juegos en el navegador. No vendemos un token y no vendemos tus datos.",
      privacyB2: "Si juegas como invitado solo guardamos un puntaje alto en este dispositivo (almacenamiento local).",
      privacyB3: "Si creas una cuenta guardamos correo, hash de contraseña (lo maneja Supabase), alias, direcciones opcionales de bitcoin/lightning y tu puntaje en la nube.",
      privacyB4: "Eso sirve para iniciar sesión, mostrar el ranking y contactar ganadores si hay premios. No vendemos listas.",
      privacyB5: "Puedes cerrar sesión cuando quieras. Para borrar una cuenta escribe al operador del sitio desde el correo con el que te registraste.",
      lookUp: "Mira arriba!",
      lookDown: "Mira abajo!",
      welcome: "Bienvenido a Choppy Bitcoin: Sobrevive al mercado!",
      liquidated: "Rekt! Te liquidaron",
      floatYours: "Veintiún millones El float es tuyo",
      bullSongs: "Canciones bull/bear",
      gameFx: "FX del juego",
      voices: "Voces",
    }
  };

  function detect() {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "es" || saved === "en") return saved;
    } catch (e) {}
    const list = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "en"]).map((s) => String(s || "").toLowerCase());
    return list.some((l) => l === "es" || l.indexOf("es-") === 0) ? "es" : "en";
  }

  let lang = detect();

  function t(key) {
    const pack = dict[lang] || dict.en;
    return pack[key] != null ? pack[key] : (dict.en[key] != null ? dict.en[key] : key);
  }

  function apply(root) {
    const box = root || document;
    box.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    box.querySelectorAll("[data-i18n-html]").forEach((el) => {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    document.documentElement.lang = lang === "es" ? "es" : "en";
    document.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.classList.toggle("on", btn.getAttribute("data-lang") === lang);
    });
    if (window.ArcadeAudio && typeof window.ArcadeAudio.setLang === "function") {
      window.ArcadeAudio.setLang(lang);
    }
  }

  function setLang(next) {
    lang = next === "es" ? "es" : "en";
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    apply(document);
    window.dispatchEvent(new CustomEvent("bz-lang", { detail: lang }));
  }

  window.BZ = { t, setLang, apply, lang() { return lang; }, detect };
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-lang]");
    if (!btn) return;
    e.preventDefault();
    setLang(btn.getAttribute("data-lang"));
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => apply(document));
  else apply(document);
})();
