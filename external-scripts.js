//import * as d3 from "d3";

const form = document.querySelector('.contact-form');
const saberMaisButton = document.getElementById('SaberMais');
var areasDeInvestigacao = document.getElementById('investigacao');
var grafico = d3.select('#opportunityChart');

const campos = ['name', 'email','phone', 'address', 'subject', 'message']

saberMaisButton.addEventListener('click', (e) => {
    e.preventDefault();
    let isHidden = areasDeInvestigacao.classList.contains('hidden');
    if (isHidden) {
    areasDeInvestigacao.classList.add('visible');
    } else {
        areasDeInvestigacao.classList.remove('visible');
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
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
    } else {
        alert('Mensagem não enviada.')
    }
});

function mostrarGrafico() {
    const alturaSvg = 150; // Altura total do teu container SVG
    let valores = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    
    grafico.selectAll("*").remove(); // Limpa o gráfico anterior antes de desenhar

    grafico.selectAll("rect")
        .data(valores)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * 25)
        .attr("y", d => alturaSvg - d) // Empurra a barra para a base
        .attr("width", 20)
        .attr("height", d => d)
        .attr("fill", "steelblue");
}

