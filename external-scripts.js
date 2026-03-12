// NAVEGAÇÃO E MENUS 

// Seleção de elementos do DOM para o menu mobile
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

// Adiciona o evento de clique para alternar a visibilidade do menu em dispositivos móveis
menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
});

// Seleção do botão "Saber Mais" 
const saberMaisButton = document.getElementById('SaberMais');

// Adiciona evento para revelar a secção de investigação
saberMaisButton.addEventListener('click', (e) => {
    const areasDeInvestigacao = document.getElementById('investigacao');
    e.preventDefault(); // Previne o comportamento padrão do botão
    
    // Alterna a classe 'visible' que aciona a transição CSS de expansão
    areasDeInvestigacao.classList.toggle('visible');

    // Se a secção ficou visível, faz scroll suave até ela após um pequeno atraso
    if (areasDeInvestigacao.classList.contains('visible')) {
        setTimeout(() => {
            areasDeInvestigacao.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
});

//  FORMULÁRIO DE CONTACTO 

const form = document.querySelector('.contact-form');

form.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita o recarregamento da página na submissão
    
    const campos = ['name', 'email','phone', 'address', 'subject', 'message'];
    
    // Obtenção dos valores introduzidos pelo utilizador
    const email = document.getElementById('email').value;
    const nome = document.getElementById('name').value;
    const telemovel = document.getElementById('phone').value;

    // 1. Validação de Email: Apenas aceita domínios específicos
    if (!email.endsWith('@uac.pt') && !email.endsWith('@gmail.com') && !email.endsWith('@outlook.com')) {
        alert("Por favor, use um email válido (@uac.pt, @gmail.com ou @outlook.com)."); 
        return; // Interrompe a submissão
    }

    // 2. Validação de Nome: Verifica se o campo não está vazio
    if (!nome) {
        alert('Preencha o campo nome.');
        return;
    }

    // 3. Validação de Telemóvel: Verifica se é número, tem 9 dígitos e começa por '9'
    if (telemovel && (isNaN(telemovel) || telemovel.length != 9 || !telemovel.startsWith('9'))) {
        alert('Insira um telemóvel válido (9 dígitos, a começar por 9).');
        return;
    }

    // Pedido de confirmação ao utilizador antes de simular o envio
    let confirmacao = confirm('Deseja enviar a mensagem?');
    if (confirmacao){
        alert('Mensagem enviada com sucesso!'); // Feedback visual de sucesso
        
        // Limpa todos os campos do formulário iterando sobre a array 'campos'
        for(let campo of campos) {
            document.getElementById(campo).value = '';
        }
    }
});

// GRÁFICO D3.JS 

/**
 * Função responsável por desenhar e animar o gráfico de barras dinâmico
 * Utiliza a biblioteca D3.js para representar o crescimento de oportunidades
 */
function mostrarGrafico() {
    const container = document.querySelector('.grafico-placeholder');
    const grafico = d3.select('#opportunityChart');
    
    // Limpa o SVG antes de redesenhar
    grafico.selectAll("*").remove();

    // Dados fictícios para o gráfico
    let valores = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    
    // Calcula as dimensões disponíveis
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight || 300; 

    // Define as margens internas do gráfico
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = containerHeight - margin.top - margin.bottom;

    // Aplica as dimensões totais ao elemento SVG
    grafico.attr("width", containerWidth).attr("height", containerHeight);

    const svg = grafico.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Escala X: Distribui as barras uniformemente na largura disponível
    const xScale = d3.scaleBand()
        .domain(valores.map((d, i) => i))
        .range([0, innerWidth])
        .padding(0.2); 

    // Escala Y: Calcula os valores dos dados para a altura disponível
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(valores)])
        .range([innerHeight, 0]);

    // Criação das barras com animação
    svg.selectAll("rect")
        .data(valores)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(i))
        .attr("width", xScale.bandwidth())
        .attr("fill", "var(--color-primary)") 
        .attr("rx", 4) // Bordas arredondadas nas barras
        // Configuração inicial para a animação 
        .attr("y", innerHeight)
        .attr("height", 0)
        // Animação de subida das barras
        .transition()
        .duration(800)
        .delay((d, i) => i * 80) // Efeito em escada
        .attr("y", d => yScale(d))
        .attr("height", d => innerHeight - yScale(d));
}

// Inicializa o gráfico quando o DOM estiver completamente carregado
window.addEventListener('DOMContentLoaded', mostrarGrafico);
// Torna o gráfico responsivo redesenhando-o sempre que a janela for redimensionada
window.addEventListener('resize', mostrarGrafico);

//BOTÃO VOLTAR AO TOPO 

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

// CARROSSEL DE IMAGENS 

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
