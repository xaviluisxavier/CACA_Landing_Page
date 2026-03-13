// Seleção das áreas afetadas
const saberMaisButton = document.getElementById('SaberMais');
const areasDeInvestigacao = document.getElementById('investigacao');
   
/**
* Função para revelar a secção de investigação
* @param {Event} e Objeto de evento injetado pelo browser
*/
function saber_mais(e) {
    e.preventDefault(); // Evita o recarregamento da página na submissão
    
    // Alterna a classe 'visible'
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