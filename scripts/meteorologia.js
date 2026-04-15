const API_KEY = 'f27a412cd98aeca5fdfb73560dab1caf'; 

/**
 * Vai buscar os dados meteorológicos e devolve um objeto formatado.
 * @param {string} cidade - Nome da cidade para obter a meteorologia.
 * @returns {Promise<Object>} Objeto contendo os dados meteorológicos e as coordenadas.
 */
export async function getWeatherByCity(cidade) {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${API_KEY}&units=metric&lang=pt`;

    try {
        const response = await fetch(weatherApiUrl);
        
        if (!response.ok) {
            throw new Error("Localidade não encontrada ou erro na API.");
        }
        
        const data = await response.json();
        
        return {
            cidade: data.name,
            pais: data.sys.country,
            temperatura: Math.round(data.main.temp),
            descricao: data.weather[0].description,
            humidade: data.main.humidity,
            vento: data.wind.speed,
            iconeUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            coords: {
                lat: data.coord.lat,
                lon: data.coord.lon
            }
        };

    } catch (error) {
        console.error("Erro ao obter meteorologia:", error);
        throw error; 
    }
}
