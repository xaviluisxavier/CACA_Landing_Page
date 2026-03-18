export function initScrollToTop() {
    const btnTopo = document.getElementById("btn-topo");

    if (btnTopo) {
        window.addEventListener("scroll", () => {
            btnTopo.style.display = window.scrollY > 300 ? "block" : "none";
        });

        btnTopo.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
}
