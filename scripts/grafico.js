const dados = [
        { ano: "2015", valor: 10 }, 
        { ano: "2016", valor: 20 },
        { ano: "2017", valor: 35 }, 
        { ano: "2018", valor: 50 },
        { ano: "2019", valor: 45 }, 
        { ano: "2020", valor: 70 },
        { ano: "2021", valor: 85 }, 
        { ano: "2022", valor: 90 },
        { ano: "2023", valor: 100 }
    ];

const margin = { top: 20, right: 20, bottom: 40, left: 30 };

function mostrarGrafico() {
    const container = document.querySelector('.grafico-placeholder');
    const grafico = d3.select('#opportunityChart');
    
    // Seleciona os grupos
    const grupoEixoX = grafico.select('.eixo-x');
    const grupoCorpo = grafico.select('.corpo-grafico');

    // Limpa o conteúdo interno dos grupos para redesenhar
    grupoEixoX.selectAll("*").remove();
    grupoCorpo.selectAll("*").remove();

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight || 300;
    
    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = containerHeight - margin.top - margin.bottom;

    // Ajusta o tamanho Grafico
    grafico.attr("width", containerWidth).attr("height", containerHeight);

    // Reposiciona os grupos baseados nas margens
    grupoCorpo.attr("transform", `translate(${margin.left},${margin.top})`);
    grupoEixoX.attr("transform", `translate(${margin.left},${innerHeight + margin.top})`);

    const xScale = d3.scaleBand()
        .domain(dados.map(d => d.ano))
        .range([0, innerWidth])
        .padding(0.3);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(dados, d => d.valor)])
        .range([innerHeight, 0]);

    // Desenha o Eixo X
    grupoEixoX.call(d3.axisBottom(xScale));

    // Desenha as barras dentro do grupo corpo-grafico
    grupoCorpo.selectAll("rect")
        .data(dados)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.ano))
        .attr("width", xScale.bandwidth())
        .attr("fill", "#4A90E2") 
        .attr("rx", 4)
        .attr("y", innerHeight) 
        .attr("height", 0)
        .transition()
        .duration(800)
        .delay((d, i) => i * 80)
        .attr("y", d => yScale(d.valor))
        .attr("height", d => innerHeight - yScale(d.valor));
}

window.addEventListener('DOMContentLoaded', mostrarGrafico);
window.addEventListener('resize', mostrarGrafico);