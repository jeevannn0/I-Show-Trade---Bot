// src/script.js

const socket = io();

let tradingActive = false; // To track if trading is active

const ctx = document.getElementById('priceChart').getContext('2d');

let chartData = {
    labels: [],
    datasets: [{
        label: 'Stock Price',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false,
    }]
};

const priceChart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
        scales: {
            y: { beginAtZero: false }
        }
    }
});

// Listen for price updates
socket.on('priceUpdate', (data) => {
    if (!tradingActive) return; // Only process if trading is active

    const { symbol, price } = data;

    // Update chart data
    if (!chartData.labels.includes(symbol)) {
        chartData.labels.push(symbol);
    }

    chartData.datasets[0].data.push(price); // Ensure correct data reference
    
    // Ensure we don't exceed the chart's visible data points
    if (chartData.datasets[0].data.length > 20) {
        chartData.labels.shift(); // Remove the first label
        chartData.datasets[0].data.shift(); // Remove the first data point
    }

    // Update chart
    priceChart.update();
});

// Listen for trade actions
socket.on('tradeAction', (summary) => {
    const { balance, position, totalProfitLoss, tradeHistory } = summary;
    const tradeSummaryDiv = document.getElementById('summary');

    tradeSummaryDiv.innerHTML = `
        <h3>Trade Summary</h3>
        <p>Balance: $${balance.toFixed(2)}</p>
        <p>Position: ${position} shares</p>
        <p>Total Profit/Loss: $${totalProfitLoss.toFixed(2)}</p>
        <h4>Trade History</h4>
        <ul>
            ${tradeHistory.map(trade => `<li>${trade.action} ${trade.shares} ${trade.symbol} at $${trade.price}</li>`).join('')}
        </ul>
    `;
});

// Function to show the popup
function showPopup(message) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popupMessage');
    popupMessage.innerText = message;
    popup.classList.remove('hidden'); // Show the popup
}

// Close popup button functionality
document.getElementById('closePopupButton').addEventListener('click', () => {
    const popup = document.getElementById('popup');
    popup.classList.add('hidden'); // Hide the popup
});

// Start trade button functionality
document.getElementById('startTradeButton').addEventListener('click', () => {
    if (!tradingActive) {
        tradingActive = true; // Set trading to active
        console.log('Trading started!'); // Log the start
        socket.emit('startTrading'); // Notify the server to start trading
        showPopup('Trading started!'); // Show popup
    } else {
        console.log('Trading is already active!');
    }
});

// Stop trade button functionality
document.getElementById('stopTradeButton').addEventListener('click', () => {
    if (tradingActive) {
        tradingActive = false; // Set trading to inactive
        console.log('Trading stopped!'); // Log the stop
        socket.emit('stopTrading'); // Notify the server to stop trading
        showPopup('Trading stopped!'); // Show popup
    } else {
        console.log('Trading is already stopped!');
    }
});
