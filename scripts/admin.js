/**
 * @module admin
 * @description Lógica da página de administração do CACA.
 * Gere CRUD de eventos e subscritores da newsletter usando o db.js.
 */

import { adicionarEvento, obterTodosEventos, obterEvento, editarEvento, removerEvento } from './eventos.js';
import { STORE_NEWSLETTER, getAllRecords, deleteRecord } from './db.js';

/** @type {number|null} ID do evento em edição */
let editandoId = null;

// ─── Elementos do DOM ──────────────────────────────────────────
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

        document.querySelector('.form-panel').scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
        showToast('Erro ao carregar evento.', 'error');
    }
}

async function confirmarRemocao(id) {
    if (!confirm('Tem a certeza que deseja remover este evento?')) return;
    try {
        await removerEvento(id);
        showToast('Evento removido.', 'info');
        if (editandoId === id) resetForm();
        await renderizarEventos();
    } catch (err) {
        showToast('Erro ao remover evento.', 'error');
    }
}

function resetForm() {
    editandoId = null;
    eventoForm.reset();
    formTitle.textContent = '➕ Novo Evento';
    btnSave.textContent = 'Guardar Evento';
    btnCancel.classList.remove('visible');
}

async function renderizarEventos() {
    try {
        const eventos = await obterTodosEventos();
        eventCount.textContent = eventos.length;

        if (eventos.length === 0) {
            eventsList.innerHTML = '<div class="empty-state"><p>Nenhum evento criado</p></div>';
            return;
        }

        eventsList.innerHTML = eventos.map(ev => {
            const dataFormatada = ev.data
                ? new Date(ev.data + 'T00:00:00').toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
                : 'Sem data';

            return `
                <div class="event-card-admin">
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

        eventsList.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => iniciarEdicao(Number(btn.dataset.id)));
        });
        eventsList.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => confirmarRemocao(Number(btn.dataset.id)));
        });

    } catch (err) {
        eventsList.innerHTML = '<p>Erro ao carregar eventos.</p>';
    }
}

// ─── Newsletter ───────────────────────────────────────────────

async function renderizarSubscritores() {
    const subscribersList = document.getElementById('subscribersList');
    const subscriberCount = document.getElementById('subscriberCount');
    try {
        const lista = await getAllRecords(STORE_NEWSLETTER);
        subscriberCount.textContent = lista.length;

        if (lista.length === 0) {
            subscribersList.innerHTML = '<tr><td colspan="5">Nenhum subscritor</td></tr>';
            return;
        }

        subscribersList.innerHTML = lista.map((s, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${escapeHtml(s.nome)}</td>
                <td>${escapeHtml(s.email)}</td>
                <td>${new Date(s.dataSubscricao).toLocaleDateString('pt-PT')}</td>
                <td>
                    <button class="btn-delete btn-unsub" data-id="${s.id}">
                        <i class="fi fi-rr-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        subscribersList.querySelectorAll('.btn-unsub').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!confirm('Remover este subscritor?')) return;
                await deleteRecord(STORE_NEWSLETTER, Number(btn.dataset.id));
                showToast('Subscritor removido.', 'info');
                renderizarSubscritores();
            });
        });
    } catch (err) {
        subscribersList.innerHTML = '<tr><td colspan="5">Erro ao carregar subscritores.</td></tr>';
    }
}

// Event Listeners e Inicialização
eventoForm.addEventListener('submit', onSubmitEvento);
btnCancel.addEventListener('click', resetForm);
document.getElementById('btnExportCSV')?.addEventListener('click', async () => {
    const lista = await getAllRecords(STORE_NEWSLETTER);
    if (lista.length === 0) return;
    const csv = 'Nome,Email\n' + lista.map(s => `"${s.nome}","${s.email}"`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscritores.csv';
    a.click();
});

renderizarEventos();
renderizarSubscritores();

// Utilitários
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
