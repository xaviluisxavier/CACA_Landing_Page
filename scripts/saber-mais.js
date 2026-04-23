/**
 * Inicializa o comportamento do botão "Saber Mais".
 * Quando clicado, revela a secção "Áreas de Investigação" com uma transição suave
 * e faz o scroll automático da página até essa área.
 * @returns {void}
 */
export function initSaberMais() {
    const saberMaisButton = document.getElementById('SaberMais');
    const areasDeInvestigacao = document.getElementById('investigacao');
       
    if (saberMaisButton && areasDeInvestigacao) {
        saberMaisButton.addEventListener('click', (e) => {
            e.preventDefault(); 
            areasDeInvestigacao.classList.toggle('visible');

            if (areasDeInvestigacao.classList.contains('visible')) {
                setTimeout(() => {
                    areasDeInvestigacao.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        });
    }
}
