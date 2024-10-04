// src/bot.js

const fs = require('fs');
const { getMockStockPrices } = require('./api');
const { Trader } = require('./trader');

let trader = new Trader();
let tradingInterval; // Variable to hold the interval ID

function startTradingBot(io) {
    console.log('Trading bot started...');
    
    // Simulate price monitoring every 5 seconds
    tradingInterval = setInterval(async () => {
        const prices = await getMockStockPrices();
        prices.forEach(priceData => {
            const { symbol, price } = priceData;
            console.log(`Current price of ${symbol}: $${price}`);
            trader.updatePrice(symbol, price);
            trader.makeTrade(symbol);

            // Emit events to the frontend
            io.emit('priceUpdate', { symbol, price });
            io.emit('tradeAction', trader.getSummary());
        });
    }, 5000);
}

function stopTradingBot() {
    clearInterval(tradingInterval); // Clear the interval to stop trading
    console.log('Trading bot stopped...');
}

module.exports = { startTradingBot, stopTradingBot };
