const carouselItems = document.querySelectorAll('.carousel-item');
let currentSlide = 0;

// Só executa o código se existirem elementos no carrossel
if (carouselItems.length > 0) {
    /**
     * Alterna a imagem visível no carrossel
     * @param {number} index - O índice da próxima imagem a mostrar
     */
    function showSlide(index) {
        // Remove a classe ativa da imagem atual
        carouselItems[currentSlide].classList.remove('active');
        
        // Calcula o próximo índice de forma circular 
        currentSlide = (index + carouselItems.length) % carouselItems.length;
        
        // Adiciona a classe ativa à nova imagem
        carouselItems[currentSlide].classList.add('active');
    }
    
    // Configura o temporizador para mudar de imagem automaticamente a cada 5 segundos
    setInterval(() => showSlide(currentSlide + 1), 5000);
}