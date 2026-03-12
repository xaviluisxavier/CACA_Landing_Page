// Seleção de elementos do DOM para o menu mobile
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

// Adiciona o evento de clique para alternar a visibilidade do menu em dispositivos móveis
function toggle_menu() {
    mainNav.classList.toggle('active');
}

menuToggle.addEventListener('click', toggle_menu);