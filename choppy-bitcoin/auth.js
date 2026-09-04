(() => {
  const supabase = window.supabase && window.supabase.createClient
    ? window.supabase.createClient()
    : null;

  let currentUser = null;
  let currentProfile = null;
  let isSignUpMode = false;

  const $ = (id) => document.getElementById(id);
  const authModal = $("auth-modal");
  const profileModal = $("profile-modal");
  const authMsg = $("auth-msg");

  function setMsg(text, bad) {
    if (!authMsg) return;
    authMsg.textContent = text || "";
    authMsg.classList.toggle("bad", !!bad);
  }

  function validAlias(s) {
    return /^[a-zA-Z0-9_]{3,16}$/.test(s);
  }

  function updateAuthUI(profile) {
    const btn = $("btn-show-auth");
    const tag = $("user-profile-tag");
    if (profile && profile.username) {
      if (btn) btn.classList.add("hide");
      if (tag) {
        tag.classList.remove("hide");
        tag.textContent = "@" + profile.username;
      }
    } else {
      if (btn) btn.classList.remove("hide");
      if (tag) {
        tag.classList.add("hide");
        tag.textContent = "";
      }
    }
    fetchGlobalLeaderboard();
  }

  async function checkActiveSession() {
    if (!supabase) { updateAuthUI(null); return; }
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session || !data.session.user) {
      currentUser = null; currentProfile = null;
      updateAuthUI(null);
      return;
    }
    currentUser = data.session.user;
    await loadUserProfile();
  }

  async function loadUserProfile() {
    if (!currentUser || !supabase) return;
    const { data, error } = await supabase.from("profiles").select("*").eq("id", currentUser.id).single();
    if (error || !data) {
      currentProfile = {
        id: currentUser.id,
        username: (currentUser.user_metadata && currentUser.user_metadata.username) || "trader",
        highscore: 0
      };
      updateAuthUI(currentProfile);
      return;
    }
    currentProfile = data;
    updateAuthUI(currentProfile);
  }

  async function handleAuthSubmit() {
    if ($("arcade-honeypot") && $("arcade-honeypot").value) {
      if (authModal) authModal.classList.add("hide");
      return;
    }
    const email = ($("auth-email") && $("auth-email").value || "").trim();
    const password = ($("auth-password") && $("auth-password").value || "").trim();
    const username = ($("auth-username") && $("auth-username").value || "").trim();
    if (!email || !password) { setMsg("Enter email and password.", true); return; }
    if (password.length < 8) { setMsg("Password must be at least 8 characters.", true); return; }
    if (!supabase) { setMsg("Auth is offline.", true); return; }
    setMsg("Working…");
    try {
      if (isSignUpMode) {
        if (!validAlias(username)) { setMsg("Alias: 3–16 letters, numbers or _.", true); return; }
        const { data, error } = await supabase.auth.signUp({
          email, password, options: { data: { username } }
        });
        if (error) throw error;
        if (data.session && data.user) {
          currentUser = data.user;
          try {
            await supabase.from("profiles").insert([{ id: data.user.id, username, highscore: 0 }]);
          } catch (e) {}
          await loadUserProfile();
          if (authModal) authModal.classList.add("hide");
          setMsg("");
        } else {
          setMsg("Check your email to confirm the account.");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        currentUser = data.user;
        await loadUserProfile();
        if (authModal) authModal.classList.add("hide");
        setMsg("");
      }
    } catch (e) {
      setMsg(e.message || "Authentication failed.", true);
    }
  }

  async function updateProfileAddresses() {
    if (!currentUser || !supabase) return;
    const btcAddr = ($("profile-btc-addr") && $("profile-btc-addr").value || "").trim();
    const lnAddr = ($("profile-ln-addr") && $("profile-ln-addr").value || "").trim();
    try {
      await supabase.from("profiles").update({ btc_address: btcAddr, ln_address: lnAddr }).eq("id", currentUser.id);
      await loadUserProfile();
      if (profileModal) profileModal.classList.add("hide");
    } catch (e) {
      setMsg("Update failed: " + (e.message || "error"), true);
    }
  }

  async function fetchGlobalLeaderboard() {
    const box = $("leaderboard-box");
    if (!box || !supabase) return;
    try {
      let rows = [];
      await supabase.from("profiles").select("username, highscore").order("highscore", { ascending: false }).limit(5).then((res) => {
        if (res.error) throw res.error;
        rows = res.data || [];
      });
      if (!rows.length) { box.textContent = "No records yet."; return; }
      box.textContent = rows.map((t, i) => (i + 1) + ". " + (t.username || "?") + "  " + (Number(t.highscore) || 0)).join("\n");
    } catch (e) {
      box.textContent = "Leaderboard offline.";
    }
  }

  async function submitNewHighScore(n) {
    if (!currentUser || !currentProfile || !supabase) return;
    const next = Number(n) || 0;
    const old = Number(currentProfile.highscore != null ? currentProfile.highscore : currentProfile.high_score) || 0;
    if (next <= old) return;
    try {
      await supabase.from("profiles").update({ highscore: next }).eq("id", currentUser.id);
      await loadUserProfile();
    } catch (e) {}
  }

  function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    const title = $("modal-auth-title");
    const group = $("group-alias");
    if (title) title.textContent = isSignUpMode ? "Sign up" : "Sign in";
    if (group) group.classList.toggle("hide", !isSignUpMode);
    if ($("btn-submit-auth")) $("btn-submit-auth").textContent = isSignUpMode ? "Create account" : "Sign in";
    if ($("btn-toggle-auth")) $("btn-toggle-auth").textContent = isSignUpMode ? "Have an account?" : "Need an account?";
    setMsg("");
  }

  function openAuth() {
    isSignUpMode = false;
    if ($("modal-auth-title")) $("modal-auth-title").textContent = "Sign in";
    if ($("group-alias")) $("group-alias").classList.add("hide");
    if ($("btn-submit-auth")) $("btn-submit-auth").textContent = "Sign in";
    if ($("btn-toggle-auth")) $("btn-toggle-auth").textContent = "Need an account?";
    setMsg("");
    if (authModal) authModal.classList.remove("hide");
  }

  if ($("btn-show-auth")) $("btn-show-auth").onclick = openAuth;
  if ($("btn-close-auth")) $("btn-close-auth").onclick = () => authModal && authModal.classList.add("hide");
  if ($("btn-toggle-auth")) $("btn-toggle-auth").onclick = toggleAuthMode;
  if ($("btn-submit-auth")) $("btn-submit-auth").onclick = handleAuthSubmit;
  ["auth-email", "auth-password", "auth-username"].forEach((id) => {
    const el = $(id);
    if (el) el.addEventListener("keydown", (e) => { if (e.key === "Enter") handleAuthSubmit(); });
  });

  if ($("user-profile-tag")) {
    $("user-profile-tag").onclick = () => {
      if (!currentProfile) return;
      if ($("profile-score-info")) $("profile-score-info").textContent = "High score  " + (Number(currentProfile.highscore != null ? currentProfile.highscore : currentProfile.high_score) || 0);
      if ($("profile-btc-addr")) $("profile-btc-addr").value = currentProfile.btc_address || "";
      if ($("profile-ln-addr")) $("profile-ln-addr").value = currentProfile.ln_address || "";
      if (profileModal) profileModal.classList.remove("hide");
    };
  }
  if ($("btn-close-profile")) $("btn-close-profile").onclick = () => profileModal && profileModal.classList.add("hide");
  if ($("btn-save-profile")) $("btn-save-profile").onclick = updateProfileAddresses;
  if ($("btn-logout")) {
    $("btn-logout").onclick = async () => {
      if (supabase) await supabase.auth.signOut();
      currentUser = null; currentProfile = null;
      updateAuthUI(null);
      if (profileModal) profileModal.classList.add("hide");
    };
  }

  window.submitNewHighScore = submitNewHighScore;
  window.addEventListener("DOMContentLoaded", checkActiveSession);
  checkActiveSession();
})();
