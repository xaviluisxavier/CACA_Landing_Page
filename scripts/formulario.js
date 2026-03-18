export class ValidacaoFormulario {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.campos = Array.from(document.querySelectorAll('.form-group input, .form-group textarea, #subject'));
        
        this.config = {
            corValido: "4px solid #4CAF50",
            corInvalido: "4px solid #ff4d4d",
            dominiosPermitidos: ['uac.pt', 'gmail.com', 'outlook.com']
        };
    }

    iniciar() {
        if (!this.form) return;

        this.campos.forEach(campo => {
            campo.addEventListener('input', () => this.atualizarEstiloVisual(campo));
        });

        this.form.addEventListener('submit', (e) => this.validarSubmissao(e));
    }

    validarCampo(elemento) {
        const valor = elemento.value.trim();
        
        if (valor === "") {
            return false;
        }

        if (elemento.id === 'name') {
            if (valor.length >= 3) {
                return true;
            }
            return false;
        }

        if (elemento.id === 'email') {
            const partes = valor.split('@');
            if (partes.length === 2 && partes[0] !== "" && this.config.dominiosPermitidos.includes(partes[1])) {
                return true;
            }
            return false;
        }

        if (elemento.id === 'phone') {
            if (!isNaN(valor) && valor.startsWith('9') && valor.length === 9) {
                return true;
            }
            return false;
        }

        return elemento.checkValidity();
    }

    atualizarEstiloVisual(elemento) {
        if (elemento.value.trim() === "") {
            elemento.style.borderRight = "none";
            return;
        }
        
        if (this.validarCampo(elemento) === true) {
            elemento.style.borderRight = this.config.corValido;
        } else {
            elemento.style.borderRight = this.config.corInvalido;
        }
    }

    validarSubmissao(e) {
        e.preventDefault();

        const emailEl = document.getElementById('email');
        const nomeEl = document.getElementById('name');
        const phoneEl = document.getElementById('phone');
        const subjectEl = document.getElementById('subject');
        const messageEl = document.getElementById('message');

        if (!this.validarCampo(nomeEl)) {
            alert("Por favor, introduza um nome válido.");
            nomeEl.focus(); 
            return;
        }
        if (!this.validarCampo(emailEl)) {
            alert("Email inválido. Apenas domínios @uac.pt, @gmail.com ou @outlook.com.");
            emailEl.focus(); 
            return;
        }
        if (!this.validarCampo(phoneEl)) {
            alert("Telemóvel inválido. Deve ter 9 dígitos e começar por 9.");
            phoneEl.focus(); 
            return;
        }
        if (!this.validarCampo(subjectEl) || !this.validarCampo(messageEl)) {
            alert("Por favor, preencha o assunto e a mensagem."); 
            return;
        }

        if (confirm('Deseja enviar a mensagem?')) {
            alert('Mensagem enviada com sucesso!');
            this.form.reset(); 
            this.campos.forEach(campo => campo.style.borderRight = "none");
        }
    }
}
