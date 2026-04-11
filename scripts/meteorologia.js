const API_KEY = 'f27a412cd98aeca5fdfb73560dab1caf'; 

export function getWeatherByCity(cidade) {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${API_KEY}&units=metric&lang=pt`;

    fetch(weatherApiUrl)
        .then(response => {
            if (!response.ok) throw new Error("Localidade não encontrada.");
            return response.json();
        })
        .then(data => {
            fillContent(data); 
        })
        .catch(error => {
            console.error("Erro ao obter meteorologia:", error);
            document.getElementById('resultado-tempo').innerHTML = 
                '<div class="tempo-erro">Erro: Local não encontrado.</div>';
        });
}

function fillContent(data) {
    const divResultado = document.getElementById('resultado-tempo');
    const iconeUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    
    divResultado.style.display = 'block';
    divResultado.innerHTML = `
        <h3>Tempo em ${data.name}, ${data.sys.country}</h3>
        <img src="${iconeUrl}" alt="${data.weather[0].description}" class="tempo-icone">
        <div class="tempo-temperatura">${Math.round(data.main.temp)}°C</div>
        <div class="tempo-descricao">${data.weather[0].description}</div>
        <p>Humidade: ${data.main.humidity}% | Vento: ${data.wind.speed} m/s</p>
    `;
}