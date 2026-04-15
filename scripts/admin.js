/**
 * @module admin
 * @description Lógica da página de administração do CACA.
 * Gere CRUD de eventos e renderização da lista.
 */

import { adicionarEvento, obterTodosEventos, obterEvento, editarEvento, removerEvento } from './eventos.js';

/** @type {number|null} ID do evento em edição, null se estiver a criar */
let editandoId = null;

// ─── Elementos do DOM ──────────────────────────────────────────

const adminArea = document.getElementById('adminArea');

const eventoForm = document.getElementById('eventoForm');
const formTitle = document.getElementById('formTitle');
const inputTitulo = document.getElementById('evTitulo');
const inputData = document.getElementById('evData');
const inputHora = document.getElementById('evHora');
const inputLocal = document.getElementById('evLocal');
const inputLat = document.getElementById('evLat');
const inputLng = document.getElementById('evLng');
const inputDescricao = document.getElementById('evDescricao');
const btnSave = document.getElementById('btnSave');
const btnCancel = document.getElementById('btnCancel');

const eventsList = document.getElementById('eventsList');
const eventCount = document.getElementById('eventCount');
const toastContainer = document.getElementById('toastContainer');

// ─── CRUD de Eventos ───────────────────────────────────────────

/**
 * Submissão do formulário — adiciona ou edita um evento.
 * @param {Event} e - Evento de submissão.
 * @returns {Promise<void>}
 */
async function onSubmitEvento(e) {
    e.preventDefault();

    const dados = {
        titulo: inputTitulo.value.trim(),
        data: inputData.value,
        hora: inputHora.value,
        local: inputLocal.value.trim(),
        lat: inputLat.value ? parseFloat(inputLat.value) : null,
        lng: inputLng.value ? parseFloat(inputLng.value) : null,
        descricao: inputDescricao.value.trim()
    };

    // Validação básica
    if (!dados.titulo || !dados.data || !dados.local) {
        showToast('Preencha o título, data e local.', 'error');
        return;
    }

    try {
        if (editandoId !== null) {
            await editarEvento(editandoId, dados);
            showToast('Evento atualizado com sucesso!', 'success');
        } else {
            await adicionarEvento(dados);
            showToast('Evento criado com sucesso!', 'success');
        }
        resetForm();
        await renderizarEventos();
    } catch (err) {
        console.error(err);
        showToast('Erro ao guardar o evento.', 'error');
    }
}

/**
 * Carrega os dados de um evento no formulário para edição.
 * @param {number} id - O ID do evento a editar.
 * @returns {Promise<void>}
 */
async function iniciarEdicao(id) {
    try {
        const evento = await obterEvento(id);
        if (!evento) return;

        editandoId = id;
        inputTitulo.value = evento.titulo || '';
        inputData.value = evento.data || '';
        inputHora.value = evento.hora || '';
        inputLocal.value = evento.local || '';
        inputLat.value = evento.lat || '';
        inputLng.value = evento.lng || '';
        inputDescricao.value = evento.descricao || '';

        formTitle.textContent = '✏️ Editar Evento';
        btnSave.textContent = 'Atualizar Evento';
        btnCancel.classList.add('visible');

        // scroll para o formulário
        document.querySelector('.form-panel').scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
        console.error(err);
        showToast('Erro ao carregar evento.', 'error');
    }
}

/**
 * Remove um evento após confirmação.
 * @param {number} id - O ID do evento a remover.
 * @returns {Promise<void>}
 */
async function confirmarRemocao(id) {
    if (!confirm('Tem a certeza que deseja remover este evento?')) return;

    try {
        await removerEvento(id);
        showToast('Evento removido.', 'info');

        // Se estava a editar este evento, limpar o form
        if (editandoId === id) resetForm();

        await renderizarEventos();
    } catch (err) {
        console.error(err);
        showToast('Erro ao remover evento.', 'error');
    }
}

/**
 * Limpa o formulário e volta ao modo de criação.
 * @returns {void}
 */
function resetForm() {
    editandoId = null;
    eventoForm.reset();
    formTitle.textContent = '➕ Novo Evento';
    btnSave.textContent = 'Guardar Evento';
    btnCancel.classList.remove('visible');
}

// ─── Renderização ──────────────────────────────────────────────

/**
 * Renderiza a lista de eventos na interface da admin.
 * @returns {Promise<void>}
 */
async function renderizarEventos() {
    try {
        const eventos = await obterTodosEventos();
        eventCount.textContent = eventos.length;

        if (eventos.length === 0) {
            eventsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📭</div>
                    <p>Nenhum evento criado</p>
                    <small>Use o formulário ao lado para adicionar o primeiro evento.</small>
                </div>
            `;
            return;
        }

        eventsList.innerHTML = eventos.map(ev => {
            const dataFormatada = ev.data
                ? new Date(ev.data + 'T00:00:00').toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
                : 'Sem data';

            return `
                <div class="event-card-admin" data-id="${ev.id}">
                    <div class="event-card-top">
                        <h3>${escapeHtml(ev.titulo)}</h3>
                    </div>
                    <div class="event-meta">
                        <span><i class="fi fi-rr-calendar"></i> ${dataFormatada}</span>
                        ${ev.hora ? `<span><i class="fi fi-rr-clock"></i> ${ev.hora}</span>` : ''}
                        <span><i class="fi fi-rr-marker"></i> ${escapeHtml(ev.local)}</span>
                    </div>
                    ${ev.descricao ? `<p class="event-desc">${escapeHtml(ev.descricao)}</p>` : ''}
                    <div class="event-card-actions">
                        <button class="btn-edit" data-id="${ev.id}"><i class="fi fi-rr-edit"></i> Editar</button>
                        <button class="btn-delete" data-id="${ev.id}"><i class="fi fi-rr-trash"></i> Remover</button>
                    </div>
                </div>
            `;
        }).join('');

        // Event delegation para os botões
        eventsList.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => iniciarEdicao(Number(btn.dataset.id)));
        });
        eventsList.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => confirmarRemocao(Number(btn.dataset.id)));
        });

    } catch (err) {
        console.error(err);
        eventsList.innerHTML = '<p style="color:#D32F2F;">Erro ao carregar eventos.</p>';
    }
}

// ─── Utilitários ───────────────────────────────────────────────

/**
 * Escapa HTML para prevenir XSS.
 * @param {string} str - O texto a escapar.
 * @returns {string} Texto seguro para inserção no DOM.
 */
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Mostra uma notificação toast temporária.
 * @param {string} message - Texto da notificação.
 * @param {'success'|'error'|'info'} type - Tipo de toast.
 * @returns {void}
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ─── Event Listeners ───────────────────────────────────────────

eventoForm.addEventListener('submit', onSubmitEvento);
btnCancel.addEventListener('click', resetForm);

// Renderizar eventos diretamente ao carregar
renderizarEventos();

