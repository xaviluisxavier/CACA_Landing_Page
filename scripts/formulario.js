// Seleção das áreas afetadas
const form = document.querySelector('.contact-form');

/**
 * Função para validar mensagem e simular mensagem enviada 
 * @param {Event} e Objeto de evento injetado pelo browser
 */ 
function validar_formulario(e) {
    e.preventDefault(); // Evita o recarregamento da página na submissão
    
    const campos = ['name', 'email','phone', 'address', 'subject', 'message'];
    
    // Obtem os valores introduzidos pelo utilizador
    const email = document.getElementById('email').value;
    const nome = document.getElementById('name').value;
    const telemovel = document.getElementById('phone').value;

    // Valida Email: Apenas aceita domínios específicos
    if (!email.endsWith('@uac.pt') && !email.endsWith('@gmail.com') && !email.endsWith('@outlook.com')) {
        alert("Por favor, use um email válido (@uac.pt, @gmail.com ou @outlook.com)."); 
        return;
    }

    // Valida Nome: Verifica se o campo não está vazio
    if (!nome) {
        alert('Preencha o campo nome.');
        return;
    }

    // Valida Telemóvel: Verifica se é número, tem 9 dígitos e começa por '9'
    if (telemovel && (isNaN(telemovel) || telemovel.length != 9 || !telemovel.startsWith('9'))) {
        alert('Insira um telemóvel válido (9 dígitos, a começar por 9).');
        return;
    }

    // Pedido de confirmação ao utilizador antes de simular o envio
    let confirmacao = confirm('Deseja enviar a mensagem?');
    if (confirmacao){
        alert('Mensagem enviada com sucesso!'); // Feedback visual de sucesso
        
        // Limpa todos os campos do formulário
        for(let campo of campos) {
            document.getElementById(campo).value = '';
        }
    }
}

form.addEventListener('submit', validar_formulario);