/**
 * @module admin
 * @description Lógica da página de administração do CACA.
 * Gere CRUD de eventos e renderização da lista.
 */

import { adicionarEvento, obterTodosEventos, obterEvento, editarEvento, removerEvento } from './eventos.js';
import { STORE_NEWSLETTER, getAllRecords, deleteRecord } from './db.js';

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

// ─── Newsletter: Subscritores ───────────────────────────────────

const DB_NAME = 'CACA_Database';
const STORE_NAME = 'subscritores_newsletter';

/**
 * Abre o IndexedDB partilhado com o GestorNewsletter.
 * @returns {Promise<IDBDatabase>}
 */
function abrirDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'email' });
            }
        };
        req.onsuccess = (e) => resolve(e.target.result);
        req.onerror = (e) => reject(e.target.error);
    });
}

/**
 * Obtém todos os subscritores do IndexedDB.
 * @returns {Promise<Array>}
 */
async function obterSubscritores() {
    const db = await abrirDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = (e) => reject(e.target.error);
    });
}

/**
 * Remove um subscritor pelo email.
 * @param {string} email
 * @returns {Promise<void>}
 */
async function removerSubscritor(email) {
    const db = await abrirDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(email);
        req.onsuccess = () => resolve();
        req.onerror = (e) => reject(e.target.error);
    });
}

// ─── Newsletter  

/** Renderiza a tabela de subscritores. */
async function renderizarSubscritores() {
    const subscribersList = document.getElementById('subscribersList');
    const subscriberCount = document.getElementById('subscriberCount');
    try {
        const lista = await getAllRecords(STORE_NEWSLETTER);
        subscriberCount.textContent = lista.length;

        if (lista.length === 0) {
            subscribersList.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state-td">
                        <span class="empty-icon">📭</span>
                        <p>Nenhum subscritor ainda</p>
                    </td>
                </tr>`;
            return;
        }

        subscribersList.innerHTML = lista.map((s, i) => {
            const data = s.dataSubscricao
                ? new Date(s.dataSubscricao).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                : '—';
            return `
                <tr>
                    <td>${i + 1}</td>
                    <td>${escapeHtml(s.nome)}</td>
                    <td><a href="mailto:${escapeHtml(s.email)}">${escapeHtml(s.email)}</a></td>
                    <td>${data}</td>
                    <td>
                        <button class="btn-delete btn-unsub" data-id="${s.id}" data-email="${escapeHtml(s.email)}" title="Remover subscritor">
                            <i class="fi fi-rr-trash"></i>
                        </button>
                    </td>
                </tr>`;
        }).join('');

        subscribersList.querySelectorAll('.btn-unsub').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!confirm(`Remover subscritor ${btn.dataset.email}?`)) return;
                
                // Usa o db.js para apagar!
                await deleteRecord(STORE_NEWSLETTER, Number(btn.dataset.id));
                showToast('Subscritor removido.', 'info');
                renderizarSubscritores();
            });
        });
    } catch (err) {
        console.error(err);
        subscribersList.innerHTML = '<tr><td colspan="5" style="color:#D32F2F;">Erro ao carregar subscritores.</td></tr>';
    }
}

/** Exporta a lista de subscritores como ficheiro CSV. */
async function exportarCSV() {
    const lista = await getAllRecords(STORE_NEWSLETTER);
    if (lista.length === 0) { showToast('Sem subscritores para exportar.', 'info'); return; }

    const cabecalho = 'Nome,Email,Data de Subscrição';
    const linhas = lista.map(s => `"${s.nome}","${s.email}","${s.dataSubscricao || ''}"`);
    const csv = [cabecalho, ...linhas].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscritores_newsletter_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exportado com sucesso!', 'success');
}

document.getElementById('btnExportCSV').addEventListener('click', exportarCSV);
renderizarSubscritores();