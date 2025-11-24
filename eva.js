// ==========================================
// EVA - ASSISTENTE DE VOZ
// Web Speech API + Interação IA
// ==========================================

// ==========================================
// 1. CONFIGURAÇÃO VOICE RECOGNITION
// ==========================================
const voiceConfig = {
    lang: 'pt-BR',
    continuous: false,
    interimResults: false,
    maxAlternatives: 1
};

let recognition = null;
let isRecording = false;

// ==========================================
// 2. INICIALIZAÇÃO
// ==========================================
function setupVoiceRecognition() {
    // Verificar suporte do navegador
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('⚠️ Speech Recognition não suportado neste navegador');
        disableVoiceButton();
        return;
    }
    
    // Criar instância
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    // Configurar
    recognition.lang = voiceConfig.lang;
    recognition.continuous = voiceConfig.continuous;
    recognition.interimResults = voiceConfig.interimResults;
    recognition.maxAlternatives = voiceConfig.maxAlternatives;
    
    // Event listeners
    recognition.onstart = handleStart;
    recognition.onresult = handleResult;
    recognition.onerror = handleError;
    recognition.onend = handleEnd;
    
    // Setup botão
    const btnVoice = document.getElementById('btnVoice');
    if (btnVoice) {
        btnVoice.addEventListener('click', toggleVoiceRecording);
    }
    
    console.log('✅ Voice Recognition configurado');
}

// ==========================================
// 3. CONTROLE DE GRAVAÇÃO
// ==========================================
function toggleVoiceRecording() {
    if (isRecording) {
        stopVoiceRecording();
    } else {
        startVoiceRecording();
    }
}

function startVoiceRecording() {
    if (!recognition) {
        showError('Reconhecimento de voz não disponível');
        return;
    }
    
    try {
        recognition.start();
        isRecording = true;
        
        // Atualizar UI
        updateVoiceButton(true);
        updateVoiceStatus('🎙️ Ouvindo... Fale agora!');
        
        // Track evento
        if (window.gtag) {
            gtag('event', 'voice_recording_start', {
                'event_category': 'engagement',
                'event_label': 'voice_input'
            });
        }
        
    } catch (error) {
        console.error('Erro ao iniciar gravação:', error);
        showError('Erro ao acessar microfone');
    }
}

function stopVoiceRecording() {
    if (recognition && isRecording) {
        recognition.stop();
        isRecording = false;
        
        // Atualizar UI
        updateVoiceButton(false);
        updateVoiceStatus('');
    }
}

// ==========================================
// 4. HANDLERS DE EVENTOS
// ==========================================
function handleStart() {
    console.log('🎙️ Gravação iniciada');
}

function handleResult(event) {
    const transcript = event.results[0][0].transcript;
    const confidence = event.results[0][0].confidence;
    
    console.log(`📝 Transcrito: "${transcript}" (Confiança: ${(confidence * 100).toFixed(0)}%)`);
    
    // Preencher textarea
    const descricaoInput = document.getElementById('descricao');
    if (descricaoInput) {
        // Adicionar ao texto existente ou substituir
        const currentText = descricaoInput.value.trim();
        if (currentText) {
            descricaoInput.value = currentText + ' ' + transcript;
        } else {
            descricaoInput.value = transcript;
        }
        
        // Trigger evento de input para atualizar contador
        descricaoInput.dispatchEvent(new Event('input'));
        
        // Feedback visual
        descricaoInput.focus();
        showSuccess('✓ Voz transcrita com sucesso!');
    }
    
    // Track evento
    if (window.gtag) {
        gtag('event', 'voice_recording_success', {
            'event_category': 'engagement',
            'event_label': 'voice_transcribed',
            'value': Math.round(confidence * 100)
        });
    }
}

function handleError(event) {
    console.error('❌ Erro no reconhecimento:', event.error);
    
    let errorMessage = 'Erro ao reconhecer voz';
    
    switch (event.error) {
        case 'no-speech':
            errorMessage = 'Nenhuma fala detectada. Tente novamente.';
            break;
        case 'audio-capture':
            errorMessage = 'Microfone não encontrado ou sem permissão.';
            break;
        case 'not-allowed':
            errorMessage = 'Permissão para microfone negada.';
            break;
        case 'network':
            errorMessage = 'Erro de conexão. Verifique sua internet.';
            break;
    }
    
    showError(errorMessage);
    stopVoiceRecording();
}

function handleEnd() {
    console.log('🛑 Gravação finalizada');
    stopVoiceRecording();
}

// ==========================================
// 5. ATUALIZAÇÃO DE UI
// ==========================================
function updateVoiceButton(recording) {
    const btnVoice = document.getElementById('btnVoice');
    if (!btnVoice) return;
    
    const buttonText = btnVoice.querySelector('span');
    
    if (recording) {
        btnVoice.classList.add('recording');
        if (buttonText) buttonText.textContent = 'Gravando... (clique para parar)';
    } else {
        btnVoice.classList.remove('recording');
        if (buttonText) buttonText.textContent = 'Ou fale seu caso';
    }
}

function updateVoiceStatus(message) {
    const voiceStatus = document.getElementById('voiceStatus');
    if (voiceStatus) {
        voiceStatus.textContent = message;
        
        if (message) {
            voiceStatus.style.display = 'block';
            voiceStatus.style.color = '#10B981';
            voiceStatus.style.fontWeight = '500';
        } else {
            voiceStatus.style.display = 'none';
        }
    }
}

function disableVoiceButton() {
    const btnVoice = document.getElementById('btnVoice');
    if (btnVoice) {
        btnVoice.disabled = true;
        btnVoice.style.opacity = '0.5';
        btnVoice.style.cursor = 'not-allowed';
        
        const buttonText = btnVoice.querySelector('span');
        if (buttonText) {
            buttonText.textContent = 'Voz não disponível neste navegador';
        }
    }
}

// ==========================================
// 6. FUNCIONALIDADES EXTRAS
// ==========================================

// Detecção de comandos de voz especiais
function detectVoiceCommands(transcript) {
    const lowerTranscript = transcript.toLowerCase();
    
    // Comandos básicos
    if (lowerTranscript.includes('apagar') || lowerTranscript.includes('limpar')) {
        const descricaoInput = document.getElementById('descricao');
        if (descricaoInput) {
            descricaoInput.value = '';
            showSuccess('Texto apagado');
            return true;
        }
    }
    
    if (lowerTranscript.includes('próximo') || lowerTranscript.includes('continuar')) {
        nextStep();
        return true;
    }
    
    if (lowerTranscript.includes('voltar') || lowerTranscript.includes('anterior')) {
        prevStep();
        return true;
    }
    
    return false;
}

// Síntese de voz (Text-to-Speech) para respostas da EVA
function speakText(text) {
    if (!('speechSynthesis' in window)) {
        console.warn('Text-to-Speech não suportado');
        return;
    }
    
    // Cancelar qualquer fala em andamento
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Escolher voz feminina em português (se disponível)
    const voices = window.speechSynthesis.getVoices();
    const ptBrVoice = voices.find(voice => 
        voice.lang === 'pt-BR' && voice.name.includes('female')
    ) || voices.find(voice => voice.lang === 'pt-BR');
    
    if (ptBrVoice) {
        utterance.voice = ptBrVoice;
    }
    
    window.speechSynthesis.speak(utterance);
}

// Feedback sonoro
function playBeep(type = 'success') {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'success') {
        oscillator.frequency.value = 800;
    } else if (type === 'error') {
        oscillator.frequency.value = 400;
    }
    
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.2);
    
    setTimeout(() => {
        oscillator.stop();
    }, 200);
}

// ==========================================
// 7. INTERAÇÃO COM EVA (Chat Simulado)
// ==========================================
class EvaAssistant {
    constructor() {
        this.context = [];
        this.isTyping = false;
    }
    
    async processMessage(userMessage) {
        this.context.push({
            role: 'user',
            content: userMessage
        });
        
        // Simular "typing" da EVA
        this.showTyping(true);
        
        // Aqui você pode integrar com API real de chat
        await this.delay(1500);
        
        // Resposta simulada (substituir por API real)
        const response = this.generateResponse(userMessage);
        
        this.context.push({
            role: 'assistant',
            content: response
        });
        
        this.showTyping(false);
        
        return response;
    }
    
    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Respostas baseadas em palavras-chave
        if (lowerMessage.includes('demit') || lowerMessage.includes('trabalh')) {
            return 'Entendo que você tem uma questão trabalhista. Vou te conectar com advogados especializados em Direito do Trabalho.';
        }
        
        if (lowerMessage.includes('divórcio') || lowerMessage.includes('família')) {
            return 'Questões de família são delicadas. Temos advogados especializados em Direito de Família que podem te ajudar.';
        }
        
        if (lowerMessage.includes('acidente') || lowerMessage.includes('indenização')) {
            return 'Casos de indenização requerem análise cuidadosa. Vou buscar os melhores advogados para seu caso.';
        }
        
        return 'Obrigada por compartilhar. Estou analisando seu caso para encontrar os melhores advogados.';
    }
    
    showTyping(show) {
        // Implementar indicador visual de "EVA digitando..."
        this.isTyping = show;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Instância global da EVA
const eva = new EvaAssistant();

// ==========================================
// 8. PERMISSÕES E COMPATIBILIDADE
// ==========================================
async function requestMicrophonePermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        return true;
    } catch (error) {
        console.error('Permissão de microfone negada:', error);
        return false;
    }
}

function checkBrowserCompatibility() {
    const hasVoiceRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    const hasSpeechSynthesis = 'speechSynthesis' in window;
    const hasMediaDevices = 'mediaDevices' in navigator;
    
    return {
        voiceRecognition: hasVoiceRecognition,
        speechSynthesis: hasSpeechSynthesis,
        mediaDevices: hasMediaDevices,
        isFullyCompatible: hasVoiceRecognition && hasSpeechSynthesis && hasMediaDevices
    };
}

// ==========================================
// 9. ANALYTICS E TRACKING
// ==========================================
function trackVoiceEvent(eventName, params = {}) {
    if (window.gtag) {
        gtag('event', eventName, {
            event_category: 'voice_interaction',
            ...params
        });
    }
    
    if (window.fbq) {
        fbq('trackCustom', eventName, params);
    }
}

// ==========================================
// 10. EXPORTS
// ==========================================
window.eva = eva;
window.startVoiceRecording = startVoiceRecording;
window.stopVoiceRecording = stopVoiceRecording;
window.speakText = speakText;

// ==========================================
// 11. AUTO-INICIALIZAÇÃO
// ==========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEVA);
} else {
    initEVA();
}

function initEVA() {
    console.log('🤖 EVA Assistant inicializada');
    
    const compatibility = checkBrowserCompatibility();
    
    if (!compatibility.voiceRecognition) {
        console.warn('⚠️ Reconhecimento de voz não suportado');
        disableVoiceButton();
    }
    
    // Log de compatibilidade
    console.log('Compatibilidade:', compatibility);
}

console.log('✅ EVA.js carregado com sucesso');
