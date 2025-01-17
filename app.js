const { Bot, InlineKeyboard } = require("grammy");
const axios = require("axios");

const bot = new Bot("7846859544:AAFXz2gA72sYL46oyPaAQq_bB_5hKy22jUg");
let currentApi = "CoinGecko";

function formatResponse(data, apiName) {
    return `
${data.symbol.toUpperCase()}/USDT Market Info

  - Price : ${data.price} USDT
  - 24h Price change : ${data.priceChange24h} %
  - 7d Price changes : ${data.priceChange7d} %
  - 30d Price change : ${data.priceChange30d} %
  - 24h High : ${data.high24h} USDT
  - 24h Low : ${data.low24h} USDT
  - 24h Volume : ${data.volume24h} USDT
  - All Time high : ${data.allTimeHigh} USDT | ${data.athDaysAgo} days ago
  - All Time low : ${data.allTimeLow} USDT | ${data.atlDaysAgo} days ago

Statistics :

  - Market Cap : ${data.marketCap} USDT
  - Trading Volume : ${data.tradingVolume} USDT
  - Circulating Supply : ${data.circulatingSupply}

By ${apiName}
    `;
}

async function fetchFromCoinGecko(symbol) {
    const apiUrl = "https://api.coingecko.com/api/v3/coins/markets";
    try {
        const response = await axios.get(apiUrl, {
            params: {
                vs_currency: "usdt",
                ids: symbol.toLowerCase(),
            },
        });
        if (response.data.length === 0) return "Symbol not found on CoinGecko.";
        const coin = response.data[0];
        const daysSince = (dateString) => {
            const now = new Date();
            const past = new Date(dateString);
            return Math.floor((now - past) / (1000 * 60 * 60 * 24));
        };
        const data = {
            symbol: coin.id,
            price: coin.current_price,
            priceChange24h: coin.price_change_percentage_24h,
            priceChange7d: coin.price_change_percentage_7d_in_currency || "N/A",
            priceChange30d: coin.price_change_percentage_30d_in_currency || "N/A",
            high24h: coin.high_24h,
            low24h: coin.low_24h,
            volume24h: coin.total_volume,
            allTimeHigh: coin.ath,
            athDaysAgo: daysSince(coin.ath_date),
            allTimeLow: coin.atl,
            atlDaysAgo: daysSince(coin.atl_date),
            marketCap: coin.market_cap,
            tradingVolume: coin.total_volume,
            circulatingSupply: coin.circulating_supply,
        };
        return formatResponse(data, "CoinGecko");
    } catch (error) {
        return "Error fetching data from CoinGecko.";
    }
}

async function fetchFromBybit(symbol) {
    const apiUrl = `https://api.bybit.com/spot/v3/public/quote/ticker/24hr`;
    try {
        const response = await axios.get(apiUrl, {
            params: { symbol: `${symbol.toUpperCase()}USDT` },
        });
        const data = response.data.result;
        const result = {
            symbol: symbol,
            price: data.lastPrice,
            priceChange24h: data.priceChangePercent || "N/A",
            priceChange7d: "N/A",
            priceChange30d: "N/A",
            high24h: data.highPrice,
            low24h: data.lowPrice,
            volume24h: data.volume,
            allTimeHigh: "N/A",
            athDaysAgo: "N/A",
            allTimeLow: "N/A",
            atlDaysAgo: "N/A",
            marketCap: "N/A",
            tradingVolume: data.quoteVolume,
            circulatingSupply: "N/A",
        };
        return formatResponse(result, "Bybit");
    } catch (error) {
        return "Error fetching data from Bybit.";
    }
}

async function fetchFromBinance(symbol) {
    const apiUrl = `https://api.binance.com/api/v3/ticker/24hr`;
    try {
        const response = await axios.get(apiUrl, {
            params: { symbol: `${symbol.toUpperCase()}USDT` },
        });
        const data = response.data;
        const result = {
            symbol: symbol,
            price: data.lastPrice,
            priceChange24h: ((data.priceChangePercent) || "N/A"),
            priceChange7d: "N/A",
            priceChange30d: "N/A",
            high24h: data.highPrice,
            low24h: data.lowPrice,
            volume24h: data.volume,
            allTimeHigh: "N/A",
            athDaysAgo: "N/A",
            allTimeLow: "N/A",
            atlDaysAgo: "N/A",
            marketCap: "N/A",
            tradingVolume: data.quoteVolume,
            circulatingSupply: "N/A",
        };
        return formatResponse(result, "BINANCE")
    } catch{
       return "Internal Error";

}}

async function fetchFromKraken(symbol) {
    const apiUrl = `https://api.kraken.com/0/public/Ticker`;
    try {
        const response = await axios.get(apiUrl, {
            params: { pair: `${symbol.toUpperCase()}USDT` },
        });
        const pairKey = Object.keys(response.data.result)[0];
        const data = response.data.result[pairKey];
        const result = {
            symbol: symbol,
            price: data.c[0],
            priceChange24h: "N/A",
            priceChange7d: "N/A",
            priceChange30d: "N/A",
            high24h: data.h[0],
            low24h: data.l[0],
            volume24h: data.v[1],
            allTimeHigh: "N/A",
            athDaysAgo: "N/A",
            allTimeLow: "N/A",
            atlDaysAgo: "N/A",
            marketCap: "N/A",
            tradingVolume: "N/A",
            circulatingSupply: "N/A",
        };
        return formatResponse(result, "Kraken");
    } catch (error) {
        return "Error fetching data from Kraken.";
    }
}

async function fetchFromKuCoin(symbol) {
    const apiUrl = `https://api.kucoin.com/api/v1/market/stats`;
    try {
        const response = await axios.get(apiUrl, {
            params: { symbol: `${symbol.toUpperCase()}-USDT` },
        });
        const data = response.data.data;
        const result = {
            symbol: symbol,
            price: data.last,
            priceChange24h: "N/A",
            priceChange7d: "N/A",
            priceChange30d: "N/A",
            high24h: data.high,
            low24h: data.low,
            volume24h: data.vol,
            allTimeHigh: "N/A",
            athDaysAgo: "N/A",
            allTimeLow: "N/A",
            atlDaysAgo: "N/A",
            marketCap: "N/A",
            tradingVolume: "N/A",
            circulatingSupply: "N/A",
        };
        return formatResponse(result, "KuCoin");
    } catch (error) {
        return "Error fetching data from KuCoin.";
    }
}

async function fetchFromCoinMarketCap(symbol) {
    const apiKey = "72662a15-7bef-4c02-8261-8d689b41a0cf";
    const apiUrl = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";
    try {
        const response = await axios.get(apiUrl, {
            headers: { "X-CMC_PRO_API_KEY": apiKey },
            params: { symbol: symbol.toUpperCase() },
        });
        const data = response.data.data[symbol.toUpperCase()];
        const result = {
            symbol: symbol,
            price: data.quote.USDT.price,
            priceChange24h: data.quote.USDT.percent_change_24h,
            priceChange7d: data.quote.USDT.percent_change_7d || "N/A",
            priceChange30d: data.quote.USDT.percent_change_30d || "N/A",
            high24h: "N/A",
            low24h: "N/A",
            volume24h: data.quote.USDT.volume_24h,
            allTimeHigh: "N/A",
            athDaysAgo: "N/A",
            allTimeLow: "N/A",
            atlDaysAgo: "N/A",
            marketCap: data.quote.USDT.market_cap,
            tradingVolume: data.quote.USDT.volume_24h,
            circulatingSupply: data.circulating_supply,
        };
        return formatResponse(result, "CoinMarketCap");
    } catch (error) {
        return "Error fetching data from CoinMarketCap.";
    }
}

bot.command("data", async (ctx) => {
    const message = ctx.message.text.split(" ");
    const symbol = message[1];
    if (!symbol) return ctx.reply("Please provide a cryptocurrency symbol. Example: /data btc");
    let result;
    switch (currentApi) {
        case "CoinGecko":
            result = await fetchFromCoinGecko(symbol);
            break;
        case "Binance":
            result = await fetchFromBinance(symbol);
            break;
        case "Kraken":
            result = await fetchFromKraken(symbol);
            break;
        case "KuCoin":
            result = await fetchFromKuCoin(symbol);
            break;
        case "Bybit":
            result = await fetchFromBybit(symbol);
            break;
        case "CoinMarketCap":
            result = await fetchFromCoinMarketCap(symbol);
            break;
        default:
            result = "API not supported yet.";
    }
    ctx.reply(result);
});

bot.command("api", (ctx) => {
    const keyboard = new InlineKeyboard()
        .text("CoinGecko", "set_CoinGecko")
        .text("Binance", "set_Binance")
        .row()
        .text("Kraken", "set_Kraken")
        .text("KuCoin", "set_KuCoin")
        .row()
        .text("CoinMarketCap", "set_CoinMarketCap");
    ctx.reply(`Current API: ${currentApi}\nChoose a new API:`, { reply_markup: keyboard });
});

bot.callbackQuery(/^set_(.+)/, async (ctx) => {
    const api = ctx.match[1];
    currentApi = api;
    await ctx.answerCallbackQuery(`API set to ${api}`);
    await ctx.editMessageText(`Current API: ${currentApi}`);
});

bot.start();
