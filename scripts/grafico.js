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
