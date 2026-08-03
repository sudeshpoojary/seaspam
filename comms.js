/* ===== MarineTime - Communications Module ===== */
const CommsSystem = (() => {
    const channels = {
        emergency: [],
        rescue: [],
        command: []
    };
    let activeChannel = 'emergency';

    const autoMessages = {
        emergency: [
            { sender: 'Chennai MRCC', text: 'All stations, all stations. This is Chennai MRCC. Routine traffic broadcast on VHF Ch-16.', type: 'system' },
            { sender: 'NAVTEX', text: 'Weather advisory: SW monsoon active. Fishermen advised caution beyond 60nm offshore.', type: 'system' },
            { sender: 'V005 - Coral Queen', text: 'Chennai MRCC, Coral Queen. Position 13.25N 80.55E. All well. Proceeding to port.', type: 'normal' },
        ],
        rescue: [
            { sender: 'SAR Coordinator', text: 'All rescue units: standby status confirmed. Report any anomalies.', type: 'system' },
            { sender: 'ICG Alpha', text: 'SAR Coordinator, Alpha. Position 13.10N 80.30E. Fuel 85%. Ready for tasking.', type: 'normal' },
        ],
        command: [
            { sender: 'Command Center', text: 'System check complete. All sensors nominal. Coverage 100%.', type: 'system' },
            { sender: 'AI Module', text: 'Predictive analytics updated. Current risk level: MODERATE for sectors NE-3, NE-4.', type: 'system' },
        ]
    };

    function init() {
        // Load initial messages
        Object.keys(autoMessages).forEach(ch => {
            autoMessages[ch].forEach(m => {
                channels[ch].push({ ...m, time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) });
            });
        });
        renderMessages();
        setupEventListeners();
    }

    function setupEventListeners() {
        document.querySelectorAll('.channel-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.channel-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeChannel = btn.dataset.channel;
                renderMessages();
            });
        });

        const input = document.getElementById('comm-text');
        const sendBtn = document.getElementById('btn-send');

        sendBtn.addEventListener('click', () => sendMessage(input));
        input.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(input); });
    }

    function sendMessage(input) {
        const text = input.value.trim();
        if (!text) return;
        addMessage(activeChannel, 'Command Center', text, 'normal');
        input.value = '';
        // Simulate auto-response
        setTimeout(() => {
            const responses = [
                'Roger, Command Center. Message received.',
                'Copy that. Standing by for further instructions.',
                'Acknowledged. Will comply.',
                'Message received. Updating status.',
            ];
            const responder = activeChannel === 'emergency' ? 'Chennai MRCC' : activeChannel === 'rescue' ? 'SAR Coordinator' : 'AI Module';
            addMessage(activeChannel, responder, responses[Math.floor(Math.random() * responses.length)], 'system');
        }, 1500 + Math.random() * 2000);
    }

    function addMessage(channel, sender, text, type = 'normal') {
        const msg = {
            sender, text, type,
            time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
        channels[channel].push(msg);
        if (channel === activeChannel) renderMessages();
    }

    function addSOSMessage(alert) {
        addMessage('emergency', 'SOS RELAY', `⚠️ MAYDAY MAYDAY MAYDAY. ${alert.vesselName} reporting ${alert.emergencyType}. Position: ${alert.lat}°N, ${alert.lng}°E. ${alert.crew} POB. Requesting immediate assistance.`, 'emergency');
        setTimeout(() => {
            addMessage('rescue', 'SAR Coordinator', `URGENT: Tasking available units for ${alert.vesselName}. ${alert.emergencyType} at ${alert.lat}°N, ${alert.lng}°E.`, 'emergency');
        }, 800);
        setTimeout(() => {
            addMessage('command', 'AI Module', `Alert processed. Nearest rescue unit identified. Dispatch recommendation generated. Risk assessment: ${alert.severity}.`, 'system');
        }, 1200);
    }

    function renderMessages() {
        const container = document.getElementById('comm-messages');
        const msgs = channels[activeChannel];
        container.innerHTML = msgs.map(m => `
            <div class="comm-msg ${m.type}">
                <div class="comm-msg-header">
                    <span class="comm-sender">${m.sender}</span>
                    <span class="comm-time">${m.time}</span>
                </div>
                <div class="comm-text">${m.text}</div>
            </div>
        `).join('');
        container.scrollTop = container.scrollHeight;
    }

    // Periodic simulated radio traffic
    function simulateTraffic() {
        const trafficMsgs = [
            { ch: 'emergency', sender: 'FV Sea Harvest', text: 'Chennai MRCC, Sea Harvest. Position update: 12.50N 80.80E. Fishing ops normal.', type: 'normal' },
            { ch: 'rescue', sender: 'ICG Charlie', text: 'SAR Coordinator, Charlie. Completed sector patrol. Returning to station.', type: 'normal' },
            { ch: 'command', sender: 'IoT Gateway', text: `Sensor batch received: ${Math.floor(15+Math.random()*20)} readings processed. All nominal.`, type: 'system' },
            { ch: 'emergency', sender: 'MV Trade Winds', text: 'Chennai MRCC, Trade Winds. Position 13.60N 81.20E. Requesting weather update for sector E.', type: 'normal' },
            { ch: 'command', sender: 'AI Module', text: `Traffic density analysis complete. ${Math.floor(3+Math.random()*4)} vessels in monitored lanes.`, type: 'system' },
        ];
        const msg = trafficMsgs[Math.floor(Math.random() * trafficMsgs.length)];
        addMessage(msg.ch, msg.sender, msg.text, msg.type);
    }

    return { init, addMessage, addSOSMessage, simulateTraffic, renderMessages };
})();
