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

// ROTA DE PROXY PARA METEOROLOGIA 
app.get('/api/weather', async (req, res) => {
    const { lat, lon, q } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    let url = '';

    if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt`;
    } else if (q) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${apiKey}&units=metric&lang=pt`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter dados meteorológicos' });
    }
});

//ROTA DE PROXY PARA NOTÍCIAS 
app.get('/api/noticias', async (req, res) => {
    try {
        const apiKey = process.env.GNEWS_API_KEY;
        
        const termosPesquisa = encodeURIComponent('("e-saúde" OR "telemedicina" OR "inteligência artificial" OR "epidemiologia" OR "investigação clínica") AND (saúde OR medicina)');
        const apiUrl = `https://gnews.io/api/v4/search?q=${termosPesquisa}&lang=pt&country=pt&max=5&apikey=${apiKey}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Erro na GNews API');

        const data = await response.json();
        
        res.json({ status: 'ok', items: data.articles });

    } catch (error) {
        console.error("Erro no servidor de Notícias:", error.message);
        res.status(500).json({ error: 'Falha ao aceder às notícias do Google' });
    }
});
// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor em http://localhost:${PORT}`);
});
