// ADVOCACIA.AI - JAVASCRIPT PRINCIPAL
// Funcionalidades: Formulário multi-step, validações,
// navegação, integrações, UX
// ==========================================

// ==========================================
// 1. CONFIGURAÇÕES E CONSTANTES
// ==========================================
const CONFIG = {
    API_URL: 'https://api.advocacia.ai', // Alterar para produção
    API_LOCAL: 'http://localhost:8000', // Desenvolvimento
    USE_LOCAL: window.location.hostname === 'localhost',
    OPENAI_ENDPOINT: '/api/leads/', // Endpoint FastAPI
    CEP_API: 'https://viacep.com.br/ws',
    GOOGLE_MAPS_KEY: 'AIzaSy...', // Sua chave Google Maps
    WHATSAPP_NUMBER: '5511999999999',
    MAX_CHAR_DESCRICAO: 500
};

// Estado global do formulário
const formState = {
    currentStep: 1,
    totalSteps: 4,
    data: {
        descricao: '',
        tipoPessoa: 'pf',
        nome: '',
        cpfCnpj: '',
        telefone: '',
        email: '',
        cep: '',
        cidade: '',
        estado: '',
        geolat: null,
        geolon: null,
        consent1: false,
        consent2: false,
        consent3: false,
        iaResult: null
    },
    isVoiceRecording: false,
    recognition: null
};

// ==========================================
// 2. INICIALIZAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    setupVoiceRecognition();
    setupFormValidation();
    setupFAQ();
    updateProgressBar();
});

function initializeApp() {
    console.log('🚀 Advocacia.AI iniciado');
    
    // Detectar scroll para header
    window.addEventListener('scroll', handleScroll);
    
    // Mobile menu
    const navToggle = document.getElementById('navToggle');
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Máscara de inputs
    setupInputMasks();
    
    // Contador de caracteres
    const descricaoInput = document.getElementById('descricao');
    if (descricaoInput) {
        descricaoInput.addEventListener('input', updateCharCount);
    }
}

function setupEventListeners() {
    // Radio buttons tipo pessoa
    const radioButtons = document.querySelectorAll('input[name="tipoPessoa"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
            formState.data.tipoPessoa = e.target.value;
            updateCpfCnpjLabel();
        });
    });
    
    // Links smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }