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
        
        // 1. Aplicamos o filtro à lista toda que vem do servidor
        const noticiasLimpas = filtrarNoticiasSemelhantes(data.items);

        // 2. Agora sim, pegamos apenas nas 3 primeiras da lista já limpa!
        noticiasLimpas.slice(0, 3).forEach(item => {
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

    clone.querySelector('.btn-ver-mais').href = item.url || '#';

    return clone;
}

function filtrarNoticiasSemelhantes(artigos) {
    if (!artigos || artigos.length === 0) return [];
    
    const unicos = [];

    for (const artigo of artigos) {
        let Duplicado = false;
        
        // Limpa o título e divide em palavras (ignora palavras com menos de 4 letras)
        const palavrasArtigo = artigo.title.toLowerCase().replace(/[^\w\sà-ú]/gi, '').split(/\s+/).filter(w => w.length > 3);

        for (const noticiaUnica of unicos) {
            const palavrasUnica = noticiaUnica.title.toLowerCase().replace(/[^\w\sà-ú]/gi, '').split(/\s+/).filter(w => w.length > 3);
            
            // Conta quantas palavras são iguais
            const palavrasRepetidas = palavrasArtigo.filter(w => palavrasUnica.includes(w)).length;
            const baseComparacao = Math.min(palavrasArtigo.length, palavrasUnica.length);

            // Se mais de 50% for igual, é duplicado
            if (baseComparacao > 0 && (palavrasRepetidas / baseComparacao) > 0.5) {
                Duplicado = true;
                break;
            }
        }

        if (!Duplicado) {
            unicos.push(artigo);
        }
    }

    return unicos;
}
