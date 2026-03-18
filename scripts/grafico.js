export class GraficoOportunidades {
    constructor(dados) {
        this.config = {
            margin: { top: 20, right: 20, bottom: 40, left: 30 },
            corBarra: "#4A90E2",
            duracaoAnimacao: 800
        };
        this.dados = dados;
    }

  analisarDados() {
        const anosAltaProcura = this.dados.filter(d => d.valor > 50).map(d => d.ano);
        const total = this.dados.reduce((acc, atual) => acc + atual.valor, 0);

        const statsContainer = document.getElementById('estatisticas-grafico');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <p style="text-align: center; color: #666; font-size: 0.9rem; margin-bottom: 1rem;">
                    Foram geradas <strong>${total}</strong> oportunidades no total. 
                    Anos de maior sucesso: ${anosAltaProcura.join(', ')}.
                </p>
            `;
        }
    }

    mostrarGrafico() {
        const container = document.querySelector('.grafico-placeholder');
        const grafico = d3.select('#opportunityChart');
        
        const grupoEixoX = grafico.select('.eixo-x');
        const grupoCorpo = grafico.select('.corpo-grafico');

        grupoEixoX.selectAll("*").remove();
        grupoCorpo.selectAll("*").remove();

        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight || 300;
        
        const innerWidth = containerWidth - this.config.margin.left - this.config.margin.right;
        const innerHeight = containerHeight - this.config.margin.top - this.config.margin.bottom;

        grafico.attr("width", containerWidth).attr("height", containerHeight);

        grupoCorpo.attr("transform", `translate(${this.config.margin.left},${this.config.margin.top})`);
        grupoEixoX.attr("transform", `translate(${this.config.margin.left},${innerHeight + this.config.margin.top})`);

        const xScale = d3.scaleBand()
            .domain(this.dados.map(d => d.ano))
            .range([0, innerWidth])
            .padding(0.3);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(this.dados, d => d.valor)])
            .range([innerHeight, 0]);

        grupoEixoX.call(d3.axisBottom(xScale));

        grupoCorpo.selectAll("rect")
            .data(this.dados)
            .enter()
            .append("rect")
            .attr("x", d => xScale(d.ano))
            .attr("width", xScale.bandwidth())
            .attr("fill", this.config.corBarra) 
            .attr("rx", 4)
            .attr("y", innerHeight) 
            .attr("height", 0)
            .transition()
            .duration(this.config.duracaoAnimacao)
            .delay((d, i) => i * 80)
            .attr("y", d => yScale(d.valor))
            .attr("height", d => innerHeight - yScale(d.valor));
    }
}
