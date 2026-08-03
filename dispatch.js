/* ===== MarineTime - AI Dispatch Engine ===== */
const DispatchEngine = (() => {
    const activeDispatches = [];

    function processSOSAlert(alert) {
        const result = MarineData.findNearestRescue(parseFloat(alert.lat), parseFloat(alert.lng));
        if (!result) return null;

        const dispatch = {
            id: 'DSP-' + Date.now(),
            alertId: alert.id,
            vesselName: alert.vesselName,
            emergencyType: alert.emergencyType,
            rescueUnit: result.unit,
            distance: result.distance,
            eta: result.eta,
            status: 'dispatched',
            progress: 0,
            startTime: Date.now(),
            severity: alert.severity
        };

        result.unit.status = 'deployed';
        activeDispatches.push(dispatch);
        return dispatch;
    }

    function updateDispatches() {
        activeDispatches.forEach(d => {
            if (d.status === 'completed') return;
            const elapsed = (Date.now() - d.startTime) / 1000;
            const totalTime = d.eta * 60;
            d.progress = Math.min(100, (elapsed / totalTime) * 100 * 15); // Speed up for demo

            if (d.progress >= 50 && d.status === 'dispatched') {
                d.status = 'enroute';
            }
            if (d.progress >= 100) {
                d.status = 'onscene';
                d.progress = 100;
            }
        });
    }

    function renderDispatches() {
        const container = document.getElementById('dispatch-info');
        if (activeDispatches.length === 0) {
            container.innerHTML = `<div class="dispatch-empty"><i class="fas fa-check-circle"></i><p>No active dispatch operations</p></div>`;
            return;
        }

        container.innerHTML = activeDispatches.map(d => `
            <div class="dispatch-card">
                <div class="dispatch-card-header">
                    <span style="font-size:0.82rem;font-weight:700">${d.vesselName}</span>
                    <span class="dispatch-status ${d.status}">${d.status.toUpperCase()}</span>
                </div>
                <div class="dispatch-row">
                    <span class="dispatch-label">Emergency</span>
                    <span class="dispatch-value" style="color:var(--danger)">${d.emergencyType}</span>
                </div>
                <div class="dispatch-row">
                    <span class="dispatch-label">Rescue Unit</span>
                    <span class="dispatch-value">${d.rescueUnit.name}</span>
                </div>
                <div class="dispatch-row">
                    <span class="dispatch-label">Distance</span>
                    <span class="dispatch-value">${d.distance} nm</span>
                </div>
                <div class="dispatch-row">
                    <span class="dispatch-label">ETA</span>
                    <span class="dispatch-value">${d.eta} min</span>
                </div>
                <div class="dispatch-progress">
                    <div class="dispatch-progress-bar">
                        <div class="dispatch-progress-fill" style="width:${d.progress}%"></div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    return { processSOSAlert, updateDispatches, renderDispatches, activeDispatches };
})();
