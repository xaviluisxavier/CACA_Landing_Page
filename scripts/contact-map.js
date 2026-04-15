export function initContactMap() {
    const mapContainer = document.getElementById('contact-map');
    if (!mapContainer || typeof L === 'undefined') return;

    // Coordenadas aproximadas do Campus de Ponta Delgada da Universidade dos Açores
    const lat = 37.7451;
    const lng = -25.6603;

    const map = L.map('contact-map', {
        zoomControl: false // Interface mais limpa no telemóvel
    }).setView([lat, lng], 15);

    // Controlo de zoom re-adicionado no topo à direita para não bater no formulário
    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap, &copy; CARTO'
    }).addTo(map);

    const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    L.marker([lat, lng], { icon }).addTo(map)
        .bindPopup('<strong style="color:var(--color-primary)">CACA - Sede Principal</strong><br>Campus de Ponta Delgada')
        .openPopup();
}
