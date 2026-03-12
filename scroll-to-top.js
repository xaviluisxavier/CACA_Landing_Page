const btnTopo = document.getElementById("btn-topo");

// Evento de clique para regressar ao topo da página suavemente
btnTopo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Mostra o botão apenas se o utilizador fizer scroll para baixo (> 300px)
window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        btnTopo.style.display = "block";
    } else {
        btnTopo.style.display = "none";
    }
});
