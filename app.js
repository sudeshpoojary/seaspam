/* ===== MarineTime - Main Application Controller ===== */
document.addEventListener('DOMContentLoaded', () => {
    // Loading screen
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
        document.querySelector('.app-container').classList.add('visible');
        initApp();
    }, 2800);
});

function initApp() {
    MarineMap.init();
    CommsSystem.init();
    renderVesselList();
    renderRescueList();
    renderStationList();
    updateStats();
    updateDateTime();
    updateWeather();
    updateAIInsights();
    drawMiniCharts();
    setupEventListeners();
    startSimulation();
    addInitialAlerts();
}

/* ===== UI Rendering ===== */
function renderVesselList() {
    const container = document.getElementById('vessel-list');
    container.innerHTML = MarineData.vessels.map(v => {
        const statusClass = v.status === 'sos' ? 'sos' : '';
        const badgeClass = v.status === 'sos' ? 'badge-sos' : v.status === 'online' ? 'badge-online' : 'badge-idle';
        const iconClass = v.status === 'sos' ? 'sos-icon' : 'vessel';
        return `<div class="list-item ${statusClass}" data-id="${v.id}" data-type="vessel">
            <div class="item-icon ${iconClass}"><i class="fas fa-${v.status === 'sos' ? 'exclamation-triangle' : 'ship'}"></i></div>
            <div class="item-info">
                <div class="item-name">${v.name}</div>
                <div class="item-sub">${v.type} · ${v.speed.toFixed(1)} kn · ${v.crew} crew</div>
            </div>
            <span class="item-badge ${badgeClass}">${v.status === 'sos' ? 'SOS' : v.status}</span>
        </div>`;
    }).join('');

    container.querySelectorAll('.list-item').forEach(el => {
        el.addEventListener('click', () => {
            const v = MarineData.vessels.find(x => x.id === el.dataset.id);
            if (v) MarineMap.focusOnLocation(v.lat, v.lng, 13);
            document.querySelectorAll('.list-item').forEach(e => e.classList.remove('active'));
            el.classList.add('active');
        });
    });
}

function renderRescueList() {
    const container = document.getElementById('rescue-list');
    container.innerHTML = MarineData.rescueUnits.map(r => {
        const badgeClass = r.status === 'deployed' ? 'badge-deployed' : 'badge-online';
        return `<div class="list-item" data-id="${r.id}" data-type="rescue">
            <div class="item-icon rescue"><i class="fas fa-${r.type === 'Helicopter' ? 'helicopter' : 'life-ring'}"></i></div>
            <div class="item-info">
                <div class="item-name">${r.name}</div>
                <div class="item-sub">${r.type} · ${r.org}</div>
            </div>
            <span class="item-badge ${badgeClass}">${r.status}</span>
        </div>`;
    }).join('');

    container.querySelectorAll('.list-item').forEach(el => {
        el.addEventListener('click', () => {
            const r = MarineData.rescueUnits.find(x => x.id === el.dataset.id);
            if (r) MarineMap.focusOnLocation(r.lat, r.lng, 13);
        });
    });
}

function renderStationList() {
    const container = document.getElementById('station-list');
    container.innerHTML = MarineData.coastalStations.map(s => `
        <div class="list-item" data-id="${s.id}" data-type="station">
            <div class="item-icon station"><i class="fas fa-broadcast-tower"></i></div>
            <div class="item-info">
                <div class="item-name">${s.name}</div>
                <div class="item-sub">${s.type} · VHF Ch${s.vhfChannel} · ${s.coverage}nm</div>
            </div>
        </div>
    `).join('');

    container.querySelectorAll('.list-item').forEach(el => {
        el.addEventListener('click', () => {
            const s = MarineData.coastalStations.find(x => x.id === el.dataset.id);
            if (s) MarineMap.focusOnLocation(s.lat, s.lng, 11);
        });
    });
}

function updateStats() {
    const online = MarineData.vessels.filter(v => v.status !== 'idle').length;
    const sos = MarineData.vessels.filter(v => v.status === 'sos').length;
    const available = MarineData.rescueUnits.filter(r => r.status !== 'deployed').length;
    document.getElementById('active-vessels-count').textContent = online;
    document.getElementById('active-sos-count').textContent = sos;
    document.getElementById('rescue-units-count').textContent = available + '/' + MarineData.rescueUnits.length;
    document.getElementById('avg-response-time').textContent = (8 + Math.floor(Math.random() * 5)) + 'm';
}

function updateDateTime() {
    const now = new Date();
    const opts = { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    document.getElementById('datetime').textContent = now.toLocaleDateString('en-US', opts) + ' UTC+5:30';
}

function updateWeather() {
    const w = MarineData.getWeatherData();
    document.getElementById('wind-speed').textContent = w.windSpeed + ' kn ' + w.windDir;
    document.getElementById('wave-height').textContent = w.waveHeight + ' m';
    document.getElementById('visibility').textContent = w.visibility + ' nm';
    document.getElementById('sea-state').textContent = w.seaState;
}

function updateAIInsights() {
    const insights = [MarineData.getAIInsight(), MarineData.getAIInsight(), MarineData.getAIInsight()];
    document.getElementById('ai-insights').innerHTML = insights.map(i =>
        `<div class="ai-insight ai-risk-${i.risk}"><i class="fas ${i.icon}"></i> ${i.text}</div>`
    ).join('');
}

/* ===== Alert System ===== */
function addInitialAlerts() {
    const feed = document.getElementById('alert-feed');
    const alerts = [
        { type: 'info', title: 'System Boot Complete', desc: 'All subsystems initialized. Monitoring active.', time: '3m ago' },
        { type: 'info', title: 'Satellite Link Established', desc: 'INSAT-3D link stable. AIS data streaming.', time: '2m ago' },
        { type: 'warning', title: 'Weather Advisory', desc: 'SW monsoon approaching. Wind speeds 15-20kn expected.', time: '1m ago' },
    ];
    feed.innerHTML = alerts.map(a => alertCardHTML(a)).join('');
}

function alertCardHTML(a) {
    return `<div class="alert-card ${a.type}">
        <div class="alert-header">
            <span class="alert-type ${a.type}">${a.type === 'critical' ? '🚨 CRITICAL' : a.type === 'warning' ? '⚠️ WARNING' : 'ℹ️ INFO'}</span>
            <span class="alert-time">${a.time}</span>
        </div>
        <div class="alert-title">${a.title}</div>
        <div class="alert-desc">${a.desc}</div>
        ${a.coords ? `<div class="alert-coords"><i class="fas fa-map-marker-alt"></i> ${a.coords}</div>` : ''}
    </div>`;
}

function addSOSAlertCard(alert) {
    const feed = document.getElementById('alert-feed');
    const card = alertCardHTML({
        type: 'critical',
        title: `SOS: ${alert.vesselName} - ${alert.emergencyType}`,
        desc: alert.description,
        coords: `${alert.lat}°N, ${alert.lng}°E`,
        time: 'Just now'
    });
    feed.insertAdjacentHTML('afterbegin', card);
}

/* ===== SOS Processing ===== */
function triggerSOS(vesselOverride) {
    const alert = MarineData.generateSOSAlert(vesselOverride);
    // Update vessel status
    const vessel = MarineData.vessels.find(v => v.id === alert.vesselId);
    if (vessel) vessel.status = 'sos';

    // Update UI
    addSOSAlertCard(alert);
    MarineMap.addSOSMarker(alert);
    CommsSystem.addSOSMessage(alert);
    renderVesselList();
    updateStats();
    showSOSModal(alert);

    // Flash the SOS stat
    const sosStat = document.getElementById('stat-alerts');
    sosStat.style.animation = 'sosPulse 0.5s 5';
    setTimeout(() => sosStat.style.animation = '', 2500);
}

function showSOSModal(alert) {
    const modal = document.getElementById('sos-modal');
    const body = document.getElementById('sos-modal-body');
    body.innerHTML = `
        <div class="sos-detail-grid">
            <div class="sos-detail"><span class="sos-detail-label">Vessel</span><span class="sos-detail-value">${alert.vesselName}</span></div>
            <div class="sos-detail"><span class="sos-detail-label">Type</span><span class="sos-detail-value">${alert.vesselType}</span></div>
            <div class="sos-detail"><span class="sos-detail-label">Emergency</span><span class="sos-detail-value" style="color:var(--danger)">${alert.emergencyType}</span></div>
            <div class="sos-detail"><span class="sos-detail-label">Severity</span><span class="sos-detail-value" style="color:var(--danger)">${alert.severity}</span></div>
            <div class="sos-detail"><span class="sos-detail-label">Position</span><span class="sos-detail-value coords">${alert.lat}°N, ${alert.lng}°E</span></div>
            <div class="sos-detail"><span class="sos-detail-label">Crew on Board</span><span class="sos-detail-value">${alert.crew}</span></div>
            <div class="sos-detail full-width"><span class="sos-detail-label">Description</span><span class="sos-detail-value" style="font-size:0.78rem;font-weight:400;color:var(--text-secondary)">${alert.description}</span></div>
        </div>`;

    // Nearest rescue info
    const nearest = MarineData.findNearestRescue(parseFloat(alert.lat), parseFloat(alert.lng));
    if (nearest) {
        body.innerHTML += `
        <div style="margin-top:14px;padding:10px;background:var(--bg-card);border-radius:8px;border:1px solid var(--border)">
            <div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px"><i class="fas fa-brain" style="color:var(--purple)"></i> AI DISPATCH RECOMMENDATION</div>
            <div class="sos-detail-grid">
                <div class="sos-detail"><span class="sos-detail-label">Nearest Unit</span><span class="sos-detail-value" style="color:var(--success)">${nearest.unit.name}</span></div>
                <div class="sos-detail"><span class="sos-detail-label">Unit Type</span><span class="sos-detail-value">${nearest.unit.type}</span></div>
                <div class="sos-detail"><span class="sos-detail-label">Distance</span><span class="sos-detail-value coords">${nearest.distance} nm</span></div>
                <div class="sos-detail"><span class="sos-detail-label">ETA</span><span class="sos-detail-value" style="color:var(--warning)">${nearest.eta} min</span></div>
            </div>
        </div>`;
    }

    modal.classList.add('active');
    modal._currentAlert = alert;
}

/* ===== Event Listeners ===== */
function setupEventListeners() {
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // Theme toggle
    document.getElementById('btn-theme').addEventListener('click', function() {
        const isLight = document.body.classList.toggle('light-theme');
        this.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        MarineMap.toggleThemeLayer(isLight);
    });

    // SOS Drill button
    document.getElementById('btn-trigger-sos').addEventListener('click', () => triggerSOS());

    // Map layer toggles
    ['vessels', 'rescue', 'stations'].forEach((layer, i) => {
        const ids = ['btn-layer-vessels', 'btn-layer-rescue', 'btn-layer-stations'];
        document.getElementById(ids[i]).addEventListener('click', function() {
            this.classList.toggle('active');
            MarineMap.toggleLayer(layer);
        });
    });

    // Fullscreen
    document.getElementById('btn-fullscreen').addEventListener('click', () => {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
    });

    // Modal controls
    document.getElementById('btn-close-sos').addEventListener('click', () => {
        document.getElementById('sos-modal').classList.remove('active');
    });
    document.getElementById('btn-acknowledge-sos').addEventListener('click', () => {
        document.getElementById('sos-modal').classList.remove('active');
        CommsSystem.addMessage('emergency', 'Command Center', '✅ SOS acknowledged. Monitoring situation.', 'system');
    });
    document.getElementById('btn-dispatch-rescue').addEventListener('click', () => {
        const modal = document.getElementById('sos-modal');
        const alert = modal._currentAlert;
        if (alert) {
            const dispatch = DispatchEngine.processSOSAlert(alert);
            if (dispatch) {
                MarineMap.drawRescueRoute(alert, dispatch.rescueUnit);
                CommsSystem.addMessage('rescue', 'SAR Coordinator', `🚁 ${dispatch.rescueUnit.name} DISPATCHED to ${alert.vesselName}. ETA: ${dispatch.eta} min.`, 'emergency');
                CommsSystem.addMessage('command', 'Dispatch AI', `Dispatch ${dispatch.id} created. Unit: ${dispatch.rescueUnit.name}. Distance: ${dispatch.distance}nm. ETA: ${dispatch.eta}min.`, 'system');
                renderRescueList();
                updateStats();
                // Switch to dispatch tab
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                document.querySelector('[data-tab="dispatch-tab"]').classList.add('active');
                document.getElementById('dispatch-tab').classList.add('active');
            }
        }
        modal.classList.remove('active');
    });

    // Vessel search
    document.getElementById('vessel-search').addEventListener('input', function() {
        const q = this.value.toLowerCase();
        document.querySelectorAll('#vessel-list .list-item').forEach(el => {
            const name = el.querySelector('.item-name').textContent.toLowerCase();
            el.style.display = name.includes(q) ? 'flex' : 'none';
        });
    });
}

/* ===== Mini Charts ===== */
function drawMiniCharts() {
    drawLineChart('chart-response', [12, 9, 15, 8, 11, 7, 10, 13, 6, 9, 8, 11], '#38bdf8');
    drawBarChart('chart-incidents', [3, 5, 2, 4, 1, 3, 2], '#a78bfa');
}

function drawLineChart(id, data, color) {
    const canvas = document.getElementById(id);
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const max = Math.max(...data);
    const step = w / (data.length - 1);
    ctx.clearRect(0, 0, w, h);
    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, color + '40');
    grad.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.moveTo(0, h);
    data.forEach((d, i) => ctx.lineTo(i * step, h - (d / max) * (h - 10)));
    ctx.lineTo(w, h);
    ctx.fillStyle = grad;
    ctx.fill();
    // Line
    ctx.beginPath();
    data.forEach((d, i) => { i === 0 ? ctx.moveTo(0, h - (d/max)*(h-10)) : ctx.lineTo(i*step, h - (d/max)*(h-10)); });
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawBarChart(id, data, color) {
    const canvas = document.getElementById(id);
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const max = Math.max(...data);
    const bw = w / data.length - 4;
    ctx.clearRect(0, 0, w, h);
    data.forEach((d, i) => {
        const bh = (d / max) * (h - 10);
        const x = i * (bw + 4) + 2;
        ctx.fillStyle = color + '60';
        ctx.beginPath();
        ctx.roundRect(x, h - bh, bw, bh, 3);
        ctx.fill();
    });
}

/* ===== Simulation Loop ===== */
function startSimulation() {
    // Update vessel positions every 3s
    setInterval(() => {
        MarineData.updateVesselPositions();
        MarineMap.updateVesselPositions();
    }, 3000);

    // Update stats every 5s
    setInterval(() => {
        updateStats();
        updateDateTime();
    }, 5000);

    // Update weather every 30s
    setInterval(updateWeather, 30000);

    // Update AI insights every 20s
    setInterval(updateAIInsights, 20000);

    // Simulate radio traffic every 15-25s
    setInterval(() => CommsSystem.simulateTraffic(), 15000 + Math.random() * 10000);

    // Update dispatches every 2s
    setInterval(() => {
        DispatchEngine.updateDispatches();
        DispatchEngine.renderDispatches();
    }, 2000);

    // Random SOS event every 60-90s for demo
    setInterval(() => {
        const chance = Math.random();
        if (chance < 0.3) triggerSOS();
    }, 60000);

    // Update datetime every second
    setInterval(updateDateTime, 1000);
}
