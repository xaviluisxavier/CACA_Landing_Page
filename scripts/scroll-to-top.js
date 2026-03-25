/**
 * Adiciona a funcionalidade do botão de voltar ao topo da página.
 * O botão surge apenas quando o utilizador faz scroll para baixo e,
 * ao ser clicado, sobe suavemente a janela.
 * @returns {void}
 */
export function initScrollToTop() {
    const btnTopo = document.getElementById("btn-topo");

    if (btnTopo) {
        window.addEventListener("scroll", () => {
            
            if (window.scrollY > 300) {
                btnTopo.style.display = "block";
            } else {
                btnTopo.style.display = "none";
            }
        });
        btnTopo.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
}
