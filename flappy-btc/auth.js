// AUTH.JS - PARTE 1 DE 2: CONFIGURACIÓN CLOUD Y SISTEMA DE SESIONES
const SUPABASE_URL = "https://xhewdrhfofwpzfogthai.supabase.co/rest/v1/"; // Enlace que termina en .supabase.co
const SUPABASE_KEY = "sb_publishable_MJn5-gsw8CyQ-TlV2YzUHA_jlkO4Bzl"; // Tu Publishable Key (anon)

// Inicialización de la librería en el espacio de nombres global
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentUser = null;
let currentProfile = null;

// Elementos de la interfaz recuperados de forma global
const authBar = document.getElementById("auth-bar");
const btnShowAuth = document.getElementById("btn-show-auth");
const userProfileTag = document.getElementById("user-profile-tag");
const authModal = document.getElementById("auth-modal");
const profileModal = document.getElementById("profile-modal");

// Selectores de los formularios de autenticación
const authEmail = document.getElementById("auth-email");
const authPassword = document.getElementById("auth-password");
const authUsername = document.getElementById("auth-username");
const groupAlias = document.getElementById("group-alias");
const btnSubmitAuth = document.getElementById("btn-submit-auth");
const btnToggleAuth = document.getElementById("btn-toggle-auth");
const arcadeHoneypot = document.getElementById("arcade-honeypot");

// Selectores del panel de configuración de perfil
const profileScoreInfo = document.getElementById("profile-score-info");
const profileBtcAddr = document.getElementById("profile-btc-addr");
const profileLnAddr = document.getElementById("profile-ln-addr");
const btnSaveProfile = document.getElementById("btn-save-profile");

let isSignUpMode = false;

// --- CONTROL DE SESIONES NATIVAS DE SUPABASE ---
async function checkActiveSession() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (session) {
            currentUser = session.user;
            await loadUserProfile();
        } else {
            updateAuthUI(null);
        }
    } catch (e) {
        console.error("Session check error:", e);
    }
}

async function loadUserProfile() {
    if (!currentUser) return;
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();

        if (error) throw error;
        currentProfile = data;
        updateAuthUI(currentProfile);
    } catch (e) {
        console.error("Profile load error:", e);
    }
}

function updateAuthUI(profile) {
    const startTrigger = document.getElementById("start-trigger");
    if (profile) {
        btnShowAuth.style.display = "none";
        userProfileTag.style.display = "inline-block";
        userProfileTag.innerText = `[ ${profile.username.toUpperCase()} ]`;
        if (startTrigger) startTrigger.innerText = "START TRADING";
    } else {
        btnShowAuth.style.display = "inline-block";
        userProfileTag.style.display = "none";
        userProfileTag.innerText = "";
        if (startTrigger) startTrigger.innerText = "LOGIN TO TRADE";
    }
    // Refresca la marquesina del ranking cada vez que hay un cambio de estado
    fetchGlobalLeaderboard();
}
// AUTH.JS - PARTE 2 DE 2: CONSULTAS DEL RANKING GLOBAL Y ACCIONES MODALES
async function handleAuthSubmit() {
    // PROTECCIÓN TRAMPA INVISIBLE ANTI-BOTS (HONEYPOT)
    if (arcadeHoneypot.value !== "") {
        console.warn("Spam bot blocked.");
        authModal.style.display = "none";
        return;
    }

    const email = authEmail.value.trim();
    const password = authPassword.value.trim();
    const username = authUsername.value.trim();

    if (!email || !password) {
        alert("Enter credentials.");
        return;
    }

    try {
        if (isSignUpMode) {
            if (!username) { alert("Enter trader alias."); return; }
            
            // 1. Registro del usuario seguro en Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
            if (authError) throw authError;

            if (authData.user) {
                // 2. Creación del casillero del perfil correspondiente en la nube
                const { error: profError } = await supabase
                    .from('profiles')
                    .insert([{ id: authData.user.id, username: username, high_score: 0 }]);
                
                if (profError) throw profError;
                alert("Account created! Check mail or log in.");
                toggleAuthMode();
            }
        } else {
            // Flujo de inicio de sesión estándar
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
            if (authError) throw authError;
            currentUser = authData.user;
            await loadUserProfile();
            authModal.style.display = "none";
        }
    } catch (e) {
        alert(e.message || "Auth action failed.");
    }
}

// --- ACTUALIZACIÓN PRIVADA DE MÉTODOS DE PAGO ---
async function updateProfileAddresses() {
    if (!currentUser) return;
    const btcAddr = profileBtcAddr.value.trim();
    const lnAddr = profileLnAddr.value.trim();

    try {
        const { error } = await supabase
            .from('profiles')
            .update({ btc_address: btcAddr, ln_address: lnAddr })
            .eq('id', currentUser.id);

        if (error) throw error;
        alert("Addresses securely updated!");
        await loadUserProfile();
        profileModal.style.display = "none";
    } catch (e) {
        alert("Update failed: " + e.message);
    }
}

// --- RENDERING DE LA TABLA DE CLASIFICACIÓN GLOBAL (RANKING) ---
async function fetchGlobalLeaderboard() {
    const leaderboardBox = document.getElementById("leaderboard-box");
    if (!leaderboardBox) return;

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('username, high_score')
            .order('high_score', { ascending: false })
            .limit(5);

        if (error) throw error;

        if (data && data.length > 0) {
            let rankText = "";
            data.forEach((trader, index) => {
                rankText += `${index + 1}. ${trader.username.toUpperCase().padEnd(12, "-")} $${Math.floor(trader.high_score)}\n`;
            });
            leaderboardBox.innerText = rankText;
        } else {
            leaderboardBox.innerText = "No records yet.\nBe the first!";
        }
    } catch (e) {
        leaderboardBox.innerText = "Error reading cloud scoreboard.";
    }
}

// --- ENVÍO AUTOMÁTICO DE RÉCORDS AL MORIR ---
async function submitNewHighScore(finalNetWorth) {
    if (!currentUser || !currentProfile) return;
    if (finalNetWorth <= currentProfile.high_score) return;

    try {
        const { error } = await supabase
            .from('profiles')
            .update({ high_score: Math.floor(finalNetWorth) })
            .eq('id', currentUser.id);

        if (error) throw error;
        await loadUserProfile(); // Recarga local de datos
    } catch (e) {
        console.error("Failed to submit score:", e);
    }
}

// --- MANEJO VISUAL DE VENTANAS COMPORTAMENTALES ---
function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    if (isSignUpMode) {
        document.getElementById("modal-auth-title").innerText = "TRADER SIGN UP";
        groupAlias.style.display = "block";
        btnSubmitAuth.innerText = "SIGN UP";
        btnToggleAuth.innerText = "HAVE ACCOUNT?";
    } else {
        document.getElementById("modal-auth-title").innerText = "TRADER SIGN IN";
        groupAlias.style.display = "none";
        btnSubmitAuth.innerText = "LOGIN";
        btnToggleAuth.innerText = "NEED ACCOUNT?";
    }
}

// Escuchas de la barra y botones de cierre
btnShowAuth.addEventListener("click", () => { authModal.style.display = "flex"; });
document.getElementById("btn-close-auth").addEventListener("click", () => { authModal.style.display = "none"; });
btnToggleAuth.addEventListener("click", toggleAuthMode);
btnSubmitAuth.addEventListener("click", handleAuthSubmit);

userProfileTag.addEventListener("click", () => {
    if (currentProfile) {
        profileScoreInfo.innerText = `HIGH SCORE: $${Math.floor(currentProfile.high_score)} USD`;
        profileBtcAddr.value = currentProfile.btc_address || "";
        profileLnAddr.value = currentProfile.ln_address || "";
        profileModal.style.display = "flex";
    }
});

document.getElementById("btn-close-profile").addEventListener("click", () => { profileModal.style.display = "none"; });
btnSaveProfile.addEventListener("click", updateProfileAddresses);

document.getElementById("btn-logout").addEventListener("click", async () => {
    await supabase.auth.signOut();
    currentUser = null; currentProfile = null;
    updateAuthUI(null);
    profileModal.style.display = "none";
    location.reload();
});

// Sincronización automática inicial al cargar la página
window.addEventListener("DOMContentLoaded", checkActiveSession);
