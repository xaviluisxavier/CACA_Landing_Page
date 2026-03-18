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
