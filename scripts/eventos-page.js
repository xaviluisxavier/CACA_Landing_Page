import { obterTodosEventos } from './eventos.js';
import { getWeatherByCity, getWeatherByCoords } from './meteorologia.js';
import { renderizarMapa } from './mapa.js';

export async function initEventosPage() {
    const container = document.getElementById('eventosGrid');
    if (!container) return;

    container.innerHTML = '';
    const tplSkel = document.getElementById('tpl-evento-skeleton');
    for(let i=0; i<3; i++) container.appendChild(tplSkel.content.cloneNode(true));

    try {
        const eventos = await obterTodosEventos();
        if (eventos.length === 0) {
            // 2. Uso do template em vez de innerHTML
            container.replaceChildren(); 
            const tplEmpty = document.getElementById('tpl-eventos-empty');
            container.appendChild(tplEmpty.content.cloneNode(true));
            return;
        }

        container.innerHTML = '';
        for (const evento of eventos) {
            const cardFragment = criarCardEvento(evento);
            const cardEl = cardFragment.querySelector('.evento-card'); 
            container.appendChild(cardFragment);

            const mapEl = cardEl.querySelector('.evento-mapa');
            const meteoContainer = cardEl.querySelector('.evento-meteo-wrapper');

            if (evento.lat && evento.lng) {
                const mapId = `mapa-${evento.id}`;
                mapEl.id = mapId;
                renderizarMapa(mapId, evento.lat, evento.lng, evento.local);
                getWeatherByCoords(evento.lat, evento.lng)
                    .then(d => mostrarMeteo(meteoContainer, d))
                    .catch(() => meteoContainer.innerHTML = 'Erro meteo');
            }
        }
    } catch (err) { container.innerHTML = 'Erro ao carregar.'; }
}

function criarCardEvento(evento) {
    const tpl = document.getElementById('tpl-evento-card');
    const clone = tpl.content.cloneNode(true);

    // Preencher Data
    if (evento.data) {
        const d = new Date(evento.data + 'T00:00:00');
        clone.querySelector('.d-day').textContent = d.toLocaleDateString('pt-PT', { day: '2-digit' });
        clone.querySelector('.d-month').textContent = d.toLocaleDateString('pt-PT', { month: 'short' }).toUpperCase();
    }

    clone.querySelector('.evento-titulo').textContent = evento.titulo;
    clone.querySelector('.evento-local').textContent = evento.local;
    
    const horaWrapper = clone.querySelector('.evento-hora-wrapper');
    if (evento.hora) clone.querySelector('.evento-hora').textContent = evento.hora;
    else horaWrapper.remove();

    if (evento.descricao) clone.querySelector('.evento-descricao').textContent = evento.descricao;
    else clone.querySelector('.evento-descricao').remove();

    return clone;
}

/**
 * Desenha os dados da meteorologia no cartão do evento.
 */
function mostrarMeteo(container, dados) {
    container.innerHTML = '';

    const tpl = document.getElementById('tpl-meteo');
    const clone = tpl.content.cloneNode(true);

    const img = clone.querySelector('.meteo-icon');
    if (dados.iconeUrl) {
        img.src = dados.iconeUrl;
        img.alt = dados.descricao;
    } else {
        img.remove(); 
    }

    const ventoKmH = Math.round(dados.vento * 3.6);
    
    clone.querySelector('.m-val').textContent = dados.temperatura;
    clone.querySelector('.m-desc').textContent = dados.descricao;
    clone.querySelector('.m-vento').textContent = ventoKmH;

    container.appendChild(clone);
}