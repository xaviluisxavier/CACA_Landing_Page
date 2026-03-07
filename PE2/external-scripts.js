const form = document.querySelector('.contact-form');

const campos = ['name', 'email', 'subject', 'message']

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Captura de valores
    const email = document.getElementById('email').value;
    const nome = document.getElementById('name').value;    

    // Validação simples 
    if (!email.includes('@uac.pt') && !email.includes('@gmail.com')) {
        alert("Por favor, use um email válido."); 
        return;
    }

    if (!nome) {
        alert('Preencha o campo nome.');
        return;
    }

    confirm('Mandar mensagem?')
    alert('Mensagem enviada com sucesso!')
    for(let campo of campos) {
        document.getElementById(campo).value = '';}
});