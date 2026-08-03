/* ===== MarineTime - GIS Map Module ===== */
const MarineMap = (() => {
    let map, tileLayer, vesselMarkers = {}, rescueMarkers = {}, stationMarkers = {}, sosMarkers = {};
    let routeLines = {};
    let layers = { vessels: true, rescue: true, stations: true, weather: false, zones: false };

    function init() {
        map = L.map('map', {
            center: [13.0, 80.5],
            zoom: 9,
            zoomControl: false,
            attributionControl: false
        });

        // Dark map tiles
        tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
        }).addTo(map);

        L.control.zoom({ position: 'topleft' }).addTo(map);
        L.control.attribution({ position: 'bottomright', prefix: 'Sea Spam GIS' }).addTo(map);

        // Add initial markers
        addVesselMarkers();
        addRescueMarkers();
        addStationMarkers();
    }

    function createIcon(className, iconHtml) {
        return L.divIcon({
            className: '',
            html: `<div class="${className}">${iconHtml}</div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
            popupAnchor: [0, -16]
        });
    }

    function addVesselMarkers() {
        MarineData.vessels.forEach(v => {
            const icon = v.status === 'sos'
                ? createIcon('sos-marker', '<i class="fas fa-exclamation"></i>')
                : createIcon('vessel-marker', '<i class="fas fa-ship"></i>');
            const marker = L.marker([v.lat, v.lng], { icon })
                .bindPopup(vesselPopup(v))
                .addTo(map);
            marker.on('click', () => {
                document.querySelectorAll('.list-item').forEach(el => el.classList.remove('active'));
                const el = document.querySelector(`[data-id="${v.id}"]`);
                if (el) el.classList.add('active');
            });
            vesselMarkers[v.id] = marker;
        });
    }

    function vesselPopup(v) {
        return `<div class="marker-popup">
            <h4><i class="fas fa-ship" style="color:#38bdf8"></i> ${v.name}</h4>
            <p><strong>Type:</strong> ${v.type} | <strong>Flag:</strong> ${v.flag}</p>
            <p><strong>MMSI:</strong> ${v.mmsi}</p>
            <p><strong>Speed:</strong> ${v.speed.toFixed(1)} kn | <strong>Heading:</strong> ${v.heading.toFixed(0)}°</p>
            <p><strong>Crew:</strong> ${v.crew} | <strong>Status:</strong> ${v.status.toUpperCase()}</p>
            <p><strong>Position:</strong> ${v.lat.toFixed(4)}°N, ${v.lng.toFixed(4)}°E</p>
        </div>`;
    }

    function addRescueMarkers() {
        MarineData.rescueUnits.forEach(r => {
            const icon = createIcon('rescue-marker', '<i class="fas fa-life-ring"></i>');
            const marker = L.marker([r.lat, r.lng], { icon })
                .bindPopup(`<div class="marker-popup">
                    <h4><i class="fas fa-life-ring" style="color:#22c55e"></i> ${r.name}</h4>
                    <p><strong>Type:</strong> ${r.type}</p>
                    <p><strong>Org:</strong> ${r.org}</p>
                    <p><strong>Max Speed:</strong> ${r.speed} kn</p>
                    <p><strong>Status:</strong> ${r.status.toUpperCase()}</p>
                </div>`)
                .addTo(map);
            rescueMarkers[r.id] = marker;
        });
    }

    function addStationMarkers() {
        MarineData.coastalStations.forEach(s => {
            const icon = L.divIcon({
                className: '',
                html: `<div class="station-marker"><i class="fas fa-broadcast-tower"></i></div>`,
                iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -18]
            });
            const marker = L.marker([s.lat, s.lng], { icon })
                .bindPopup(`<div class="marker-popup">
                    <h4><i class="fas fa-broadcast-tower" style="color:#a78bfa"></i> ${s.name}</h4>
                    <p><strong>Type:</strong> ${s.type}</p>
                    <p><strong>VHF Channel:</strong> ${s.vhfChannel}</p>
                    <p><strong>Coverage:</strong> ${s.coverage} nm</p>
                </div>`)
                .addTo(map);
            stationMarkers[s.id] = marker;
        });
    }

    function updateVesselPositions() {
        MarineData.vessels.forEach(v => {
            if (vesselMarkers[v.id]) {
                vesselMarkers[v.id].setLatLng([v.lat, v.lng]);
                vesselMarkers[v.id].setPopupContent(vesselPopup(v));
                if (v.status === 'sos') {
                    vesselMarkers[v.id].setIcon(createIcon('sos-marker', '<i class="fas fa-exclamation"></i>'));
                }
            }
        });
    }

    function addSOSMarker(alert) {
        const icon = L.divIcon({
            className: '',
            html: `<div class="sos-marker"><i class="fas fa-exclamation-triangle"></i></div>`,
            iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -20]
        });
        const marker = L.marker([parseFloat(alert.lat), parseFloat(alert.lng)], { icon })
            .bindPopup(`<div class="marker-popup">
                <h4 style="color:#ef4444"><i class="fas fa-exclamation-triangle"></i> SOS: ${alert.vesselName}</h4>
                <p><strong>Emergency:</strong> ${alert.emergencyType}</p>
                <p><strong>Severity:</strong> ${alert.severity}</p>
                <p><strong>Crew:</strong> ${alert.crew}</p>
                <p><strong>Position:</strong> ${alert.lat}°N, ${alert.lng}°E</p>
            </div>`)
            .addTo(map);
        sosMarkers[alert.id] = marker;
        marker.openPopup();
        map.flyTo([parseFloat(alert.lat), parseFloat(alert.lng)], 11, { duration: 1.5 });
    }

    function drawRescueRoute(alert, rescueUnit) {
        const line = L.polyline(
            [[rescueUnit.lat, rescueUnit.lng], [parseFloat(alert.lat), parseFloat(alert.lng)]],
            { color: '#22c55e', weight: 2, dashArray: '8, 6', opacity: 0.8 }
        ).addTo(map);
        routeLines[alert.id] = line;
    }

    function focusOnLocation(lat, lng, zoom = 12) {
        map.flyTo([lat, lng], zoom, { duration: 1 });
    }

    function toggleLayer(layer) {
        layers[layer] = !layers[layer];
        const markerSet = layer === 'vessels' ? vesselMarkers : layer === 'rescue' ? rescueMarkers : stationMarkers;
        Object.values(markerSet).forEach(m => {
            if (layers[layer]) map.addLayer(m);
            else map.removeLayer(m);
        });
    }

    function toggleThemeLayer(isLight) {
        if (tileLayer) {
            const url = isLight ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png' : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
            tileLayer.setUrl(url);
        }
    }

    return { init, updateVesselPositions, addSOSMarker, drawRescueRoute, focusOnLocation, toggleLayer, toggleThemeLayer, getMap: () => map };
})();
