// Seleção do botão "Saber Mais" 
const saberMaisButton = document.getElementById('SaberMais');

// Adiciona evento para revelar a secção de investigação
function saber_mais(e) {
    const areasDeInvestigacao = document.getElementById('investigacao');
    e.preventDefault(); // Previne o comportamento padrão do botão
    
    // Alterna a classe 'visible' que aciona a transição CSS de expansão
    areasDeInvestigacao.classList.toggle('visible');

    function show () {
        areasDeInvestigacao.scrollIntoView({ behavior: 'smooth' });
    }

    // Se a secção ficou visível, faz scroll suave até ela após um pequeno atraso
    if (areasDeInvestigacao.classList.contains('visible')) {
        setTimeout(show, 100);
    }
}

saberMaisButton.addEventListener('click', saber_mais);