// src/api.js

const stockPrices = require('../mock-data/stockPrices.json');

function getMockStockPrices() {
    return new Promise((resolve) => {
        // Simulating an API call with mock data
        resolve(stockPrices);
    });
}

module.exports = { getMockStockPrices };
