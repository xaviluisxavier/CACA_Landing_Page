/**
 * @module eventos
 * @description Motor CRUD para gestão de eventos do CACA.
 * Utiliza o módulo db.js para persistência em IndexedDB.
 */

import { STORE_EVENTOS, addRecord, getAllRecords, getRecord, updateRecord, deleteRecord } from './db.js';

/**
 * Adiciona um novo evento à base de dados.
 * @param {Object} evento - Dados do evento.
 * @param {string} evento.titulo - Título do evento.
 * @param {string} evento.data - Data do evento (formato YYYY-MM-DD).
 * @param {string} evento.hora - Hora do evento (formato HH:MM).
 * @param {string} evento.local - Nome da cidade/local.
 * @param {number} [evento.lat] - Latitude (para API de mapas).
 * @param {number} [evento.lng] - Longitude (para API de mapas).
 * @param {string} evento.descricao - Descrição do evento.
 * @returns {Promise<number>} O ID gerado.
 */
export async function adicionarEvento(evento) {
    const novoEvento = {
        ...evento,
        criadoEm: new Date().toISOString()
    };
    return await addRecord(STORE_EVENTOS, novoEvento);
}

/**
 * Obtém todos os eventos guardados, ordenados por data (mais próximos primeiro).
 * @returns {Promise<Array<Object>>} Lista de eventos ordenados.
 */
export async function obterTodosEventos() {
    const eventos = await getAllRecords(STORE_EVENTOS);
    return eventos.sort((a, b) => new Date(a.data) - new Date(b.data));
}

/**
 * Obtém um evento específico pelo ID.
 * @param {number} id - O ID do evento.
 * @returns {Promise<Object|undefined>} O evento encontrado.
 */
export async function obterEvento(id) {
    return await getRecord(STORE_EVENTOS, id);
}

/**
 * Edita um evento existente.
 * @param {number} id - O ID do evento a editar.
 * @param {Object} dadosAtualizados - Os campos a atualizar.
 * @returns {Promise<number>} O ID do evento atualizado.
 */
export async function editarEvento(id, dadosAtualizados) {
    const eventoExistente = await getRecord(STORE_EVENTOS, id);
    if (!eventoExistente) {
        throw new Error(`Evento com ID ${id} não encontrado.`);
    }
    const eventoAtualizado = {
        ...eventoExistente,
        ...dadosAtualizados,
        id: id,
        atualizadoEm: new Date().toISOString()
    };
    return await updateRecord(STORE_EVENTOS, eventoAtualizado);
}

/**
 * Remove um evento pelo seu ID.
 * @param {number} id - O ID do evento a remover.
 * @returns {Promise<void>}
 */
export async function removerEvento(id) {
    return await deleteRecord(STORE_EVENTOS, id);
}
