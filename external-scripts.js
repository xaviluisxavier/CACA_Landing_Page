// --- NAVEGAÇÃO E MENUS ---
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
});

const saberMaisButton = document.getElementById('SaberMais');

saberMaisButton.addEventListener('click', (e) => {
    const areasDeInvestigacao = document.getElementById('investigacao');
    e.preventDefault();
    
    areasDeInvestigacao.classList.toggle('visible');

    if (areasDeInvestigacao.classList.contains('visible')) {
        setTimeout(() => {
            areasDeInvestigacao.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
});

// --- FORMULÁRIO ---
const form = document.querySelector('.contact-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const campos = ['name', 'email','phone', 'address', 'subject', 'message']
    const email = document.getElementById('email').value;
    const nome = document.getElementById('name').value;
    const telemovel = document.getElementById('phone').value;

    if (!email.endsWith('@uac.pt') && !email.endsWith('@gmail.com') && !email.endsWith('@outlook.com')) {
        alert("Por favor, use um email válido."); 
        return;
    }

    if (!nome) {
        alert('Preencha o campo nome.');
        return;
    }

    if (telemovel && (isNaN(telemovel) || telemovel.length != 9 || !telemovel.startsWith('9'))) {
        alert('Insira um telemovel válido.');
        return;
    }

    let confirmacao = confirm('Mandar mensagem?');
    if (confirmacao){
        alert('Mensagem enviada com sucesso!')
        for(let campo of campos) {
            document.getElementById(campo).value = '';
        }
    }
});

// --- GRÁFICO D3.JS ---
function mostrarGrafico() {
    const container = document.querySelector('.grafico-placeholder');
    const grafico = d3.select('#opportunityChart');
    
    grafico.selectAll("*").remove();

    let valores = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight || 300; 

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = containerHeight - margin.top - margin.bottom;

    grafico.attr("width", containerWidth).attr("height", containerHeight);

    const svg = grafico.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
        .domain(valores.map((d, i) => i))
        .range([0, innerWidth])
        .padding(0.2); 

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(valores)])
        .range([innerHeight, 0]);

    svg.selectAll("rect")
        .data(valores)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(i))
        .attr("width", xScale.bandwidth())
        .attr("fill", "var(--color-primary)") 
        .attr("rx", 4) 
        .attr("y", innerHeight)
        .attr("height", 0)
        .transition()
        .duration(800)
        .delay((d, i) => i * 80) 
        .attr("y", d => yScale(d))
        .attr("height", d => innerHeight - yScale(d));
}

window.addEventListener('DOMContentLoaded', mostrarGrafico);
window.addEventListener('resize', mostrarGrafico);

// --- BOTÃO TOPO ---
const btnTopo = document.getElementById("btn-topo");

btnTopo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        btnTopo.style.display = "block";
    } else {
        btnTopo.style.display = "none";
    }
});

// --- CARROSSEL ---
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
