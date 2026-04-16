/**
 * Classe responsável pela gestão, validação e submissão da subscrição da newsletter.
 * Baseado na estrutura do ValidacaoFormulario, mas com integração ao IndexedDB.
 */
export class GestorNewsletter {
    /**
     * Inicializa as configurações, base de dados e seleciona os elementos do DOM.
     */
    constructor() {
        // Configurações da Base de Dados (IndexedDB)
        this.dbName = 'CACA_Database';
        this.dbVersion = 1;
        this.storeName = 'subscritores_newsletter';
        this.db = null;
        
        // Elementos do DOM
        this.form = document.getElementById('newsletter-form');
        // Seleciona apenas os inputs de texto e email do formulário da newsletter
        this.campos = Array.from(document.querySelectorAll('#newsletter-form input'));
        this.feedbackEl = document.getElementById('newsletter-feedback');
        
        // Configurações visuais (exatamente iguais às do formulário de contacto)
        this.config = {
            corValido: "4px solid #4CAF50",
            corInvalido: "4px solid #ff4d4d"
        };
    }

     /**
     * Inicia os event listeners e abre a base de dados.
     * @returns {void}
     */
    iniciar() {
        if (!this.form) return;

        this.inicializarBaseDeDados();

        // Validação em tempo real
        this.campos.forEach(campo => {
            campo.addEventListener('input', () => this.atualizarEstiloVisual(campo));
        });

        this.form.addEventListener('submit', (e) => this.validarSubmissao(e));
    }

    /**
     * Inicializa a ligação ao IndexedDB.
     */
    inicializarBaseDeDados() {
        const request = indexedDB.open(this.dbName, this.dbVersion);

        request.onupgradeneeded = (event) => {
            this.db = event.target.result;
            // Cria a tabela se não existir, usando o email como chave única para evitar duplicados
            if (!this.db.objectStoreNames.contains(this.storeName)) {
                this.db.createObjectStore(this.storeName, { keyPath: 'email' });
            }
        };

        request.onsuccess = (event) => { this.db = event.target.result; };
        request.onerror = (event) => { console.error("Erro no IndexedDB:", event.target.errorCode); };
    }

    /**
     * Valida um campo individual com base no seu id.
     * @param {HTMLElement} elemento - O elemento de input a validar.
     * @returns {boolean} True se o campo for válido, False caso contrário.
     */
    validarCampo(elemento) {
        const valor = elemento.value.trim();
        
        if (valor === "") return false;

        // Validação do Nome da Newsletter
        if (elemento.id === 'news-name') {
            return valor.length >= 3;
        }

        // Validação do Email da Newsletter (Mesmo Regex do Formulário)
        if (elemento.id === 'news-email') {
            const regexEmail = /^[^\s@]+@(uac\.pt|gmail\.com|outlook\.com)$/i;
            return regexEmail.test(valor);
        }

        return elemento.checkValidity();
    }

    /**
     * Atualiza a borda visual do campo (verde para válido, vermelho para inválido).
     * @param {HTMLElement} elemento - O elemento a ser estilizado.
     * @returns {void}
     */
    atualizarEstiloVisual(elemento) {
        if (elemento.value.trim() === "") {
            elemento.style.borderRight = "none";
            return;
        }
        
        elemento.style.borderRight = this.validarCampo(elemento) 
            ? this.config.corValido 
            : this.config.corInvalido;
    }

    /**
     * Mostra o feedback visual em vez de usar window.alert().
     */
    mostrarFeedback(mensagem, sucesso) {
        this.feedbackEl.textContent = mensagem;
        this.feedbackEl.className = 'feedback-message show ' + (sucesso ? 'feedback-success' : 'feedback-error');
        
        setTimeout(() => {
            this.feedbackEl.classList.remove('show');
        }, 5000);
    }

     /**
     * Lida com o evento de submissão do formulário, validando todos os campos antes de guardar.
     * @param {Event} e - O evento de submissão do formulário.
     * @returns {void}
     */
    validarSubmissao(e) {
        e.preventDefault();

        const nomeEl = document.getElementById('news-name');
        const emailEl = document.getElementById('news-email');

        // Validações idênticas às do formulário, mas com feedback visual
        if (!this.validarCampo(nomeEl)) {
            this.mostrarFeedback("Por favor, introduza um nome válido.", false);
            nomeEl.focus(); return;
        }
        
        if (!this.validarCampo(emailEl)) {
            this.mostrarFeedback("Email inválido. Apenas domínios @uac.pt, @gmail.com ou @outlook.com.", false);
            emailEl.focus(); return;
        }

        const novoSubscritor = {
            nome: nomeEl.value.trim(),
            email: emailEl.value.trim().toLowerCase(),
            dataSubscricao: new Date().toISOString()
        };

        this.guardarSubscritor(novoSubscritor);
    }

    /**
     * Guarda os dados no IndexedDB.
     */
    guardarSubscritor(subscritor) {
        if (!this.db) {
            this.mostrarFeedback('Erro de sistema. Por favor, tente mais tarde.', false);
            return;
        }

        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.add(subscritor);

        request.onsuccess = () => {
            this.mostrarFeedback('Subscrição realizada com sucesso! Bem-vindo(a).', true);
            this.form.reset(); 
            this.campos.forEach(campo => campo.style.borderRight = "none");
        };

        request.onerror = (event) => {
            if (event.target.error.name === 'ConstraintError') {
                this.mostrarFeedback('Este endereço de email já se encontra subscrito!', false);
            } else {
                this.mostrarFeedback('Ocorreu um erro ao processar a sua subscrição.', false);
            }
        };
    }
}