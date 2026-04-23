/**
 * @module noticias
 * @description Módulo responsável por carregar notícias de saúde via GNews API (JSON).
 */

export async function initNoticias() {
    const container = document.getElementById('noticiasGrid');
    if (!container) return;

    try {
        const response = await fetch('/api/noticias');
        const data = await response.json();
        
        container.innerHTML = '';
        data.items.slice(0, 3).forEach(item => {
            container.appendChild(criarCardNoticia(item));
        });
    } catch (e) { container.innerHTML = 'Erro ao carregar notícias.'; }
}

function criarCardNoticia(item) {
    const tpl = document.getElementById('tpl-noticia-card');
    const clone = tpl.content.cloneNode(true);

    const img = clone.querySelector('img');
    img.src = item.image || './assets/logo-caca.svg';
    img.onerror = () => img.src = './assets/logo-caca.svg';

    clone.querySelector('.noticia-titulo').textContent = item.title;
    
    if (item.publishedAt) {
        clone.querySelector('.noticia-data').textContent = new Date(item.publishedAt).toLocaleDateString('pt-PT');
    } else {
        clone.querySelector('.noticia-data').textContent = 'Data recente';
    }

    // GNews usa url
    clone.querySelector('.btn-ver-mais').href = item.url || '#';

    return clone;
}
