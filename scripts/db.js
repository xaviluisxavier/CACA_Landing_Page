/**
 * @module db
 * @description Módulo central de IndexedDB para a aplicação CACA.
 * Gere a base de dados local com object stores para Eventos e Newsletter.
 * Todas as operações são assíncronas e retornam Promises.
 */

const DB_NAME = 'CACA_DB';
const DB_VERSION = 1;

/** @type {string} Nome do object store de eventos */
export const STORE_EVENTOS = 'eventos';
/** @type {string} Nome do object store de newsletter */
export const STORE_NEWSLETTER = 'newsletter';

/**
 * Abre (ou cria) a base de dados IndexedDB.
 * Configura os object stores e índices na primeira execução ou upgrade.
 * @returns {Promise<IDBDatabase>} A instância da base de dados aberta.
 */
export function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Object store: Eventos
            if (!db.objectStoreNames.contains(STORE_EVENTOS)) {
                const eventosStore = db.createObjectStore(STORE_EVENTOS, {
                    keyPath: 'id',
                    autoIncrement: true
                });
                eventosStore.createIndex('titulo', 'titulo', { unique: false });
                eventosStore.createIndex('data', 'data', { unique: false });
                eventosStore.createIndex('local', 'local', { unique: false });
            }

            // Object store: Newsletter
            if (!db.objectStoreNames.contains(STORE_NEWSLETTER)) {
                const newsletterStore = db.createObjectStore(STORE_NEWSLETTER, {
                    keyPath: 'id',
                    autoIncrement: true
                });
                newsletterStore.createIndex('email', 'email', { unique: true });
            }
        };
    });
}

/**
 * Adiciona um novo registo a um object store.
 * @param {string} storeName - Nome do object store (ex: 'eventos').
 * @param {Object} record - O objeto a guardar.
 * @returns {Promise<number>} O ID gerado para o novo registo.
 */
export async function addRecord(storeName, record) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.add(record);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        tx.oncomplete = () => db.close();
    });
}

/**
 * Obtém todos os registos de um object store.
 * @param {string} storeName - Nome do object store.
 * @returns {Promise<Array<Object>>} Lista de todos os registos.
 */
export async function getAllRecords(storeName) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        tx.oncomplete = () => db.close();
    });
}

/**
 * Obtém um registo específico pelo seu ID.
 * @param {string} storeName - Nome do object store.
 * @param {number} id - O ID do registo a obter.
 * @returns {Promise<Object|undefined>} O registo encontrado ou undefined.
 */
export async function getRecord(storeName, id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        tx.oncomplete = () => db.close();
    });
}

/**
 * Atualiza um registo existente num object store.
 * O objeto fornecido deve conter o campo 'id' (keyPath).
 * @param {string} storeName - Nome do object store.
 * @param {Object} record - O objeto atualizado (deve incluir o id).
 * @returns {Promise<number>} O ID do registo atualizado.
 */
export async function updateRecord(storeName, record) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.put(record);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        tx.oncomplete = () => db.close();
    });
}

/**
 * Remove um registo de um object store pelo seu ID.
 * @param {string} storeName - Nome do object store.
 * @param {number} id - O ID do registo a remover.
 * @returns {Promise<void>}
 */
export async function deleteRecord(storeName, id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
        tx.oncomplete = () => db.close();
    });
}
