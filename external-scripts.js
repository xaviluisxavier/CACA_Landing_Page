//import * as d3 from "d3";

const form = document.querySelector('.contact-form');
const saberMaisButton = document.getElementById('SaberMais');


saberMaisButton.addEventListener('click', (e) => {
    const areasDeInvestigacao = document.getElementById('investigacao');
    e.preventDefault();
    
    // Alterna a classe que criámos no CSS
    areasDeInvestigacao.classList.toggle('visible');

    // Opcional: Faz scroll suave até à secção quando ela abre
    if (areasDeInvestigacao.classList.contains('visible')) {
        setTimeout(() => {
            areasDeInvestigacao.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Pequeno delay para a animação começar primeiro
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
    
    const larguraSvg = container.clientWidth;
    const alturaSvg = container.clientHeight || 300; 
    let valores = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    
    grafico.selectAll("*").remove(); 
    grafico.attr("width", larguraSvg).attr("height", alturaSvg);

    const espacoPorBarra = larguraSvg / valores.length;
    const valorMaximo = Math.max(...valores);

    grafico.selectAll("rect")
        .data(valores)
        .enter()
        .append("rect")
        // Eixo X e Largura
        .attr("x", (d, i) => i * espacoPorBarra + 5) 
        .attr("width", espacoPorBarra - 10)          
        .attr("fill", "var(--color-primary)")
        
        //ESTADO INICIAL DA ANIMAÇÃO
        .attr("y", alturaSvg) 
        .attr("height", 0)  
        
        //FAZER A ANIMAÇÃO
        .transition()
        .duration(800)
        .delay((d, i) => i * 100)
        
        //ESTADO FINAL
        .attr("y", d => alturaSvg - (d / valorMaximo * alturaSvg)) 
        .attr("height", d => d / valorMaximo * alturaSvg);
}

window.addEventListener('DOMContentLoaded', mostrarGrafico);
window.addEventListener('resize', mostrarGrafico);
