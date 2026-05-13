require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir os ficheiros estáticos do projeto (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '/')));

//Cache para notícias (1 hora)
let cacheNoticias = null; 
let ultimaAtualizacaoNoticias = 0; 
const TEMPO_CACHE_MILISSEGUNDOS = 60 * 60 * 1000;

// ROTA DE PROXY PARA METEOROLOGIA 
app.get('/api/weather', async (req, res) => {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        const { q, lat, lon } = req.query;

        let apiUrl = '';

        if (lat && lon) {
            apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt&appid=${apiKey}`;
        } else if (q) {
            apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${q}&units=metric&lang=pt&appid=${apiKey}`;
        } else {
            return res.status(400).json({ error: 'Falta a cidade ou coordenadas' });
        }

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Erro na OpenWeather');

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error("Erro na Meteorologia:", error.message);
        res.status(500).json({ error: 'Falha ao processar a meteorologia' });
    }
});

//ROTA DE PROXY PARA NOTÍCIAS 
app.get('/api/noticias', async (req, res) => {
    try {
        const agora = Date.now();

        // Verifica se a Cache ainda é válida
        if (cacheNoticias && (agora - ultimaAtualizacaoNoticias < TEMPO_CACHE_MILISSEGUNDOS)) {
            console.log("A devolver notícias da CACHE");
            return res.json({ status: 'ok', items: cacheNoticias });
        }

        const apiKey = process.env.GNEWS_API_KEY;
        
        const termosPesquisa = encodeURIComponent('("e-saúde" OR "telemedicina" OR "inteligência artificial" OR "epidemiologia" OR "investigação clínica") AND (saúde OR medicina)');
        const apiUrl = `https://gnews.io/api/v4/search?q=${termosPesquisa}&lang=pt&country=pt&max=15&apikey=${apiKey}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Erro na GNews API: ${response.status}`);

        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
            // Guarda diretamente na Cache
            cacheNoticias = data.articles;
            ultimaAtualizacaoNoticias = agora;
            res.json({ status: 'ok', items: cacheNoticias });
        } else {
            throw new Error('A API não devolveu resultados.');
        }

    } catch (error) {
        console.error("Erro nas Notícias:", error.message);
        
        // Se a API falhar, mostra as notícias de ontem que estão na Cache
        if (cacheNoticias) {
            console.log("API falhou, a devolver Cache como emergência.");
            return res.json({ status: 'ok', items: cacheNoticias, aviso: 'Dados em cache'});
        }
        res.status(500).json({ error: 'Falha ao processar as notícias' });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor em http://localhost:${PORT}`);
});
