const btnTopo = document.getElementById("btn-topo");

// Evento de clique para regressar ao topo da página suavemente
function scroll_to_top(e) {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Mostra o botão apenas se o utilizador fizer scroll para baixo (> 300px)
function show_btn() {
    if (window.scrollY > 300) {
        btnTopo.style.display = "block";
    } else {
        btnTopo.style.display = "none";
    }
}

window.addEventListener("scroll", show_btn);
btnTopo.addEventListener("click", scroll_to_top);