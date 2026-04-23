/**
 * Classe responsável pela gestão, validação e submissão do formulário de contacto.
 */
export class ValidacaoFormulario {
    /**
     * Inicializa as configurações e seleciona os elementos do DOM.
     */
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.campos = Array.from(document.querySelectorAll('.form-group input, .form-group textarea, #subject'));
        this.subjectEl = document.getElementById('subject');
        this.messageEl = document.getElementById('message');
        
        this.config = {
            corValido: "4px solid #4CAF50",
            corInvalido: "4px solid #ff4d4d"
        };

        // Mensagens pré-definidas para cada assunto do dropdown
        this.mensagensPreDefinidas = {
            "Informações Gerais": "Gostaria de obter mais informações gerais sobre o Centro Académico Clínico dos Açores.",
            "Estágios e Oportunidades": "Tenho interesse nas oportunidades de estágio. Poderiam enviar-me os requisitos?",
            "Parcerias": "Represento uma instituição e gostaríamos de explorar uma potencial parceria convosco.",
            "Apoio": "Necessito de apoio em relação a..."
        };
    }

     /**
     * Inicia os event listeners do formulário, incluindo a validação em tempo real e a mudança de assunto.
     * @returns {void}
     */
    iniciar() {
        if (!this.form) return;

        this.campos.forEach(campo => {
            campo.addEventListener('input', () => this.atualizarEstiloVisual(campo));
        });

        // Event listener para alterar a mensagem automaticamente consoante o assunto
        if (this.subjectEl && this.messageEl) {
            this.subjectEl.addEventListener('change', (e) => {
                const assuntoSelecionado = e.target.value;
                // Só substitui se a caixa estiver vazia ou já tiver uma das mensagens padrão
                const mensagemAtual = this.messageEl.value.trim();
                if (mensagemAtual === "" || Object.values(this.mensagensPreDefinidas).includes(mensagemAtual)) {
                    this.messageEl.value = this.mensagensPreDefinidas[assuntoSelecionado] || "";
                    this.atualizarEstiloVisual(this.messageEl);
                }
            });
        }

        this.form.addEventListener('submit', (e) => this.validarSubmissao(e));
    }

    /**
     * Valida um campo individual com base no seu tipo/id.
     * @param {HTMLElement} elemento - O elemento de input/textarea a validar.
     * @returns {boolean} True se o campo for válido, False caso contrário.
     */
    validarCampo(elemento) {
        const valor = elemento.value.trim();
        
        if (valor === "") return false;

        if (elemento.id === 'name') {
            return valor.length >= 3;
        }

        if (elemento.id === 'email') {
            const regexEmail = /^[^\s@]+@(uac\.pt|gmail\.com|outlook\.com)$/i;
            return regexEmail.test(valor);
        }

        if (elemento.id === 'phone') {
            const indicativo = document.getElementById('country-code').value;
            if (isNaN(valor)) return false;

            if (indicativo === '+351') {
                return valor.startsWith('9') && valor.length === 9;
            } else {
                return valor.length >= 8 && valor.length <= 15;
            }
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

        const emailEl = document.getElementById('email');
        const nomeEl = document.getElementById('name');
        const phoneEl = document.getElementById('phone');
        const subjectEl = document.getElementById('subject');
        const indicativoEl = document.getElementById('country-code');

        if (!this.validarCampo(nomeEl)) {
            alert("Por favor, introduza um nome válido.");
            nomeEl.focus(); return;
        }
        if (!this.validarCampo(emailEl)) {
            alert("Email inválido. Apenas domínios @uac.pt, @gmail.com ou @outlook.com.");
            emailEl.focus(); return;
        }
        if (!this.validarCampo(phoneEl)) {
            if (indicativoEl.value === '+351') {
                alert("Telemóvel inválido. Em Portugal, deve ter 9 dígitos e começar por 9.");
            } else {
                alert("Número de telefone internacional inválido. Verifique se tem entre 8 a 15 dígitos.");
            }
            phoneEl.focus(); return;
        }
        if (!this.validarCampo(subjectEl) || !this.validarCampo(this.messageEl)) {
            alert("Por favor, preencha o assunto e a mensagem."); return;
        }

        if (confirm(`Deseja enviar a mensagem?`)) {
            alert('Mensagem enviada com sucesso!');
            this.form.reset(); 
            this.campos.forEach(campo => campo.style.borderRight = "none");
        }
    }
}
