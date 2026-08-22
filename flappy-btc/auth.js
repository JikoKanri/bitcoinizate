// AUTH.JS - COMPROBACIÓN MAESTRA DE CONEXIÓN CON VARIABLES DE RESPALDO
const SUPABASE_URL = "https://xhewdrhfofwpzfogthai.supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoZXdkcmhmb2Z3cHpmb2d0aGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MDM0OTMsImV4cCI6MjEwMjk3OTQ5M30.zch7bpyq2kaYaQeW4wMrQhkSPxyzzKKiD6jRLTWYidY"; 

let supabase = null;

// Intenta inicializar la librería usando cualquiera de los dos selectores de CDN del navegador
try {
    if (typeof window.supabase !== "undefined" && window.supabase.createClient) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } else if (typeof window.Supabase !== "undefined" && window.Supabase.createClient) {
        supabase = window.Supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
} catch (err) {
    console.error("Supabase script allocation crashed:", err);
}

let currentUser = null;
let currentProfile = null;

const authModal = document.getElementById("auth-modal");
const profileModal = document.getElementById("profile-modal");

const authEmail = document.getElementById("auth-email");
const authPassword = document.getElementById("auth-password");
const authUsername = document.getElementById("auth-username");
const groupAlias = document.getElementById("group-alias");
const btnSubmitAuth = document.getElementById("btn-submit-auth");
const btnToggleAuth = document.getElementById("btn-toggle-auth");
const arcadeHoneypot = document.getElementById("arcade-honeypot");

const profileScoreInfo = document.getElementById("profile-score-info");
const profileBtcAddr = document.getElementById("profile-btc-addr");
const profileLnAddr = document.getElementById("profile-ln-addr");
const btnSaveProfile = document.getElementById("btn-save-profile");

let isSignUpMode = false;

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
        updateAuthUI(null);
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
        updateAuthUI(null);
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
    fetchGlobalLeaderboard();
}
// AUTH.JS - PARTE 2 DE 2: EJECUCIÓN CLOUD Y RENDERIZADO DEL LEADERBOARD
async function handleAuthSubmit() {
    if (arcadeHoneypot.value !== "") {
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
            const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
            if (authError) throw authError;

            if (authData.user) {
                const { error: profError } = await supabase
                    .from('profiles')
                    .insert([{ id: authData.user.id, username: username, high_score: 0 }]);
                if (profError) throw profError;
                alert("Account created successfully!");
                toggleAuthMode();
            }
        } else {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
            if (authError) throw authError;
            currentUser = authData.user;
            await loadUserProfile();
            authModal.style.display = "none";
        }
    } catch (e) {
        alert(e.message || "Authentication failed.");
    }
}

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
                let scoreVal = parseFloat(trader.high_score) || 0;
                rankText += `${index + 1}. ${trader.username.toUpperCase().padEnd(10, "-")} ${scoreVal.toFixed(8)} BTC\n`;
            });
            leaderboardBox.innerText = rankText;
        } else {
            leaderboardBox.innerText = "No records yet.\nStack sats now!";
        }
    } catch (e) {
        leaderboardBox.innerText = "Error connecting to cloud ranking.";
    }
}

async function submitNewHighScore(finalBTC) {
    if (!currentUser || !currentProfile) return;
    let newScore = parseFloat(finalBTC) || 0;
    let oldScore = parseFloat(currentProfile.high_score) || 0;
    if (newScore <= oldScore) return;

    try {
        const { error } = await supabase
            .from('profiles')
            .update({ high_score: newScore })
            .eq('id', currentUser.id);

        if (error) throw error;
        await loadUserProfile();
    } catch (e) {
        console.error("Failed to submit score:", e);
    }
}

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

btnShowAuth.addEventListener("click", () => { authModal.style.display = "flex"; });
document.getElementById("btn-close-auth").addEventListener("click", () => { authModal.style.display = "none"; });
btnToggleAuth.addEventListener("click", toggleAuthMode);
btnSubmitAuth.addEventListener("click", handleAuthSubmit);

userProfileTag.addEventListener("click", () => {
    if (currentProfile) {
        let maxScore = parseFloat(currentProfile.high_score) || 0;
        profileScoreInfo.innerText = `HIGH SCORE: ${maxScore.toFixed(8)} BTC`;
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

window.addEventListener("DOMContentLoaded", checkActiveSession);

