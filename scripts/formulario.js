// Seleção do formulário e dos campos
const form = document.querySelector('.contact-form');
const camposParaMonitorizar = document.querySelectorAll('.form-group input, .form-group textarea, #subject');

/**
 * @param {HTMLElement} elemento O campo a ser validado
 * @returns {boolean} True se for válido, False se for inválido
 */
function validarCampo(elemento) {
    const valor = elemento.value.trim();

    // Se o campo estiver vazio, não é válido
    if (valor === "") {
        return false;
    }

    // Validação de NOME
    if (elemento.id === 'name') {
        if (valor.length >= 3) {
            return true;
        }
        return false;
    }

    // Validação de EMAIL
    if (elemento.id === 'email') {
        const dominiosPermitidos = ['uac.pt', 'gmail.com', 'outlook.com'];
        const partes = valor.split('@');
        
        // Verifica se tem 2 partes, se a primeira não é vazia e se o domínio está na lista
        if (partes.length === 2 && partes[0] !== "" && dominiosPermitidos.includes(partes[1])) {
            return true;
        }
        return false;
    }

    // Validação de TELEMÓVEL
    if (elemento.id === 'phone') {
        // Verifica se é número, se começa por 9 e se tem EXATAMENTE 9 dígitos
        if (!isNaN(valor) && valor.startsWith('9') && valor.length === 9) {
            return true;
        }
        return false;
    }

    // Para os outros campos (Assunto e Mensagem) basta usar a validação nativa do HTML
    return elemento.checkValidity();
}

/**
 * Aplica as cores Verde/Vermelho ou limpa a borda
 */
function atualizarEstiloVisual(elemento) {
    if (elemento.value.trim() === "") {
        elemento.style.borderRight = "none";
        return;
    }

    if (validarCampo(elemento)) {
        elemento.style.borderRight = "4px solid #4CAF50"; // Verde
    } else {
        elemento.style.borderRight = "4px solid #ff4d4d"; // Vermelho
    }
}

camposParaMonitorizar.forEach(campo => {
    campo.addEventListener('input', () => {
        atualizarEstiloVisual(campo);
    });
});

/**
 * 2. Função de Submissão do Formulário
 */
function validar_formulario(e) {
    e.preventDefault();

    const emailEl = document.getElementById('email');
    const nomeEl = document.getElementById('name');
    const phoneEl = document.getElementById('phone');
    const subjectEl = document.getElementById('subject');
    const messageEl = document.getElementById('message');

    // Verificação de segurança antes de enviar
    if (!validarCampo(nomeEl)) {
        alert("Por favor, introduza um nome válido.");
        nomeEl.focus();
        return;
    }

    if (!validarCampo(emailEl)) {
        alert("Email inválido. Apenas domínios @uac.pt, @gmail.com ou @outlook.com.");
        emailEl.focus();
        return;
    }

    if (!validarCampo(phoneEl)) {
        alert("Telemóvel inválido. Deve ter 9 dígitos e começar por 9.");
        phoneEl.focus();
        return;
    }

    if (!validarCampo(subjectEl) || !validarCampo(messageEl)) {
        alert("Por favor, preencha o assunto e a mensagem.");
        return;
    }

    // Confirmação final
    const confirmacao = confirm('Deseja enviar a mensagem?');
    if (confirmacao) {
        alert('Mensagem enviada com sucesso!');
        
        // reset do formulário
        form.reset(); 
        
        // Remove as cores de todos os campos após o reset
        camposParaMonitorizar.forEach(campo => {
            campo.style.borderRight = "none";
        });
    }
}

// Associar a função ao evento de submit
form.addEventListener('submit', validar_formulario);
