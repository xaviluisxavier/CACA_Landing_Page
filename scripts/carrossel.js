/**
 * Inicializa o carrossel de imagens na secção principal.
 * Configura o temporizador para alternar automaticamente a classe 'active' entre as imagens.
 * @returns {void}
 */
export function initCarrossel() {
    const carouselItems = document.querySelectorAll('.carousel-item');
    let currentSlide = 0;

    if (carouselItems.length > 0) {
        function showSlide(index) {
            carouselItems[currentSlide].classList.remove('active');
            currentSlide = (index + carouselItems.length) % carouselItems.length;
            carouselItems[currentSlide].classList.add('active');
        }
        
        setInterval(() => showSlide(currentSlide + 1), 5000);
    }
}
