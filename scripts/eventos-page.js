/**
 * @module eventos-page
 * @description Renderiza os eventos na landing page (index.html).
 * Integra as funções de meteorologia (meteorologia.js) e mapas (mapa.js).
 */

import { obterTodosEventos } from './eventos.js';
import { getWeatherByCity } from './meteorologia.js';
import { renderizarMapa } from './mapa.js';

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

            const mapEl = card.querySelector('.evento-mapa');
            const meteoContainer = card.querySelector('.evento-meteo');

            if (evento.lat && evento.lng) {
                // Coords manuais fornecidas pelo admin — usar directamente
                const mapId = `mapa-${evento.id}`;
                const mapContainer = document.createElement('div');
                mapContainer.id = mapId;
                mapContainer.style.width = '100%';
                mapContainer.style.height = '100%';
                mapEl.insertBefore(mapContainer, mapEl.firstChild);
                renderizarMapa(mapId, evento.lat, evento.lng, evento.local);
                // Meteo via lat/lon directo (Open-Meteo)
                carregarMeteoCoords(meteoContainer, evento.lat, evento.lng);
            } else if (evento.local) {
                // Sem coords — usar getWeatherByCity do colega (devolve coords + meteo de uma só vez)
                getWeatherByCity(evento.local)
                    .then(dados => {
                        // Renderizar mapa com as coords que vieram da API OpenWeatherMap
                        const mapId = `mapa-${evento.id}`;
                        const mapContainer = document.createElement('div');
                        mapContainer.id = mapId;
                        mapContainer.style.width = '100%';
                        mapContainer.style.height = '100%';
                        mapEl.insertBefore(mapContainer, mapEl.firstChild);
                        renderizarMapa(mapId, dados.coords.lat, dados.coords.lon, evento.local);
                        // Mostrar meteo com os dados já recebidos
                        mostrarMeteo(meteoContainer, dados);
                    })
                    .catch(err => {
                        console.warn('getWeatherByCity falhou:', err);
                        const placeholder = document.createElement('div');
                        placeholder.className = 'evento-mapa-placeholder';
                        placeholder.innerHTML = `<i class="fi fi-rr-marker"></i> ${escapeHtml(evento.local)}`;
                        mapEl.insertBefore(placeholder, mapEl.firstChild);
                        if (meteoContainer) meteoContainer.innerHTML = `<div class="evento-meteo-error"><i class="fi fi-rr-cloud-disabled"></i> Sem previsão</div>`;
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
 * Cria o elemento HTML de um card de evento.
 * @param {Object} evento - Dados do evento.
 * @returns {HTMLElement} O elemento do card.
 */
function criarCardEvento(evento) {
    const card = document.createElement('article');
    card.className = 'evento-card';
    card.setAttribute('tabindex', '0');

    let dateBadgeHtml = '<span class="evento-date-badge"><i class="fi fi-rr-calendar"></i> Sem data</span>';
    if (evento.data) {
        const d = new Date(evento.data + 'T00:00:00');
        const day = d.toLocaleDateString('pt-PT', { day: '2-digit' });
        const month = d.toLocaleDateString('pt-PT', { month: 'short' }).replace('.', '').toUpperCase();
        dateBadgeHtml = `
            <div class="evento-date-block">
                <span class="date-day">${day}</span>
                <span class="date-month">${month}</span>
            </div>
        `;
    }

    const temDescricao = evento.descricao && evento.descricao.trim().length > 0;

    card.innerHTML = `
        <div class="evento-mapa">
            ${dateBadgeHtml}
        </div>
        <div class="evento-body">
            <h3>${escapeHtml(evento.titulo)}</h3>
            <div class="evento-info">
                ${evento.hora ? `<span><i class="fi fi-rr-clock"></i> ${evento.hora}</span>` : ''}
                <span><i class="fi fi-rr-marker"></i> ${escapeHtml(evento.local)}</span>
            </div>
            <div class="evento-descricao-wrapper">
                <div class="evento-descricao" id="desc-${evento.id}">${temDescricao ? escapeHtml(evento.descricao) : ''}</div>
            </div>
            <button type="button" class="btn-ver-mais" id="btn-desc-${evento.id}" aria-expanded="false">
                Ver mais <i class="fi fi-rr-angle-small-down"></i>
            </button>
            <div class="evento-meteo">
                <div class="evento-meteo-loading"><div class="spinner-small"></div> A carregar previsão...</div>
            </div>
        </div>
    `;

    // Botão "Ver mais / Ver menos"
    // Use a more robust check for whether text needs expanding
    // Timeout is necessary to wait for DOM to fully render the text and calculate line wraps
    setTimeout(() => {
        const descEl = card.querySelector(`#desc-${evento.id}`);
        const btnEl  = card.querySelector(`#btn-desc-${evento.id}`);
        if(!descEl || !btnEl) return;
        
        if (!temDescricao) return;

        // Determine if the text actually spans more than 3 lines
        // We check the unconstrained height by cloning it temporarily
        const clone = descEl.cloneNode(true);
        clone.style.display = 'block';
        clone.style.webkitLineClamp = 'unset';
        clone.style.position = 'absolute';
        clone.style.visibility = 'hidden';
        clone.style.height = 'auto';
        clone.style.maxHeight = 'none';
        descEl.parentNode.appendChild(clone);
        
        const realHeight = clone.clientHeight;
        const clampedHeight = descEl.clientHeight;
        
        descEl.parentNode.removeChild(clone);

        // If real height is greater than the clamped height, show the button
        // A clamped block typically has height ~77px (3 * 1.7 * 15.2px)
        if (realHeight > clampedHeight + 2) { 
            btnEl.style.visibility = 'visible';
            card.querySelector('.evento-descricao-wrapper').classList.add('has-overflow');
        }

            btnEl.addEventListener('click', () => {
                const expanded = descEl.classList.toggle('expanded');
                
                // Add expanded class to wrapper to remove fade effect
                const wrapperEl = card.querySelector('.evento-descricao-wrapper');
                if (expanded) {
                    wrapperEl.classList.add('expanded');
                    // Add margin bottom to button so it doesn't stick to the weather pill
                    btnEl.style.marginBottom = '2rem';
                } else {
                    wrapperEl.classList.remove('expanded');
                    btnEl.style.marginBottom = '1.5rem';
                }
                
                btnEl.setAttribute('aria-expanded', expanded);
                btnEl.innerHTML = expanded
                    ? 'Ver menos <i class="fi fi-rr-angle-small-up"></i>'
                    : 'Ver mais <i class="fi fi-rr-angle-small-down"></i>';
                
                // Optional: Scroll slightly if closing so user doesn't lose context
                if(!expanded) {
                    descEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        }, 150); // Increased timeout slightly to ensure font loading is done

    return card;
}

/**
 * Mostra os dados meteorológicos devolvidos pelo getWeatherByCity do colega.
 * @param {HTMLElement} container
 * @param {Object} dados - Objeto devolvido por getWeatherByCity
 */
function mostrarMeteo(container, dados) {
    if (!container) return;
    container.innerHTML = `
        <img src="${dados.iconeUrl}" alt="${dados.descricao}">
        <div class="evento-meteo-info">
            <span class="evento-meteo-temp">${dados.temperatura}°C</span>
            <span class="evento-meteo-desc">${dados.descricao}</span>
        </div>
    `;
}

/**
 * Fallback para quando o admin forneceu coords manuais.
 * Vai buscar meteo via Open-Meteo (sem necessidade de API key).
 * @param {HTMLElement} container
 * @param {number} lat
 * @param {number} lng
 */
async function carregarMeteoCoords(container, lat, lng) {
    if (!container) return;
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        const cw = data.current_weather;
        container.innerHTML = `
            <div class="evento-meteo-info">
                <span class="evento-meteo-temp">${Math.round(cw.temperature)}°C</span>
                <span class="evento-meteo-desc">Vento ${cw.windspeed} km/h</span>
            </div>
        `;
    } catch (err) {
        container.innerHTML = `<div class="evento-meteo-error"><i class="fi fi-rr-cloud-disabled"></i> Sem previsão</div>`;
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
