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
