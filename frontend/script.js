// ======================================
// 🚦 URBANFLOW - TRAFFIC MAP INITIALIZATION
// ======================================

// Initialize map (Palakkad coordinates)
var map = L.map('map').setView([10.7867, 76.6548], 13);

// OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Main traffic monitoring marker
var marker = L.marker([10.7867, 76.6548]).addTo(map);
marker.bindPopup("Traffic Monitoring Point").openPopup();


// ======================================
// 🚦 TRAFFIC ZONES
// ======================================

// Heavy Traffic Area (Red)
L.circle([10.7900, 76.6500], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map).bindPopup("Heavy Traffic");

// Moderate Traffic Area (Yellow)
L.circle([10.7800, 76.6600], {
    color: 'orange',
    fillColor: 'yellow',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map).bindPopup("Moderate Traffic");

// Clear Traffic Area (Green)
L.circle([10.7750, 76.6450], {
    color: 'green',
    fillColor: 'green',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map).bindPopup("Clear Road");


// ======================================
// 📊 LIVE TRAFFIC DATA FETCHING
// ======================================

async function fetchTrafficData() {
    try {
        const response = await fetch("http://localhost:5000/api/traffic");
        const data = await response.json();

        if (data) {
            document.getElementById("vehicleCount").innerText = data.vehicleCount;
            document.getElementById("pedestrianCount").innerText = data.pedestrianCount;
            document.getElementById("signalTimer").innerText = data.signalTimer;
        }

    } catch (error) {
        console.log("Traffic API not available yet.");
    }
}

// Initial call
fetchTrafficData();

// Refresh every 3 seconds
setInterval(fetchTrafficData, 3000);


// ======================================
// 🛡 SAFETY MODE
// ======================================

let currentRoute;       // Prevent multiple route stacking
let lastSafetyScore = 0;
let lightingDensity = 80;  // Default value


async function calculateSafety() {

    const mode = document.getElementById("safetyOption").value;

    try {
        const response = await fetch("/api/calculate-safety", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                lightingDensity: lightingDensity,
                footTraffic: 65,
                openBusinesses: 70,
                cctvDensity: 85,
                incidentRate: 25,
                sidewalkQuality: 75,
                avgSpeed: 60,
                signalTimer: 40,
                mode: mode
            })
        });

        const result = await response.json();

        lastSafetyScore = result.safetyScore;

        document.getElementById("safetyResult").innerText =
            "Safety Score: " + lastSafetyScore;

        drawSafeRoute(lastSafetyScore);

        // Smart signal adjustment logic
        if (lastSafetyScore < 50) {
            increaseGreenTime();
        }

    } catch (error) {
        console.log("Safety API not available yet.");
    }
}


// ======================================
// 🗺 DRAW SAFE ROUTE
// ======================================

function drawSafeRoute(score) {

    // Remove old route if exists
    if (currentRoute) {
        map.removeLayer(currentRoute);
    }

    let color = "green";

    if (score < 50) color = "red";
    else if (score < 75) color = "orange";

    currentRoute = L.polyline([
        [10.7867, 76.6548],
        [10.7900, 76.6600],
        [10.7950, 76.6650]
    ], {
        color: color,
        weight: 6
    }).addTo(map);
}


// ======================================
// 🚦 SMART SIGNAL CONTROL (Placeholder)
// ======================================

function increaseGreenTime() {
    console.log("Green signal time increased for safety.");
}


// ======================================
// 🌙 DYNAMIC NIGHT FACTOR SIMULATION
// ======================================

// Simulate changing lighting density every 5 sec
setInterval(() => {
    lightingDensity = Math.floor(Math.random() * 100);
}, 5000);
async function getLiveData(){
  const token = localStorage.getItem("token")

    const res = await fetch("http://localhost:5000/api/traffic/live",{
    headers:{ Authorization: token }
  })

  const data = await res.json()

  document.getElementById("hveh").textContent = data.vehicles
}
// fetch("http://localhost:3000/data")
//   .then(res => res.json())
//   .then(data => { console.log(data); });