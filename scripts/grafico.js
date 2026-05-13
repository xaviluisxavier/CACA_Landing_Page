/**
 * Classe responsável por desenhar e animar o gráfico de barras de oportunidades utilizando D3.js.
 */
export class GraficoOportunidades {
    /**
     * @param {Array<Object>} dados - Lista de objetos com "ano" e "valor" das oportunidades.
     */
    constructor(dados) {
        this.config = {
            margin: { top: 20, right: 20, bottom: 40, left: 30 },
            corBarra: "#4A90E2",
            duracaoAnimacao: 800
        };
        this.dados = dados;
    }

   /**
     * Processa os dados de oportunidades e injeta um texto de resumo no HTML de forma segura.
     */
    analisarDados() {
        const anosAltaProcura = this.dados.filter(d => d.valor > 50).map(d => d.ano);
        const total = this.dados.reduce((acc, atual) => acc + atual.valor, 0);
        const statsContainer = document.getElementById('estatisticas-grafico');
        
        if (statsContainer) {
            statsContainer.innerHTML = ''; // Limpa a área
            const tpl = document.getElementById('tpl-estatisticas');
            const clone = tpl.content.cloneNode(true);
            
            // Preenche os dados usando textContent
            clone.querySelector('.stat-total').textContent = total;
            clone.querySelector('.stat-anos').textContent = anosAltaProcura.join(', ');
            
            statsContainer.appendChild(clone);
        }
    }
    /**
     * Limpa a área e renderiza as barras animadas do gráfico usando D3.js.
     */
    mostrarGrafico() {
        const container = document.querySelector('.grafico-placeholder');
        const grafico = d3.select('#opportunityChart');
        
        let grupoEixoX = grafico.select('.eixo-x');
        let grupoCorpo = grafico.select('.corpo-grafico');

        if (grafico.select('defs').empty()) grafico.append('defs');
        if (grafico.select('.grid-lines').empty()) grafico.insert('g', '.corpo-grafico').attr('class', 'grid-lines');

        const defs = grafico.select('defs');
        const grupoGrid = grafico.select('.grid-lines');

        grupoEixoX.selectAll("*").remove();
        grupoCorpo.selectAll("*").remove();
        grupoGrid.selectAll("*").remove();

        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight || 340;
        
        this.config.margin.bottom = 50;
        this.config.margin.left = 40;
        
        const innerWidth = containerWidth - this.config.margin.left - this.config.margin.right;
        const innerHeight = containerHeight - this.config.margin.top - this.config.margin.bottom;

        grafico.attr("width", containerWidth).attr("height", containerHeight);
        grupoCorpo.attr("transform", `translate(${this.config.margin.left},${this.config.margin.top})`);
        grupoEixoX.attr("transform", `translate(${this.config.margin.left},${innerHeight + this.config.margin.top})`);
        grupoGrid.attr("transform", `translate(${this.config.margin.left},${this.config.margin.top})`);

        const xScale = d3.scaleBand()
            .domain(this.dados.map(d => d.ano))
            .range([0, innerWidth])
            .padding(0.4);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(this.dados, d => d.valor) * 1.1])
            .range([innerHeight, 0]);

        defs.selectAll("*").remove();
        const gradient = defs.append("linearGradient")
            .attr("id", "bar-gradient")
            .attr("x1", "0%").attr("y1", "0%")
            .attr("x2", "0%").attr("y2", "100%");
        gradient.append("stop").attr("offset", "0%").attr("stop-color", "var(--color-primary)");
        gradient.append("stop").attr("offset", "100%").attr("stop-color", "#3CA1FF");

        grupoGrid.call(d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth).tickFormat(d => d));
        grupoGrid.select(".domain").remove(); 
        grupoGrid.selectAll(".tick line").attr("stroke", "rgba(0,0,0,0.06)").attr("stroke-dasharray", "4,4");
        grupoGrid.selectAll(".tick text").attr("fill", "var(--color-gray)").attr("font-size", "11px").attr("font-weight", "500").attr("dx", "-5px");

        grupoEixoX.call(d3.axisBottom(xScale));
        grupoEixoX.select(".domain").attr("stroke", "rgba(0,0,0,0.1)").attr("stroke-width", 2);
        grupoEixoX.selectAll(".tick line").remove();
        grupoEixoX.selectAll(".tick text").attr("fill", "var(--color-dark-gray)").attr("font-size", "13px").attr("font-weight", "700").attr("dy", "1.2em");

        // Cria Tooltip e injeta o Molde apenas 1 vez
        let tooltip = d3.select(".chart-tooltip");
        if (tooltip.empty()) {
            tooltip = d3.select("body").append("div")
                .attr("class", "chart-tooltip")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("background", "rgba(0, 56, 130, 0.95)")
                .style("backdrop-filter", "blur(4px)")
                .style("color", "#fff")
                .style("padding", "10px 14px")
                .style("border-radius", "6px")
                .style("font-size", "0.85rem")
                .style("pointer-events", "none")
                .style("box-shadow", "0 8px 24px rgba(0,56,130,0.2)")
                .style("transition", "opacity 0.2s")
                .style("z-index", "1000");

            // Insere o HTML do template DENTRO do tooltip
            const tpl = document.getElementById('tpl-tooltip');
            tooltip.node().appendChild(tpl.content.cloneNode(true));
        }

        grupoCorpo.selectAll("rect")
            .data(this.dados)
            .enter()
            .append("rect")
            .attr("x", d => xScale(d.ano))
            .attr("width", xScale.bandwidth())
            .attr("fill", "url(#bar-gradient)") 
            .attr("rx", 6)
            .attr("ry", 6)
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .transition().duration(200)
                    .attr("opacity", 0.85)
                    .attr("filter", "drop-shadow(0 -4px 10px rgba(0,56,130,0.2))");
                
                tooltip.transition().duration(200).style("opacity", 1);
                
                tooltip.select('.tooltip-ano').text(d.ano);
                tooltip.select('.tooltip-valor').text(d.valor);

                tooltip.style("left", (event.pageX + 15) + "px")
                       .style("top", (event.pageY - 40) + "px");
            })
            .on("mousemove", function(event) {
                tooltip.style("left", (event.pageX + 15) + "px")
                       .style("top", (event.pageY - 40) + "px");
            })
            .on("mouseout", function() {
                d3.select(this)
                    .transition().duration(300)
                    .attr("opacity", 1)
                    .attr("filter", "none");
                
                tooltip.transition().duration(300).style("opacity", 0);
            })
            .attr("y", innerHeight)
            .attr("height", 0)
            .transition()
            .duration(this.config.duracaoAnimacao)
            .delay((d, i) => i * 100)
            .ease(d3.easeCubicOut) 
            .attr("y", d => yScale(d.valor))
            .attr("height", d => innerHeight - yScale(d.valor));

        grupoCorpo.selectAll(".bar-label")
            .data(this.dados)
            .enter().append("text")
            .attr("class", "bar-label")
            .attr("x", d => xScale(d.ano) + xScale.bandwidth() / 2)
            .attr("y", d => yScale(d.valor) - 8)
            .attr("text-anchor", "middle")
            .attr("fill", "var(--color-primary)")
            .attr("font-weight", "800")
            .attr("font-size", "12px")
            .attr("opacity", 0)
            .text(d => d.valor)
            .transition()
            .duration(500)
            .delay((d, i) => this.config.duracaoAnimacao + (i * 100))
            .attr("opacity", 1);
    }
}
