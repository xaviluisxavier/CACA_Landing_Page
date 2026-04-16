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
     * Processa os dados de oportunidades e injeta um texto de resumo no HTML.
     * @returns {void}
     */
    analisarDados() {
        const anosAltaProcura = this.dados.filter(d => d.valor > 50).map(d => d.ano);
        const total = this.dados.reduce((acc, atual) => acc + atual.valor, 0);
        const statsContainer = document.getElementById('estatisticas-grafico');
        
        if (statsContainer) {
            statsContainer.innerHTML = `
                <p style="text-align: center; color: #666; font-size: 0.9rem; margin-bottom: 1rem;">
                    Foram geradas <strong>${total}</strong> oportunidades no total. <br>
                    Anos de maior sucesso: ${anosAltaProcura.join(', ')}.
                </p>
            `;
        }
    }
    /**
     * Limpa a área e renderiza as barras animadas do gráfico usando D3.js baseando-se nas dimensões do ecrã.
     * @returns {void}
     */
    mostrarGrafico() {
        //Seleciona a área do gráfico e limpa
        const container = document.querySelector('.grafico-placeholder');
        const grafico = d3.select('#opportunityChart');
        
        const grupoEixoX = grafico.select('.eixo-x');
        const grupoCorpo = grafico.select('.corpo-grafico');

        grupoEixoX.selectAll("*").remove();
        grupoCorpo.selectAll("*").remove();

        //Calcula a largura e altura corretas
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight || 300;
        
        const innerWidth = containerWidth - this.config.margin.left - this.config.margin.right;
        const innerHeight = containerHeight - this.config.margin.top - this.config.margin.bottom;

        grafico.attr("width", containerWidth).attr("height", containerHeight);

        grupoCorpo.attr("transform", `translate(${this.config.margin.left},${this.config.margin.top})`);
        grupoEixoX.attr("transform", `translate(${this.config.margin.left},${innerHeight + this.config.margin.top})`);

        //Cria as escalas de X (anos) e Y (valores)
        const xScale = d3.scaleBand()
            .domain(this.dados.map(d => d.ano))
            .range([0, innerWidth])
            .padding(0.3);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(this.dados, d => d.valor)])
            .range([innerHeight, 0]);
        //Desenha a linha horizontal do eixo X
        grupoEixoX.call(d3.axisBottom(xScale));

        //Cria e anima as Barras do Gráfico
        grupoCorpo.selectAll("rect")
            .data(this.dados)
            .enter()
            .append("rect")
            
            // A) Posição horizontal e cor da barra
            .attr("x", d => xScale(d.ano))
            .attr("width", xScale.bandwidth())
            .attr("fill", this.config.corBarra) 
            .attr("rx", 4) // Bordas arredondadas
            
            // B) Posição inicial antes da animação
            .attr("y", innerHeight) 
            .attr("height", 0)
            
            // C) Iniciar animação de escada
            .transition()
            .duration(this.config.duracaoAnimacao)
            .delay((d, i) => i * 80)
            
            // D) Posição final após a animação
            .attr("y", d => yScale(d.valor))
            .attr("height", d => innerHeight - yScale(d.valor));
    }
}
