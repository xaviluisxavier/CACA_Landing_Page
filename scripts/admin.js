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
            eventsList.innerHTML = ''; // Limpa a lista
            const tplEmpty = document.getElementById('tpl-empty-eventos');
            eventsList.appendChild(tplEmpty.content.cloneNode(true));
            return;
        }

        // Limpa a lista antes de adicionar
        eventsList.innerHTML = ''; 
        const tpl = document.getElementById('tpl-admin-evento');

        eventos.forEach(ev => {
            // Faz uma cópia do molde
            const clone = tpl.content.cloneNode(true);

            // Preenche os dados de forma segura
            clone.querySelector('.evento-titulo').textContent = ev.titulo;

            // Formata a data
            const dataFormatada = ev.data
                ? new Date(ev.data + 'T00:00:00').toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
                : 'Sem data';
            clone.querySelector('.evento-data').textContent = dataFormatada;

            // Lógica da Hora
            const horaWrapper = clone.querySelector('.evento-hora-wrapper');
            if (ev.hora) {
                clone.querySelector('.evento-hora').textContent = ev.hora;
            } else {
                horaWrapper.remove();
            }

            clone.querySelector('.evento-local').textContent = ev.local;

            // Lógica da Descrição
            const descEl = clone.querySelector('.event-desc');
            if (ev.descricao) {
                descEl.textContent = ev.descricao;
            } else {
                descEl.remove();
            }

            const btnEdit = clone.querySelector('.btn-edit');
            const btnDelete = clone.querySelector('.btn-delete');

            btnEdit.addEventListener('click', () => iniciarEdicao(ev.id));
            btnDelete.addEventListener('click', () => confirmarRemocao(ev.id));

            // Cola a cópia pronta na lista
            eventsList.appendChild(clone);
        });

    } catch (err) {
        console.error(err);
        eventsList.innerHTML = '<p>Erro ao carregar eventos.</p>';
    }
}

// ─── Newsletter ───────────────────────────────────────────────

async function renderizarSubscritores() {
    const list = document.getElementById('subscribersList');
    const countEl = document.getElementById('subscriberCount');
    const tpl = document.getElementById('tpl-sub-row');
    const lista = await getAllRecords(STORE_NEWSLETTER);
    
    if (countEl) {
        countEl.textContent = lista.length;
    }
    
    list.innerHTML = '';

    if (lista.length === 0) {
        const tplEmpty = document.getElementById('tpl-empty-subscritores');
        list.appendChild(tplEmpty.content.cloneNode(true));
        return;
    }

    lista.forEach((s, i) => {
        const clone = tpl.content.cloneNode(true);
        clone.querySelector('.col-num').textContent = i + 1;
        clone.querySelector('.col-nome').textContent = s.nome;
        clone.querySelector('.col-email').textContent = s.email;
        clone.querySelector('.col-data').textContent = new Date(s.dataSubscricao).toLocaleDateString('pt-PT');
        
        const btn = clone.querySelector('.btn-unsub');
        btn.addEventListener('click', async () => {
            if(confirm('Remover este subscritor?')) {
                await deleteRecord(STORE_NEWSLETTER, s.id);
                renderizarSubscritores();
            }
        });
        
        list.appendChild(clone);
    });
}

export function initAdminPage() {
    // 1. Atribuir os Event Listeners
    if (eventoForm) eventoForm.addEventListener('submit', onSubmitEvento);
    if (btnCancel) btnCancel.addEventListener('click', resetForm);
    
    const btnExport = document.getElementById('btnExportCSV');
    if (btnExport) {
        btnExport.addEventListener('click', async () => {
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
    }

    // 2. Arrancar com a renderização dos dados
    renderizarEventos();
    renderizarSubscritores();
}

// 3. Só chama a função quando o HTML (DOM) estiver carregado
document.addEventListener('DOMContentLoaded', initAdminPage);

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
