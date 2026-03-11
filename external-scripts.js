const form = document.querySelector('.contact-form');
const saberMaisButton = document.getElementById('SaberMais');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const btnTopo = document.getElementById("btn-topo");



if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
    });

    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
        });
    });
}

btnTopo.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

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
        document.getElementById(campo).value = '';}
    }
});


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
        
        //ESTADO INICIAL
        .attr("y", innerHeight)
        .attr("height", 0)
        
        //ANIMAÇÃO
        .transition()
        .duration(800)
        .delay((d, i) => i * 80) 
        
        //ESTADO FINAL
        .attr("y", d => yScale(d))
        .attr("height", d => innerHeight - yScale(d));
}

window.addEventListener('DOMContentLoaded', mostrarGrafico);
window.addEventListener('resize', mostrarGrafico);
window.addEventListener("scroll", () => {
    // Se a página descer mais de 300 pixeis, mostra o botão
    if (window.scrollY > 300) {
        btnTopo.style.display = "block";
    } else {
        btnTopo.style.display = "none";
    }
});