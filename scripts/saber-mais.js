// Seleção do botão "Saber Mais" 
const saberMaisButton = document.getElementById('SaberMais');

// Adiciona evento para revelar a secção de investigação
saberMaisButton.addEventListener('click', (e) => {
    const areasDeInvestigacao = document.getElementById('investigacao');
    e.preventDefault(); // Previne o comportamento padrão do botão
    
    // Alterna a classe 'visible' que aciona a transição CSS de expansão
    areasDeInvestigacao.classList.toggle('visible');

    // Se a secção ficou visível, faz scroll suave até ela após um pequeno atraso
    if (areasDeInvestigacao.classList.contains('visible')) {
        setTimeout(() => {
            areasDeInvestigacao.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
});