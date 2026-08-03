# 🌊 Sea Spam GIS Command Center

![Status](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Tech](https://img.shields.io/badge/Tech-HTML%20%7C%20CSS%20%7C%20JS-orange)

An interactive, AI-powered maritime emergency response and dispatch dashboard. **Sea Spam** provides a real-time, simulated command center environment designed to monitor vessel traffic, coordinate rescue operations, and handle SOS distress signals across the coast.

## ✨ Key Features

* **Interactive GIS Map:** Real-time rendering of active vessels, rescue units (like the ICG Mumbai Defender), and coastal stations using Leaflet.js.
* **SOS Drill Simulation:** Trigger simulated distress alerts on west-coast vessels. The AI dispatch engine automatically calculates the nearest rescue unit, ETA, and plots the optimal rescue route.
* **Light / Dark Mode:** Seamlessly toggle the entire UI and CartoDB map base-layers between high-contrast dark mode and clean light mode.
* **Live Analytics & Telemetry:** Monitors active SOS counts, rescue availability, simulated weather (sea states, wave heights), and generates real-time "AI Insights" for collision risks.
* **Secure Communications:** A simulated multi-channel radio traffic feed for Emergency, Rescue Ops, and Command coordination.

## 🚀 How to Run

Because this project is a purely front-end simulation, there are no dependencies to install or build steps required!

1. Clone this repository:
   ```bash
   git clone https://github.com/sudeshpoojary/seaspam.git
   ```
2. Open the project folder.
3. Simply double-click `index.html` to open the Command Center in your default web browser.

## 🛠️ Tech Stack

* **Structure:** HTML5
* **Styling:** Vanilla CSS3 (Custom properties, Flexbox/Grid, Animations)
* **Logic:** Vanilla JavaScript (ES6+)
* **Mapping:** [Leaflet.js](https://leafletjs.com/) with CartoDB tiles
* **Icons:** FontAwesome

## 🔮 Future Roadmap

* Connect to a real backend (Node.js/Python).
* Integrate actual real-time AIS vessel data APIs.
* Implement user authentication for dispatch operators.

---
*Created as a high-fidelity frontend simulation for maritime emergency management.*
