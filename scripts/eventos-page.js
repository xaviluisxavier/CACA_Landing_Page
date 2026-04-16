/**
 * @module eventos-page
 * @description Renderiza os eventos na landing page (index.html).
 * Integra as funções de meteorologia (meteorologia.js) e mapas (mapa.js).
 */

import { obterTodosEventos } from './eventos.js';
import { getWeatherByCity, getWeatherByCoords } from './meteorologia.js';
import { renderizarMapa } from './mapa.js';

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
            const meteoContainer = card.querySelector('.evento-meteo-wrapper');

            if (evento.lat && evento.lng) {
                const mapId = `mapa-${evento.id}`;
                if (mapEl) { mapEl.id = mapId; renderizarMapa(mapId, evento.lat, evento.lng, evento.local); }
                
                getWeatherByCoords(evento.lat, evento.lng)
                    .then(dados => mostrarMeteo(meteoContainer, dados))
                    .catch(err => {
                        console.warn('getWeatherByCoords falhou:', err);
                        if (meteoContainer) meteoContainer.innerHTML = `<div class="evento-meteo-error"><i class="fi fi-rr-cloud-disabled"></i> Sem previsão</div>`;
                    });

            } else if (evento.local) {
                getWeatherByCity(evento.local)
                    .then(dados => {
                        const mapId = `mapa-${evento.id}`;
                        if (mapEl) { mapEl.id = mapId; renderizarMapa(mapId, dados.coords.lat, dados.coords.lon, evento.local); }
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
 * Cria o HTML do Card formatado
 */
function criarCardEvento(evento) {
    const card = document.createElement('article');
    card.className = 'evento-card';
    card.setAttribute('tabindex', '0');

    // 1. Tratamento da Data Flutuante
    let dateBadgeHtml = '';
    if (evento.data) {
        const d = new Date(evento.data + 'T00:00:00');
        const day = d.toLocaleDateString('pt-PT', { day: '2-digit' });
        const month = d.toLocaleDateString('pt-PT', { month: 'short' }).replace('.', '').toUpperCase();
        dateBadgeHtml = `
            <div class="caca-date-badge">
                <div class="d-day">${day}</div>
                <div class="d-month">${month}</div>
            </div>
        `;
    }

    // 2. Construção do HTML
    card.innerHTML = `
        <div class="evento-mapa-container">
            <div class="evento-mapa"></div>
            ${dateBadgeHtml} </div>
        
        <div class="evento-body">
            <h3>${escapeHtml(evento.titulo)}</h3>
            <div class="evento-info">
                ${evento.hora ? `<span><i class="fi fi-rr-clock"></i> ${evento.hora}</span>` : ''}
                <span><i class="fi fi-rr-marker"></i> ${escapeHtml(evento.local)}</span>
            </div>
            
            ${evento.descricao ? `<p class="evento-descricao">${escapeHtml(evento.descricao)}</p>` : ''}
            
            <div class="evento-meteo-wrapper">
                <div class="evento-meteo-loading"><div class="spinner-small"></div></div>
            </div>
        </div>
    `;

    return card;
}

/**
 * Formata a caixa da meteorologia com Ícone
 */
function mostrarMeteo(container, dados) {
    if (!container) return;
    
    // Converte vento para Km/H se necessário
    const ventoKmh = (dados.vento * 3.6).toFixed(1);

    container.innerHTML = `
        <div class="weather-pill">
            <img src="${dados.iconeUrl}" alt="${dados.descricao}" class="weather-icon">
            <div class="weather-info">
                <div class="weather-temp">${dados.temperatura}<span>ºC</span></div>
                <div class="weather-wind">Vento ${ventoKmh} Km/H</div>
            </div>
        </div>
    `;
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
}