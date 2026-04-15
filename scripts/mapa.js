/**
 * Inicializa e renderiza um mapa numa div.
 * @param {string} mapCont - O ID da div HTML do mapa
 * @param {number} lat - Latitude.
 * @param {number} lon - Longitude.
 * @param {string} nomeLocal - Nome que aparecerá no marcador (pin) do mapa.
 */
export function renderizarMapa(mapCont, lat, lon, nomeLocal = "Local do Evento") {
    const mapContainer = document.getElementById(mapCont);
    
    if (!mapContainer) {
        console.error(`Erro: A div com ID '${mapCont}' não existe no HTML.`);
        return;
    }

    if (mapContainer._leaflet_id) {
        mapContainer.innerHTML = ''; 
        mapContainer._leaflet_id = null;
    }

    const map = L.map(mapCont).setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker([lat, lon])
        .addTo(map)
        .bindPopup(`<b>${nomeLocal}</b>`)
        .openPopup();
}
