// Seleção das áreas afetadas
const btnTopo = document.getElementById("btn-topo");

/**
 * Função para regressar ao topo da página suavemente
 * @param {Event} e Objeto de evento injetado pelo browser
 */function scroll_to_top(e) {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Função para mostrar o botão apenas se o utilizador fizer scroll para baixo (> 300px)
 */ 
function show_btn() {
    if (window.scrollY > 300) {
        btnTopo.style.display = "block";
    } else {
        btnTopo.style.display = "none";
    }
}

window.addEventListener("scroll", show_btn);
btnTopo.addEventListener("click", scroll_to_top);