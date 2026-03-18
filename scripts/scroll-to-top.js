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
