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
                if (mapEl) { mapEl.id = mapId; renderizarMapa(mapId, evento.lat, evento.lng, evento.local); }
                // Meteo via lat/lon directo (Open-Meteo)
                carregarMeteoCoords(meteoContainer, evento.lat, evento.lng);
            } else if (evento.local) {
                // Sem coords — usar getWeatherByCity do colega (devolve coords + meteo de uma só vez)
                getWeatherByCity(evento.local)
                    .then(dados => {
                        // Renderizar mapa com as coords que vieram da API OpenWeatherMap
                        const mapId = `mapa-${evento.id}`;
                        if (mapEl) { mapEl.id = mapId; renderizarMapa(mapId, dados.coords.lat, dados.coords.lon, evento.local); }
                        // Mostrar meteo com os dados já recebidos
                        mostrarMeteo(meteoContainer, dados);
                    })
                    .catch(err => {
                        console.warn('getWeatherByCity falhou:', err);
                        if (mapEl) mapEl.innerHTML = `<div class="evento-mapa-placeholder"><i class="fi fi-rr-marker"></i> ${escapeHtml(evento.local)}</div>`;
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

    const dataFormatada = evento.data
        ? new Date(evento.data + 'T00:00:00').toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })
        : 'Sem data';

    const temDescricao = evento.descricao && evento.descricao.trim().length > 0;

    card.innerHTML = `
        <div class="evento-mapa"></div>
        <div class="evento-body">
            <span class="evento-date-badge">
                <i class="fi fi-rr-calendar"></i> ${dataFormatada}
            </span>
            <h3>${escapeHtml(evento.titulo)}</h3>
            <div class="evento-info">
                ${evento.hora ? `<span><i class="fi fi-rr-clock"></i> ${evento.hora}</span>` : ''}
                <span><i class="fi fi-rr-marker"></i> ${escapeHtml(evento.local)}</span>
            </div>
            ${temDescricao ? `
            <div class="evento-descricao-wrapper">
                <p class="evento-descricao" id="desc-${evento.id}">${escapeHtml(evento.descricao)}</p>
                <button type="button" class="btn-ver-mais" id="btn-desc-${evento.id}" aria-expanded="false">
                    Ver mais <i class="fi fi-rr-angle-small-down"></i>
                </button>
            </div>` : ''}
            <div class="evento-meteo">
                <div class="evento-meteo-loading"><div class="spinner-small"></div> A carregar previsão...</div>
            </div>
        </div>
    `;

    // Botão "Ver mais / Ver menos"
    if (temDescricao) {
        const descEl = card.querySelector(`#desc-${evento.id}`);
        const btnEl  = card.querySelector(`#btn-desc-${evento.id}`);

        // Mostrar botão apenas se o conteúdo exceder o max-height definido no CSS
        const checkOverflow = () => {
            const maxH = parseFloat(getComputedStyle(descEl).maxHeight) || 0;
            if (descEl.scrollHeight > maxH + 2) {
                btnEl.style.display = 'inline-flex';
            }
        };
        requestAnimationFrame(checkOverflow);

        btnEl.addEventListener('click', () => {
            const expanded = descEl.classList.toggle('expanded');
            btnEl.setAttribute('aria-expanded', expanded);
            btnEl.innerHTML = expanded
                ? 'Ver menos <i class="fi fi-rr-angle-small-up"></i>'
                : 'Ver mais <i class="fi fi-rr-angle-small-down"></i>';
        });
    }

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
        <img src="${dados.iconeUrl}" alt="${dados.descricao}" style="width:48px;height:48px;">
        <div class="evento-meteo-info">
            <span class="evento-meteo-temp">${dados.temperatura}°C</span>
            <span class="evento-meteo-desc">${dados.descricao}</span>
            <span style="font-size:0.8rem;color:var(--color-gray)">💧 ${dados.humidade}% | 💨 ${dados.vento} m/s</span>
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
