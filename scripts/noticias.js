/**
 * @module noticias
 * @description Módulo responsável por carregar notícias de saúde via GNews API (JSON).
 */

export async function initNoticias() {
    const container = document.getElementById('noticiasGrid');
    if (!container) return;

    container.innerHTML = `<div class="loading-state">A carregar notícias clínicas...</div>`;

    try {
        const response = await fetch('/api/noticias');
        if (!response.ok) throw new Error(`Erro: ${response.status}`);
        const data = await response.json();
        
        if (data.status !== 'ok' || !data.items) throw new Error('Dados inválidos');

        container.innerHTML = '';
        data.items.slice(0, 3).forEach(noticia => {
            container.appendChild(criarCardNoticia(noticia));
        });

    } catch (error) {
        container.innerHTML = `<div class="error-state">Falha ao carregar notícias mundiais.</div>`;
    }
}

function criarCardNoticia(item) {
    const article = document.createElement('article');
    article.className = 'noticia-card';
    const data = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('pt-PT') : '—';

    article.innerHTML = `
        <div class="noticia-imagem"><img src="${item.image || './assets/logo-caca.svg'}" onerror="this.src='./assets/logo-caca.svg'"></div>
        <div class="noticia-body">
            <span class="noticia-data">${data}</span>
            <h3 class="noticia-titulo">${item.title}</h3>
            <a href="${item.url}" target="_blank" class="btn-ver-mais">Ler Artigo</a>
        </div>
    `;
    return article;
}
