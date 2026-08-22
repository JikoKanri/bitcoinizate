// AUTH.JS - PARTE 1 DE 2: LLAVES DE BASE DE DATOS Y COMPROBACIÓN ASÍNCRONA
const SUPABASE_URL = "https://xhewdrhfofwpzfogthai.supabase.co/rest/v1/"; 
const SUPABASE_KEY = "sb_publishable_MJn5-gsw8CyQ-TlV2YzUHA_jlkO4Bzl"; 

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentUser = null;
let currentProfile = null;

const authBar = document.getElementById("auth-bar");
const btnShowAuth = document.getElementById("btn-show-auth");
const userProfileTag = document.getElementById("user-profile-tag");
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
