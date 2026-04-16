/**
 * @module noticias
 * @description Módulo responsável por carregar um feed RSS de notícias de saúde
 * através da API rss2json e renderizar os cards na página.
 */

export async function initNoticias() {
    const container = document.getElementById('noticiasGrid');
    if (!container) return;

    // 1. Mostrar o estado de carregamento 
    container.innerHTML = `
        <div class="loading-state" role="status" aria-label="A carregar notícias">
            <div class="spinner-small"></div> <span>A carregar as últimas notícias...</span>
        </div>
    `;

    try {
        // Usamos um Feed RSS Público de Saúde convertido para JSON
        const rssUrl = encodeURIComponent('https://news.google.com/rss/search?q=saúde+portugal&hl=pt-PT&gl=PT&ceid=PT:pt-150');
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Erro ao contactar a API de notícias');
        
        const data = await response.json();
        
        if (data.status !== 'ok' || data.items.length === 0) {
            throw new Error('Nenhuma notícia encontrada');
        }

        // 2. Limpar o loading e renderizar apenas as últimas 3 notícias
        container.innerHTML = '';
        const ultimasNoticias = data.items.slice(0, 3);

        ultimasNoticias.forEach(noticia => {
            const card = criarCardNoticia(noticia);
            container.appendChild(card);
        });

    } catch (error) {
        console.error("Erro nas Notícias:", error);
        container.innerHTML = `
            <div class="error-state" role="alert">
                <i class="fi fi-rr-triangle-warning"></i> Não foi possível carregar o feed de notícias neste momento.
            </div>
        `;
    }
}

/**
 * Cria o HTML de um card de notícia.
 * @param {Object} item Dados da notícia devolvidos pela API
 * @returns {HTMLElement}
 */
function criarCardNoticia(item) {
    const article = document.createElement('article');
    article.className = 'noticia-card';
    
    // Formatar a data
    const dataPublicacao = new Date(item.pubDate).toLocaleDateString('pt-PT', { 
        day: '2-digit', month: 'long', year: 'numeric' 
    });

    // Se a API não devolver imagem, usamos um placeholder do CACA
    const imagemUrl = item.thumbnail || item.enclosure.link || './assets/logo-caca.svg';

    article.innerHTML = `
        <div class="noticia-imagem">
            <img src="${imagemUrl}" alt="" loading="lazy" onerror="this.src='./assets/logo-caca.svg'">
        </div>
        <div class="noticia-body">
            <span class="noticia-data"><i class="fi fi-rr-calendar"></i> ${dataPublicacao}</span>
            <h3 class="noticia-titulo">${escapeHtml(item.title)}</h3>
            <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="btn-ver-mais" aria-label="Ler o artigo completo sobre: ${escapeHtml(item.title)}">
                Ler Artigo <i class="fi fi-rr-arrow-small-right"></i>
            </a>
        </div>
    `;

    return article;
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
}
