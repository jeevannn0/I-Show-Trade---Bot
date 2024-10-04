// src/trader.js

class Trader {
    constructor() {
        this.balance = 10000; // Starting balance
        this.position = 0;     // Number of shares owned
        this.tradeHistory = []; // To record trades
    }

    updatePrice(symbol, price) {
        this.currentPrice = price;
        this.currentSymbol = symbol;
    }

    makeTrade(symbol) {
        // Simple trading strategy
        if (this.position === 0 && this.currentPrice < this.previousPrice * 0.98) { // Buy if price drops by 2%
            this.position += 1; // Buying 1 share for simplicity
            this.balance -= this.currentPrice;
            this.tradeHistory.push({ action: 'BUY', shares: 1, symbol, price: this.currentPrice });
        } else if (this.position > 0 && this.currentPrice > this.previousPrice * 1.03) { // Sell if price rises by 3%
            this.position -= 1; // Selling 1 share for simplicity
            this.balance += this.currentPrice;
            this.tradeHistory.push({ action: 'SELL', shares: 1, symbol, price: this.currentPrice });
        }
        this.previousPrice = this.currentPrice; // Store the current price for the next comparison
    }

    getSummary() {
        const totalProfitLoss = this.balance + (this.position * (this.currentPrice || 0)) - 10000; // Calculate profit/loss
        return {
            balance: this.balance,
            position: this.position,
            totalProfitLoss,
            tradeHistory: this.tradeHistory
        };
    }
}

module.exports = { Trader };
