/**
 * @module noticias
 * @description Módulo responsável por carregar um feed RSS real de notícias de saúde
 * a partir do nosso servidor Node.js.
 */

export async function initNoticias() {
    const container = document.getElementById('noticiasGrid');
    if (!container) return;

    // Estado de Loading
    container.innerHTML = `
        <div class="loading-state" role="status" aria-label="A carregar notícias" style="text-align:center; grid-column: 1/-1;">
            <div class="spinner-small" style="display:inline-block;"></div> 
            <span style="margin-left:10px;">A carregar notícias clínicas (RSS)...</span>
        </div>
    `;

    try {
        const response = await fetch('/api/noticias');
        
        if (!response.ok) throw new Error(`Erro do servidor: ${response.status}`);

        const data = await response.json();
        
        if (data.status !== 'ok' || !data.items || data.items.length === 0) {
            throw new Error('Feed RSS recebido, mas está vazio.');
        }

        container.innerHTML = '';
        const ultimasNoticias = data.items.slice(0, 3);

        ultimasNoticias.forEach(noticia => {
            const card = criarCardNoticia(noticia);
            container.appendChild(card);
        });

    } catch (error) {
        console.error("Erro nas Notícias:", error);
        container.innerHTML = `
            <div class="error-state" role="alert" style="grid-column: 1/-1; text-align:center; color: #D32F2F; padding: 2rem; background: #ffebee; border-radius: 8px;">
                <i class="fi fi-rr-triangle-warning"></i> Erro ao carregar o feed RSS: ${error.message}
            </div>
        `;
    }
}

/**
 * Cria o HTML de um card usando os dados da GNews API.
 */
function criarCardNoticia(item) {
    const article = document.createElement('article');
    article.className = 'noticia-card';
    
    // A API envia a data no campo 'publishedAt'
    const dataPublicacao = item.publishedAt
        ? new Date(item.publishedAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })
        : 'Data Desconhecida';

    const imagemUrl = item.image || './assets/logo-caca.svg';

    article.innerHTML = `
        <div class="noticia-imagem" style="height: 200px; overflow: hidden; background-color: #f5f5f5;">
            <img src="${imagemUrl}" alt="" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='./assets/logo-caca.svg'">
        </div>
        <div class="noticia-body" style="padding: 1.5rem; display: flex; flex-direction: column; height: 100%;">
            <span class="noticia-data" style="font-size: 0.85rem; color: var(--color-gray); margin-bottom: 0.5rem;"><i class="fi fi-rr-calendar"></i> ${dataPublicacao}</span>
            <h3 class="noticia-titulo" style="font-size: 1.1rem; color: var(--color-primary-dark); margin-bottom: 1rem; line-height: 1.4;">${escapeHtml(item.title)}</h3>
            <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="btn-ver-mais" style="margin-top: auto; color: var(--color-primary); font-weight: bold; text-decoration: none;">
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