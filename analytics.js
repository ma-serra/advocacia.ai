// ==========================================
// ADVOCACIA.AI - ANALYTICS & TRACKING
// Google Analytics 4, Google Ads, Facebook Pixel
// ==========================================

// ==========================================
// 1. CONFIGURAÇÕES
// ==========================================
const ANALYTICS_CONFIG = {
    GA4_ID: 'G-XXXXXXXXXX', // Substituir por seu ID real
    GOOGLE_ADS_ID: 'AW-XXXXXXXXX', // Substituir por seu ID real
    FB_PIXEL_ID: 'YOUR_PIXEL_ID', // Substituir por seu ID real
    ENABLED: true,
    DEBUG_MODE: window.location.hostname === 'localhost'
};

// ==========================================
// 2. GOOGLE ANALYTICS 4
// ==========================================
function initGA4() {
    if (!ANALYTICS_CONFIG.ENABLED) return;
    
    // GA4 já é carregado no HTML via GTM
    // Configurações adicionais
    if (window.gtag) {
        gtag('config', ANALYTICS_CONFIG.GA4_ID, {
            'send_page_view': true,
            'debug_mode': ANALYTICS_CONFIG.DEBUG_MODE
        });
        
        console.log('✅ Google Analytics 4 inicializado');
    }
}

// ==========================================
// 3. EVENTOS PERSONALIZADOS
// ==========================================
const EVENTS = {
    // Pageviews
    PAGE_VIEW: 'page_view',
    
    // Engajamento
    SCROLL_DEPTH: 'scroll_depth',
    TIME_ON_PAGE: 'time_on_page',
    CLICK_CTA: 'click_cta',
    PLAY_VIDEO: 'play_video',
    
    // Formulário
    FORM_START: 'form_start',
    FORM_STEP: 'form_step',
    FORM_ABANDON: 'form_abandon',
    FORM_ERROR: 'form_error',
    
    // Voice
    VOICE_START: 'voice_recording_start',
    VOICE_SUCCESS: 'voice_recording_success',
    VOICE_ERROR: 'voice_recording_error',
    
    // IA
    IA_ANALYSIS_START: 'ia_analysis_start',
    IA_ANALYSIS_SUCCESS: 'ia_analysis_complete',
    IA_ANALYSIS_ERROR: 'ia_analysis_error',
    
    // Conversão
    LEAD_SUBMIT: 'lead_submit',
    CONVERSION: 'conversion',
    
    // Áreas
    AREA_CLICK: 'area_click',
    FAQ_OPEN: 'faq_open',
    
    // Navegação
    NAVIGATION_CLICK: 'navigation_click',
    EXTERNAL_LINK: 'external_link_click',
    WHATSAPP_CLICK: 'whatsapp_click'
};

// ==========================================
// 4. TRACKING DE EVENTOS
// ==========================================
function trackEvent(eventName, params = {}) {
    if (!ANALYTICS_CONFIG.ENABLED) {
        if (ANALYTICS_CONFIG.DEBUG_MODE) {
            console.log(`📊 [DEBUG] Event: ${eventName}`, params);
        }
        return;
    }
    
    // Google Analytics 4
    if (window.gtag) {
        gtag('event', eventName, {
            ...params,
            timestamp: new Date().toISOString()
        });
    }
    
    // Facebook Pixel
    if (window.fbq) {
        fbq('trackCustom', eventName, params);
    }
    
    if (ANALYTICS_CONFIG.DEBUG_MODE) {
        console.log(`📊 Event tracked: ${eventName}`, params);
    }
}

// ==========================================
// 5. CONVERSÕES GOOGLE ADS
// ==========================================
function trackConversion(conversionLabel, value = 1.0) {
    if (!ANALYTICS_CONFIG.ENABLED) return;
    
    if (window.gtag) {
        gtag('event', 'conversion', {
            'send_to': `${ANALYTICS_CONFIG.GOOGLE_ADS_ID}/${conversionLabel}`,
            'value': value,
            'currency': 'BRL',
            'transaction_id': generateTransactionId()
        });
        
        console.log(`💰 Conversão Google Ads: ${conversionLabel}`);
    }
}

function generateTransactionId() {
    return 'ADV-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// ==========================================
// 6. FACEBOOK PIXEL EVENTOS
// ==========================================
function trackFacebookEvent(eventName, params = {}) {
    if (!ANALYTICS_CONFIG.ENABLED) return;
    
    if (window.fbq) {
        fbq('track', eventName, params);
        console.log(`📱 Facebook Pixel: ${eventName}`);
    }
}

// Standard Events Facebook
const FB_EVENTS = {
    LEAD: 'Lead',
    COMPLETE_REGISTRATION: 'CompleteRegistration',
    CONTACT: 'Contact',
    SUBMIT_APPLICATION: 'SubmitApplication',
    VIEW_CONTENT: 'ViewContent',
    INITIATE_CHECKOUT: 'InitiateCheckout'
};

// ==========================================
// 7. ENHANCED ECOMMERCE (opcional)
// ==========================================
function trackEnhancedEcommerce(action, params = {}) {
    if (!window.gtag) return;
    
    switch (action) {
        case 'view_item':
            gtag('event', 'view_item', {
                items: [params.item]
            });
            break;
            
        case 'add_to_cart':
            gtag('event', 'add_to_cart', {
                items: [params.item]
            });
            break;
            
        case 'purchase':
            gtag('event', 'purchase', {
                transaction_id: params.transaction_id,
                value: params.value,
                currency: 'BRL',
                items: params.items
            });
            break;
    }
}

// ==========================================
// 8. SCROLL DEPTH TRACKING
// ==========================================
let scrollDepthMarkers = [25, 50, 75, 100];
let trackedScrollDepths = new Set();

function setupScrollTracking() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollPercentage = Math.round(
                    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                );
                
                scrollDepthMarkers.forEach(marker => {
                    if (scrollPercentage >= marker && !trackedScrollDepths.has(marker)) {
                        trackedScrollDepths.add(marker);
                        
                        trackEvent(EVENTS.SCROLL_DEPTH, {
                            scroll_depth: marker,
                            page_location: window.location.pathname
                        });
                    }
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// ==========================================
// 9. TIME ON PAGE
// ==========================================
let pageStartTime = Date.now();
let timeTracked = false;

function setupTimeTracking() {
    // Track após 30 segundos
    setTimeout(() => {
        if (!timeTracked) {
            const timeOnPage = Math.round((Date.now() - pageStartTime) / 1000);
            
            trackEvent(EVENTS.TIME_ON_PAGE, {
                time_seconds: timeOnPage,
                page_location: window.location.pathname
            });
            
            timeTracked = true;
        }
    }, 30000);
    
    // Track ao sair da página
    window.addEventListener('beforeunload', () => {
        const timeOnPage = Math.round((Date.now() - pageStartTime) / 1000);
        
        if (navigator.sendBeacon && window.gtag) {
            gtag('event', EVENTS.TIME_ON_PAGE, {
                time_seconds: timeOnPage,
                page_location: window.location.pathname,
                transport_type: 'beacon'
            });
        }
    });
}

// ==========================================
// 10. FORM TRACKING AUTOMÁTICO
// ==========================================
function setupFormTracking() {
    let formStarted = false;
    let currentFormStep = 1;
    
    // Detectar início do formulário
    const formInputs = document.querySelectorAll('#evaForm input, #evaForm textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            if (!formStarted) {
                trackEvent(EVENTS.FORM_START, {
                    form_name: 'lead_qualification'
                });
                
                trackFacebookEvent(FB_EVENTS.LEAD);
                
                formStarted = true;
            }
        }, { once: true });
    });
    
    // Track mudanças de step
    window.addEventListener('stepChanged', (e) => {
        currentFormStep = e.detail.step;
        
        trackEvent(EVENTS.FORM_STEP, {
            step_number: currentFormStep,
            step_name: e.detail.stepName
        });
    });
    
    // Detectar abandono
    window.addEventListener('beforeunload', () => {
        if (formStarted && currentFormStep < 4) {
            trackEvent(EVENTS.FORM_ABANDON, {
                abandoned_step: currentFormStep
            });
        }
    });
}

// ==========================================
// 11. CLICK TRACKING AUTOMÁTICO
// ==========================================
function setupClickTracking() {
    // Track todos os botões CTA
    document.querySelectorAll('.btn-primary, .btn-success').forEach(button => {
        button.addEventListener('click', (e) => {
            const buttonText = e.target.textContent.trim();
            
            trackEvent(EVENTS.CLICK_CTA, {
                button_text: buttonText,
                button_location: getElementPath(e.target)
            });
        });
    });
    
    // Track links externos
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const url = link.href;
            
            if (!url.includes(window.location.hostname)) {
                trackEvent(EVENTS.EXTERNAL_LINK, {
                    link_url: url,
                    link_text: link.textContent.trim()
                });
            }
        });
    });
    
    // Track WhatsApp
    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent(EVENTS.WHATSAPP_CLICK, {
                location: 'float_button'
            });
            
            trackFacebookEvent(FB_EVENTS.CONTACT, {
                content_name: 'WhatsApp Click'
            });
        });
    });
    
    // Track cliques em áreas
    document.querySelectorAll('.area-card').forEach(card => {
        card.addEventListener('click', () => {
            const areaName = card.querySelector('.area-title').textContent;
            
            trackEvent(EVENTS.AREA_CLICK, {
                area_name: areaName
            });
        });
    });
    
    // Track FAQ
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const questionText = question.textContent.trim();
            
            trackEvent(EVENTS.FAQ_OPEN, {
                question_text: questionText.substring(0, 100)
            });
        });
    });
}

// ==========================================
// 12. USER PROPERTIES
// ==========================================
function setUserProperties(properties) {
    if (window.gtag) {
        gtag('set', 'user_properties', properties);
    }
}

function identifyUser(userId, userProperties = {}) {
    if (window.gtag) {
        gtag('config', ANALYTICS_CONFIG.GA4_ID, {
            'user_id': userId
        });
        
        setUserProperties(userProperties);
    }
}

// ==========================================
// 13. CUSTOM DIMENSIONS
// ==========================================
function setCustomDimension(name, value) {
    if (window.gtag) {
        gtag('event', 'custom_dimension', {
            [name]: value
        });
    }
}

// Detectar UTM parameters
function trackUTMParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {};
    
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
        const value = urlParams.get(param);
        if (value) {
            utmParams[param] = value;
        }
    });
    
    if (Object.keys(utmParams).length > 0) {
        trackEvent('utm_parameters', utmParams);
        
        // Salvar em sessionStorage
        sessionStorage.setItem('utm_params', JSON.stringify(utmParams));
    }
}

// ==========================================
// 14. PERFORMANCE MONITORING
// ==========================================
function trackPerformance() {
    if ('performance' in window && 'PerformancePaintTiming' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const paintData = performance.getEntriesByType('paint');
                
                trackEvent('page_performance', {
                    load_time: Math.round(perfData.loadEventEnd - perfData.fetchStart),
                    dom_content_loaded: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
                    first_paint: paintData[0] ? Math.round(paintData[0].startTime) : 0,
                    first_contentful_paint: paintData[1] ? Math.round(paintData[1].startTime) : 0
                });
            }, 0);
        });
    }
}

// ==========================================
// 15. ERROR TRACKING
// ==========================================
function setupErrorTracking() {
    window.addEventListener('error', (e) => {
        trackEvent('javascript_error', {
            error_message: e.message,
            error_source: e.filename,
            error_line: e.lineno,
            error_column: e.colno
        });
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        trackEvent('promise_rejection', {
            error_message: e.reason
        });
    });
}

// ==========================================
// 16. HELPER FUNCTIONS
// ==========================================
function getElementPath(element) {
    const path = [];
    let current = element;
    
    while (current && current.tagName) {
        let selector = current.tagName.toLowerCase();
        
        if (current.id) {
            selector += '#' + current.id;
            path.unshift(selector);
            break;
        } else if (current.className) {
            selector += '.' + current.className.split(' ').join('.');
        }
        
        path.unshift(selector);
        current = current.parentElement;
        
        if (path.length > 5) break;
    }
    
    return path.join(' > ');
}

// ==========================================
// 17. INICIALIZAÇÃO AUTOMÁTICA
// ==========================================
function initAnalytics() {
    console.log('📊 Inicializando Analytics...');
    
    initGA4();
    trackUTMParameters();
    setupScrollTracking();
    setupTimeTracking();
    setupFormTracking();
    setupClickTracking();
    setupErrorTracking();
    trackPerformance();
    
    console.log('✅ Analytics configurado');
}

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalytics);
} else {
    initAnalytics();
}

// ==========================================
// 18. EXPORTS GLOBAIS
// ==========================================
window.analytics = {
    track: trackEvent,
    trackConversion: trackConversion,
    trackFacebook: trackFacebookEvent,
    setUserProperties: setUserProperties,
    identifyUser: identifyUser,
    setCustomDimension: setCustomDimension,
    EVENTS: EVENTS,
    FB_EVENTS: FB_EVENTS
};

console.log('✅ Analytics.js carregado com sucesso');
