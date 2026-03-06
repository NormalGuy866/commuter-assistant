// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Populate station dropdowns
    populateStationDropdowns();
    
    // Handle trip form submission
    const tripForm = document.getElementById('trip-form');
    if (tripForm) {
        tripForm.addEventListener('submit', function(e) {
            e.preventDefault();
            planTrip();
        });
    }
    
    // Handle step-by-step card click
    const stepByStepCard = document.getElementById('step-by-step-card');
    if (stepByStepCard) {
        stepByStepCard.addEventListener('click', function() {
            // Scroll to the planner
            document.querySelector('.quick-planner').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }
});

// Function to populate dropdowns with stations
function populateStationDropdowns() {
    const fromSelect = document.getElementById('from-station');
    const toSelect = document.getElementById('to-station');
    
    if (!fromSelect || !toSelect) return;
    
    // Clear existing options except the first one
    fromSelect.innerHTML = '<option value="">Select starting station</option>';
    toSelect.innerHTML = '<option value="">Select destination</option>';
    
    // Get all stations from all lines
    const allStations = getAllStations();
    
    // Add stations to both dropdowns
    allStations.sort().forEach(station => {
        const option1 = document.createElement('option');
        option1.value = station;
        option1.textContent = station;
        fromSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = station;
        option2.textContent = station;
        toSelect.appendChild(option2);
    });
}

// Function to get all unique stations from all lines
function getAllStations() {
    const stations = new Set();
    
    for (let line in transitData) {
        transitData[line].stations.forEach(station => {
            stations.add(station);
        });
    }
    
    return Array.from(stations);
}

// Function to find which line a station belongs to
function findStationLine(stationName) {
    const lines = [];
    
    for (let line in transitData) {
        if (transitData[line].stations.includes(stationName)) {
            lines.push(line);
        }
    }
    
    return lines;
}

// Main trip planning function
function planTrip() {
    const fromStation = document.getElementById('from-station').value;
    const toStation = document.getElementById('to-station').value;
    const resultDiv = document.getElementById('trip-result');
    
    // Validation
    if (!fromStation || !toStation) {
        alert('Please select both stations');
        return;
    }
    
    if (fromStation === toStation) {
        alert('Starting point and destination cannot be the same');
        return;
    }
    
    // Find which lines these stations are on
    const fromLines = findStationLine(fromStation);
    const toLines = findStationLine(toStation);
    
    // Check if they're on the same line
    const commonLine = fromLines.find(line => toLines.includes(line));
    
    let steps = [];
    let warning = '';
    let estimatedFare = 0;
    
    if (commonLine) {
        // Same line - direct route
        steps = generateDirectRoute(fromStation, toStation, commonLine);
        estimatedFare = calculateFare(fromStation, toStation, commonLine);
    } else {
        // Need to transfer
        const transferResult = findTransferRoute(fromStation, toStation, fromLines, toLines);
        steps = transferResult.steps;
        warning = transferResult.warning;
        estimatedFare = transferResult.fare;
    }
    
    // Display the result
    displayTripResult(steps, warning, estimatedFare, fromStation, toStation);
}

// Generate direct route steps
function generateDirectRoute(from, to, line) {
    const lineData = transitData[line];
    const fromIndex = lineData.stations.indexOf(from);
    const toIndex = lineData.stations.indexOf(to);
    
    const direction = fromIndex < toIndex ? "forward" : "backward";
    const stationCount = Math.abs(toIndex - fromIndex);
    
    let steps = [];
    steps.push(`🚉 Board the ${lineData.name} at ${from}`);
    
    if (direction === "forward") {
        steps.push(`⬆️ Train direction: ${lineData.stations[lineData.stations.length - 1]} (end of line)`);
    } else {
        steps.push(`⬇️ Train direction: ${lineData.stations[0]} (end of line)`);
    }
    
    steps.push(`🛤️ You will pass through ${stationCount} station${stationCount > 1 ? 's' : ''}`);
    steps.push(`✅ Alight at ${to} - your destination`);
    
    // Add landmark if available
    if (stationLandmarks[to]) {
        steps.push(`📍 Look for: ${stationLandmarks[to].join(', ')}`);
    }
    
    // Add wrong train warning
    if (line === "mrt3") {
        if (from === "North Avenue") {
            steps.push(`⚠️ IMPORTANT: Make sure the train is heading toward TAFT, not staying at North Ave`);
        } else if (from === "Taft Avenue") {
            steps.push(`⚠️ IMPORTANT: Make sure the train is heading toward NORTH AVE, not staying at Taft`);
        }
    }
    
    return steps;
}

// Find transfer route
function findTransferRoute(from, to, fromLines, toLines) {
    // Simplified logic - in real app, this would be more sophisticated
    // For now, assume transfer at common transfer points
    
    let steps = [];
    let warning = "";
    let fare = 0;
    
    // Find possible transfer points
    for (let transferPoint in transferPoints) {
        const transferLines = transferPoints[transferPoint];
        
        // Check if this transfer point connects our lines
        const connectsFrom = fromLines.some(line => transferLines.includes(transitData[line].name));
        const connectsTo = toLines.some(line => transferLines.includes(transitData[line].name));
        
        if (connectsFrom && connectsTo) {
            // Found a transfer point
            const firstLine = fromLines[0];
            const lastLine = toLines[0];
            
            steps = [
                ...generateDirectRoute(from, transferPoint, firstLine),
                `🔄 TRANSFER: Alight at ${transferPoint}`,
                `🚶 Walk to the ${transitData[lastLine].name} platform`,
                ...generateDirectRoute(transferPoint, to, lastLine)
            ];
            
            fare = calculateFare(from, transferPoint, firstLine) + 
                   calculateFare(transferPoint, to, lastLine);
            
            warning = `⚠️ You need to transfer at ${transferPoint}. Follow the signs carefully.`;
            
            break;
        }
    }
    
    // If no transfer found, provide a default message
    if (steps.length === 0) {
        steps = [
            `No direct route found. You may need to take a jeepney or taxi between stations.`,
            `From ${from}, take a jeep to a major transfer point like EDSA or Cubao.`
        ];
        fare = 0;
        warning = "⚠️ This route requires multiple transfers. Consider asking station staff for help.";
    }
    
    return { steps, warning, fare };
}

// Calculate fare (simplified)
function calculateFare(from, to, line) {
    const lineData = transitData[line];
    const fareData = fareMatrix[line];
    
    if (!lineData || !fareData) return 0;
    
    const fromIndex = lineData.stations.indexOf(from);
    const toIndex = lineData.stations.indexOf(to);
    
    if (fromIndex === -1 || toIndex === -1) return 0;
    
    const stationCount = Math.abs(toIndex - fromIndex);
    const fare = fareData.baseFare + (stationCount * fareData.perStation);
    
    // Round to nearest whole number (PHP)
    return Math.round(fare);
}

// Display trip result
function displayTripResult(steps, warning, fare, from, to) {
    const resultDiv = document.getElementById('trip-result');
    
    let html = `
        <h4>🚆 Trip Plan: ${from} → ${to}</h4>
    `;
    
    if (warning) {
        html += `<p style="color: #e67e22; font-weight: bold;">${warning}</p>`;
    }
    
    if (fare > 0) {
        html += `<p><strong>Estimated Fare:</strong> ₱${fare}</p>`;
    }
    
    html += `<ol>`;
    steps.forEach(step => {
        html += `<li>${step}</li>`;
    });
    html += `</ol>`;
    
    // Add "Wrong train prevention" tip
    html += `
        <div style="margin-top: 15px; padding: 10px; background: #fff3cd; border-radius: 5px;">
            <p style="margin: 0; color: #856404;">
                <strong>💡 First-time tip:</strong> Double-check the train's sign before boarding. 
                When in doubt, ask station staff or fellow commuters.
            </p>
        </div>
    `;
    
    resultDiv.innerHTML = html;
    resultDiv.style.display = 'block';
}