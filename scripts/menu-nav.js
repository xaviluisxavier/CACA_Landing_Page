/**
 * Inicializa os controlos do menu de navegação responsivo (versão mobile).
 * Associa o evento de clique ao botão "hambúrguer" para abrir ou fechar o menu.
 * @returns {void}
 */
export function initMenuNav() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }
}
