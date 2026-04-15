/**
 * @module eventos-page
 * @description Renderiza os eventos na landing page (index.html).
 * Integra APIs de meteorologia (OpenWeatherMap) e mapas (Leaflet/OpenStreetMap).
 */

import { obterTodosEventos } from './eventos.js';

/**
 * A meteorologia agora usa a API Open-Meteo (100% gratuita, sem necessidade de chave).
 */

/**
 * Inicializa a secção de eventos na landing page.
 * Carrega os eventos da IndexedDB e renderiza os cards com mapa e meteorologia.
 * @returns {Promise<void>}
 */
export async function initEventosPage() {
    const container = document.getElementById('eventosGrid');
    if (!container) return;

    // Loading skeletons
    container.innerHTML = Array(3).fill(`
        <div class="evento-skeleton">
            <div class="skeleton-map"></div>
            <div class="skeleton-body">
                <div class="skeleton-line medium"></div>
                <div class="skeleton-line short"></div>
                <div class="skeleton-line"></div>
            </div>
        </div>
    `).join('');

    try {
        const eventos = await obterTodosEventos();

        if (eventos.length === 0) {
            container.innerHTML = `
                <div class="eventos-empty" style="grid-column: 1 / -1;">
                    <div class="empty-icon">📅</div>
                    <p>Não existem eventos agendados de momento.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';

        for (const evento of eventos) {
            const card = criarCardEvento(evento);
            container.appendChild(card);

            const mapContainer = card.querySelector('.evento-mapa');
            const meteoContainer = card.querySelector('.evento-meteo');

            if (evento.lat && evento.lng) {
                // Tem as coordenadas dadas manualmente no admin
                if (mapContainer) inicializarMapa(mapContainer, evento.lat, evento.lng, evento.local);
                if (meteoContainer) carregarMeteo(meteoContainer, evento.lat, evento.lng);
            } else if (evento.local) {
                // Não tem coords, descobrir online pelo nome offline (Geocoding)
                pesquisarCoordenadas(evento.local).then(coords => {
                    if (coords) {
                        if (mapContainer) inicializarMapa(mapContainer, coords.lat, coords.lng, evento.local);
                        if (meteoContainer) carregarMeteo(meteoContainer, coords.lat, coords.lng);
                    } else {
                        // Se falhou a descoberta das coordenadas (ex: local inexistente)
                        if (mapContainer) {
                            mapContainer.innerHTML = `<div class="evento-mapa-placeholder"><i class="fi fi-rr-marker"></i> ${escapeHtml(evento.local)}</div>`;
                        }
                        if (meteoContainer) {
                            meteoContainer.innerHTML = `<div class="evento-meteo-error"><i class="fi fi-rr-cloud-disabled"></i> Sem previsão</div>`;
                        }
                    }
                }).catch(err => {
                    console.warn(err);
                    if (meteoContainer) meteoContainer.innerHTML = `<div class="evento-meteo-error"><i class="fi fi-rr-cloud-disabled"></i> Erro de rede</div>`;
                });
            } else {
                if (meteoContainer) meteoContainer.innerHTML = `<div class="evento-meteo-error"><i class="fi fi-rr-cloud-disabled"></i> Sem local</div>`;
            }
        }

    } catch (err) {
        console.error('Erro ao carregar eventos:', err);
        container.innerHTML = `
            <div class="eventos-empty" style="grid-column: 1 / -1;">
                <div class="empty-icon">⚠️</div>
                <p>Erro ao carregar eventos.</p>
            </div>
        `;
    }
}

/**
 * Procura latitude e longitude a partir do nome de um local usando a API da Open-Meteo.
 * @param {string} local 
 * @returns {Promise<{lat: number, lng: number}|null>}
 */
async function pesquisarCoordenadas(local) {
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(local)}&count=1&language=pt&format=json`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            return { lat: parseFloat(data.results[0].latitude), lng: parseFloat(data.results[0].longitude) };
        }
    } catch (err) {
        console.warn('Geocoding falhou:', err);
    }
    return null;
}

/**
 * Cria o elemento HTML de um card de evento.
 * @param {Object} evento - Dados do evento.
 * @returns {HTMLElement} O elemento do card.
 */
function criarCardEvento(evento) {
    const card = document.createElement('article');
    card.className = 'evento-card';
    card.setAttribute('tabindex', '0');

    const dataFormatada = evento.data
        ? new Date(evento.data + 'T00:00:00').toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })
        : 'Sem data';

    const temCoordenadas = evento.lat && evento.lng;

    card.innerHTML = `
        <div class="evento-mapa">
            ${!temCoordenadas ? `
                <div class="evento-mapa-placeholder">
                    <i class="fi fi-rr-marker"></i> ${escapeHtml(evento.local)}
                </div>
            ` : ''}
        </div>
        <div class="evento-body">
            <h3>${escapeHtml(evento.titulo)}</h3>
            <div class="evento-info">
                <span><i class="fi fi-rr-calendar"></i> ${dataFormatada}</span>
                ${evento.hora ? `<span><i class="fi fi-rr-clock"></i> ${evento.hora}</span>` : ''}
                <span><i class="fi fi-rr-marker"></i> ${escapeHtml(evento.local)}</span>
            </div>
            ${evento.descricao ? `<p class="evento-descricao">${escapeHtml(evento.descricao)}</p>` : ''}
            <div class="evento-meteo">
                <div class="evento-meteo-loading"><div class="spinner-small"></div> A carregar previsão...</div>
            </div>
        </div>
    `;

    return card;
}

/**
 * Inicializa um mini-mapa Leaflet num contentor.
 * @param {HTMLElement} container - O elemento onde desenhar o mapa.
 * @param {number} lat - Latitude.
 * @param {number} lng - Longitude.
 * @param {string} label - Texto para o popup do marcador.
 * @returns {void}
 */
function inicializarMapa(container, lat, lng, label) {
    if (!container || typeof L === 'undefined') {
        if (container) {
            container.innerHTML = `<div class="evento-mapa-placeholder"><i class="fi fi-rr-marker"></i> ${escapeHtml(label)}</div>`;
        }
        return;
    }

    try {
        const map = L.map(container, {
            scrollWheelZoom: false,
            dragging: false,
            zoomControl: false,
            attributionControl: false
        }).setView([lat, lng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);

        L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`<strong>${escapeHtml(label)}</strong>`);

        // Fix para o mapa carregar corretamente
        setTimeout(() => map.invalidateSize(), 200);

    } catch (err) {
        console.error('Erro ao inicializar mapa:', err);
        container.innerHTML = `<div class="evento-mapa-placeholder"><i class="fi fi-rr-marker"></i> ${escapeHtml(label)}</div>`;
    }
}

/**
 * Traduz o código WMO da Open-Meteo para um icon e descrição.
 * @param {number} code 
 * @returns {{icon: string, desc: string}}
 */
function interpretarClima(code) {
    if (code === 0) return { icon: '☀️', desc: 'Céu limpo' };
    if (code >= 1 && code <= 3) return { icon: '🌤️', desc: 'Parcialmente nublado' };
    if (code === 45 || code === 48) return { icon: '🌫️', desc: 'Nevoeiro' };
    if (code >= 51 && code <= 57) return { icon: '🌧️', desc: 'Chuviscos' };
    if (code >= 61 && code <= 67) return { icon: '🌧️', desc: 'Chuva' };
    if (code >= 71 && code <= 77) return { icon: '❄️', desc: 'Neve' };
    if (code >= 80 && code <= 82) return { icon: '🌦️', desc: 'Aguaceiros' };
    if (code >= 85 && code <= 86) return { icon: '🌨️', desc: 'Aguaceiros de neve' };
    if (code >= 95 && code <= 99) return { icon: '⛈️', desc: 'Trovoada' };
    return { icon: '☁️', desc: 'Indisponível' };
}

/**
 * Carrega a temperatura atual via Open-Meteo (API Gratuita, s/ chave).
 * @param {HTMLElement} container - O elemento onde mostrar a meteorologia.
 * @param {number} lat - Latitude.
 * @param {number} lng - Longitude.
 * @returns {Promise<void>}
 */
async function carregarMeteo(container, lat, lng) {
    if (!container || !lat || !lng) return;

    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
        const response = await fetch(url);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        const clima = interpretarClima(data.current_weather.weathercode);
        const temp = Math.round(data.current_weather.temperature);

        container.innerHTML = `
            <div style="font-size: 2.2rem; line-height: 1;">${clima.icon}</div>
            <div class="evento-meteo-info">
                <span class="evento-meteo-temp">${temp}°C</span>
                <span class="evento-meteo-desc">${clima.desc}</span>
            </div>
        `;
    } catch (err) {
        console.error('Erro meteorologia:', err);
        container.innerHTML = `<div class="evento-meteo-error"><i class="fi fi-rr-cloud"></i> Erro ao carregar</div>`;
    }
}

/**
 * Escapa HTML para prevenir XSS.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
}
