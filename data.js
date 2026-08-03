/* ===== MarineTime - Data Layer ===== */
/* Simulated vessels, rescue units, coastal stations, and IoT sensor feeds */

const MarineData = (() => {
    // Vessels in the operational area (Bay of Bengal / Indian Ocean region)
    const vessels = [
        { id: 'V001', name: 'MV Ocean Pioneer', type: 'Cargo', flag: 'IN', crew: 24, lat: 13.08, lng: 80.29, speed: 12.5, heading: 45, status: 'online', mmsi: '419001001' },
        { id: 'V002', name: 'FV Sea Harvest', type: 'Fishing', flag: 'IN', crew: 8, lat: 12.50, lng: 80.80, speed: 5.2, heading: 180, status: 'online', mmsi: '419002002' },
        { id: 'V003', name: 'MT Petro Star', type: 'Tanker', flag: 'SG', crew: 32, lat: 13.40, lng: 81.00, speed: 14.1, heading: 270, status: 'online', mmsi: '563003003' },
        { id: 'V004', name: 'SV Wind Chaser', type: 'Sailing', flag: 'IN', crew: 4, lat: 12.80, lng: 80.15, speed: 6.8, heading: 120, status: 'online', mmsi: '419004004' },
        { id: 'V005', name: 'MV Coral Queen', type: 'Passenger', flag: 'IN', crew: 45, lat: 13.25, lng: 80.55, speed: 18.3, heading: 90, status: 'online', mmsi: '419005005' },
        { id: 'V006', name: 'FV Neptune\'s Call', type: 'Fishing', flag: 'IN', crew: 6, lat: 12.20, lng: 80.50, speed: 3.1, heading: 315, status: 'online', mmsi: '419006006' },
        { id: 'V007', name: 'MV Trade Winds', type: 'Cargo', flag: 'LR', crew: 20, lat: 13.60, lng: 81.20, speed: 11.0, heading: 200, status: 'online', mmsi: '636007007' },
        { id: 'V008', name: 'FV Morning Star', type: 'Fishing', flag: 'IN', crew: 10, lat: 12.65, lng: 80.95, speed: 4.5, heading: 60, status: 'idle', mmsi: '419008008' },
        { id: 'V009', name: 'MV Blue Horizon', type: 'Cargo', flag: 'PA', crew: 18, lat: 13.90, lng: 80.70, speed: 13.7, heading: 155, status: 'online', mmsi: '351009009' },
        { id: 'V010', name: 'FV Lucky Catch', type: 'Fishing', flag: 'IN', crew: 5, lat: 12.35, lng: 80.25, speed: 2.8, heading: 240, status: 'idle', mmsi: '419010010' },
        { id: 'V011', name: 'MV Eastern Promise', type: 'Container', flag: 'HK', crew: 28, lat: 14.10, lng: 81.50, speed: 16.2, heading: 310, status: 'online', mmsi: '477011011' },
        { id: 'V012', name: 'SV Albatross', type: 'Sailing', flag: 'IN', crew: 3, lat: 12.95, lng: 80.40, speed: 7.5, heading: 75, status: 'online', mmsi: '419012012' },
        { id: 'V013', name: 'MV Arabian Knight', type: 'Cargo', flag: 'IN', crew: 22, lat: 18.80, lng: 72.50, speed: 11.5, heading: 210, status: 'online', mmsi: '419013013' },
        { id: 'V014', name: 'FV Goa Pearl', type: 'Fishing', flag: 'IN', crew: 12, lat: 15.50, lng: 73.50, speed: 4.2, heading: 180, status: 'online', mmsi: '419014014' },
        { id: 'V015', name: 'MT Mumbai Pride', type: 'Tanker', flag: 'IN', crew: 30, lat: 19.10, lng: 72.00, speed: 14.0, heading: 150, status: 'online', mmsi: '419015015' },
    ];

    // Rescue units
    const rescueUnits = [
        { id: 'R001', name: 'ICG Interceptor Alpha', type: 'Fast Patrol', org: 'Indian Coast Guard', lat: 13.10, lng: 80.30, speed: 35, status: 'standby', range: 150 },
        { id: 'R002', name: 'SAR Helo Bravo', type: 'Helicopter', org: 'Indian Navy', lat: 13.00, lng: 80.18, speed: 140, status: 'standby', range: 300 },
        { id: 'R003', name: 'ICG Patrol Charlie', type: 'Offshore Patrol', org: 'Indian Coast Guard', lat: 12.60, lng: 80.65, speed: 25, status: 'standby', range: 200 },
        { id: 'R004', name: 'SAR Helo Delta', type: 'Helicopter', org: 'Coast Guard Air', lat: 13.50, lng: 80.25, speed: 150, status: 'standby', range: 350 },
        { id: 'R005', name: 'Lifeboat Echo', type: 'Lifeboat', org: 'RNLI Partner', lat: 12.90, lng: 80.28, speed: 20, status: 'standby', range: 80 },
        { id: 'R006', name: 'ICG Mumbai Defender', type: 'Fast Patrol', org: 'Indian Coast Guard', lat: 18.92, lng: 72.82, speed: 38, status: 'standby', range: 200 },
        { id: 'R007', name: 'SAR Helo Goa', type: 'Helicopter', org: 'Indian Navy', lat: 15.38, lng: 73.83, speed: 155, status: 'standby', range: 350 },
        { id: 'R008', name: 'ICG Kochi Guardian', type: 'Offshore Patrol', org: 'Indian Coast Guard', lat: 9.96, lng: 76.23, speed: 28, status: 'standby', range: 250 },
    ];

    // Coastal stations
    const coastalStations = [
        { id: 'CS01', name: 'Chennai MRCC', type: 'MRCC', lat: 13.08, lng: 80.27, vhfChannel: 16, coverage: 200 },
        { id: 'CS02', name: 'Pondicherry CRS', type: 'CRS', lat: 11.93, lng: 79.83, vhfChannel: 16, coverage: 120 },
        { id: 'CS03', name: 'Visakhapatnam MRCC', type: 'MRCC', lat: 17.68, lng: 83.22, vhfChannel: 16, coverage: 250 },
        { id: 'CS04', name: 'Kakinada CRS', type: 'CRS', lat: 16.94, lng: 82.24, vhfChannel: 16, coverage: 150 },
        { id: 'CS05', name: 'Mumbai MRCC', type: 'MRCC', lat: 18.93, lng: 72.83, vhfChannel: 16, coverage: 250 },
        { id: 'CS06', name: 'Goa CRS', type: 'CRS', lat: 15.40, lng: 73.80, vhfChannel: 16, coverage: 150 },
        { id: 'CS07', name: 'Kochi MRCC', type: 'MRCC', lat: 9.93, lng: 76.26, vhfChannel: 16, coverage: 200 },
    ];

    // SOS alert types
    const emergencyTypes = [
        'Man Overboard', 'Engine Failure', 'Fire On Board', 'Taking On Water',
        'Capsizing', 'Medical Emergency', 'Piracy Attack', 'Collision',
        'Grounding', 'Loss of Steering', 'Cargo Shift', 'Crew Injury'
    ];

    // AI insight templates
    const aiInsightTemplates = [
        { icon: 'fa-wind', text: 'Wind speed increasing to {val} kn in sector NE-4. Advisory for small vessels.', risk: 'medium' },
        { icon: 'fa-water', text: 'Wave height anomaly detected: {val}m swells moving westward.', risk: 'medium' },
        { icon: 'fa-route', text: 'Optimal rescue route calculated. ETA reduced by {val} minutes.', risk: 'low' },
        { icon: 'fa-ship', text: '{val} vessels in high-traffic zone. Collision risk elevated.', risk: 'high' },
        { icon: 'fa-temperature-high', text: 'Sea surface temp anomaly: +{val}°C. Possible cyclonic activity.', risk: 'high' },
        { icon: 'fa-satellite', text: 'Satellite uplink stable. {val} IoT sensors reporting nominal.', risk: 'low' },
        { icon: 'fa-chart-line', text: 'Response time trend: {val}% improvement over last 30 days.', risk: 'low' },
        { icon: 'fa-shield-alt', text: 'Zone B patrol coverage gap detected. Recommending redeployment.', risk: 'medium' },
    ];

    // Generate random weather data
    function getWeatherData() {
        return {
            windSpeed: (8 + Math.random() * 20).toFixed(1),
            windDir: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
            waveHeight: (0.5 + Math.random() * 3).toFixed(1),
            visibility: (3 + Math.random() * 12).toFixed(0),
            seaState: ['Calm', 'Slight', 'Moderate', 'Rough', 'Very Rough'][Math.floor(Math.random() * 5)],
            temp: (24 + Math.random() * 6).toFixed(1),
            pressure: (1008 + Math.random() * 15).toFixed(0)
        };
    }

    // Get random AI insight
    function getAIInsight() {
        const t = aiInsightTemplates[Math.floor(Math.random() * aiInsightTemplates.length)];
        const vals = { 'fa-wind': (15+Math.random()*15).toFixed(0), 'fa-water': (1.5+Math.random()*2.5).toFixed(1),
            'fa-route': (3+Math.random()*12).toFixed(0), 'fa-ship': Math.floor(3+Math.random()*5),
            'fa-temperature-high': (1.5+Math.random()*2).toFixed(1), 'fa-satellite': Math.floor(20+Math.random()*30),
            'fa-chart-line': (5+Math.random()*15).toFixed(0), 'fa-shield-alt': '' };
        return { icon: t.icon, text: t.text.replace('{val}', vals[t.icon]), risk: t.risk };
    }

    // Generate random SOS alert
    function generateSOSAlert(vesselOverride) {
        const westVessels = vessels.filter(v => v.lng < 77);
        const sourceVessels = westVessels.length > 0 ? westVessels : vessels;
        const vessel = vesselOverride || sourceVessels[Math.floor(Math.random() * sourceVessels.length)];
        const emergencyType = emergencyTypes[Math.floor(Math.random() * emergencyTypes.length)];
        const lat = vessel.lat + (Math.random() - 0.5) * 0.1;
        const lng = vessel.lng + (Math.random() - 0.5) * 0.1;
        return {
            id: 'SOS-' + Date.now(),
            vesselId: vessel.id,
            vesselName: vessel.name,
            vesselType: vessel.type,
            crew: vessel.crew,
            emergencyType,
            lat: lat.toFixed(4),
            lng: lng.toFixed(4),
            timestamp: new Date().toISOString(),
            severity: ['CRITICAL', 'HIGH', 'MEDIUM'][Math.floor(Math.random() * 3)],
            status: 'active',
            description: `${vessel.name} reporting ${emergencyType.toLowerCase()} at position ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E. ${vessel.crew} crew members on board.`
        };
    }

    // Move vessels slightly (simulate GPS updates)
    function updateVesselPositions() {
        vessels.forEach(v => {
            if (v.status === 'sos') return;
            const rad = v.heading * Math.PI / 180;
            const factor = v.speed * 0.0001;
            v.lat += Math.cos(rad) * factor * (0.8 + Math.random() * 0.4);
            v.lng += Math.sin(rad) * factor * (0.8 + Math.random() * 0.4);
            v.speed = Math.max(0, v.speed + (Math.random() - 0.5) * 0.5);
            v.heading = (v.heading + (Math.random() - 0.5) * 5 + 360) % 360;
        });
    }

    // Calculate distance between two points (nautical miles)
    function calcDistance(lat1, lng1, lat2, lng2) {
        const R = 3440.065; // Earth radius in nautical miles
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    // Find nearest rescue unit
    function findNearestRescue(lat, lng) {
        let nearest = null, minDist = Infinity;
        rescueUnits.forEach(r => {
            if (r.status === 'deployed') return;
            const d = calcDistance(lat, lng, r.lat, r.lng);
            if (d < minDist) { minDist = d; nearest = r; }
        });
        return nearest ? { unit: nearest, distance: minDist.toFixed(1), eta: Math.ceil(minDist / nearest.speed * 60) } : null;
    }

    return { vessels, rescueUnits, coastalStations, getWeatherData, getAIInsight, generateSOSAlert, updateVesselPositions, calcDistance, findNearestRescue, emergencyTypes };
})();
