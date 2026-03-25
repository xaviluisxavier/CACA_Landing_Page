import { initAnimacao3D } from './logo-3d.js';
import { GraficoOportunidades } from './grafico.js';
import { initCarrossel } from './carrossel.js';
import { ValidacaoFormulario } from './formulario.js';
import { initMenuNav } from './menu-nav.js';
import { initSaberMais } from './saber-mais.js';
import { initScrollToTop } from './scroll-to-top.js';

/**
 * Conjunto de dados base para o gráfico de oportunidades.
 * @type {Array<Object>}
 */
const dadosOportunidades = [
    { ano: "2015", valor: 10 }, { ano: "2016", valor: 20 },
    { ano: "2017", valor: 35 }, { ano: "2018", valor: 50 },
    { ano: "2019", valor: 45 }, { ano: "2020", valor: 70 },
    { ano: "2021", valor: 85 }, { ano: "2022", valor: 90 },
    { ano: "2023", valor: 100 }
];


/**
 * Event Listener principal. Inicializa todos os módulos e scripts
 * assim que o DOM estiver completamente carregado.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    initAnimacao3D();
    initCarrossel();
    initMenuNav();
    initSaberMais();
    initScrollToTop();

    const meuGrafico = new GraficoOportunidades(dadosOportunidades);
    meuGrafico.analisarDados(); 
    meuGrafico.mostrarGrafico();

    const meuFormulario = new ValidacaoFormulario();
    meuFormulario.iniciar();

    window.addEventListener('resize', () => {
        meuGrafico.mostrarGrafico(); 
    });
});
