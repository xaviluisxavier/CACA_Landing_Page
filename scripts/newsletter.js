/**
 * Classe responsável pela gestão, validação e submissão da subscrição da newsletter.
 * Estrutura e lógica baseadas no ValidacaoFormulario.
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
        
        this.form = document.getElementById('newsletter-form');
        this.campos = Array.from(document.querySelectorAll('#newsletter-form input'));
        
        this.config = {
            corValido: "4px solid #4CAF50",
            corInvalido: "4px solid #ff4d4d"
        };
    }

     /**
     * Inicia os event listeners do formulário, validação em tempo real e base de dados.
     * @returns {void}
     */
    iniciar() {
        if (!this.form) return;

        this.inicializarBaseDeDados();

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

        if (elemento.id === 'news-name') {
            return valor.length >= 3;
        }

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
     * Lida com o evento de submissão do formulário, validando todos os campos antes de enviar.
     * @param {Event} e - O evento de submissão do formulário.
     * @returns {void}
     */
    validarSubmissao(e) {
        e.preventDefault();

        const nomeEl = document.getElementById('news-name');
        const emailEl = document.getElementById('news-email');

        if (!this.validarCampo(nomeEl)) {
            alert("Por favor, introduza um nome válido.");
            nomeEl.focus(); return;
        }
        
        if (!this.validarCampo(emailEl)) {
            alert("Email inválido. Apenas domínios @uac.pt, @gmail.com ou @outlook.com.");
            emailEl.focus(); return;
        }

        if (confirm(`Deseja subscrever a newsletter com o email ${emailEl.value}?`)) {
            const novoSubscritor = {
                nome: nomeEl.value.trim(),
                email: emailEl.value.trim().toLowerCase(),
                dataSubscricao: new Date().toISOString()
            };

            this.guardarSubscritor(novoSubscritor);
        }
    }

    /**
     * Guarda os dados no IndexedDB e emite os alertas finais.
     */
    guardarSubscritor(subscritor) {
        if (!this.db) {
            alert('Erro de sistema. Por favor, tente mais tarde.');
            return;
        }

        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.add(subscritor);

        request.onsuccess = () => {
            alert('Subscrição realizada com sucesso!');
            this.form.reset(); 
            this.campos.forEach(campo => campo.style.borderRight = "none");
        };

        request.onerror = (event) => {
            if (event.target.error.name === 'ConstraintError') {
                alert('Este endereço de email já se encontra subscrito!');
            } else {
                alert('Ocorreu um erro ao processar a sua subscrição.');
            }
        };
    }
}
