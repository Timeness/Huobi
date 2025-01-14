const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const results = document.getElementById('results');
const coinImage = document.getElementById('coinImage');
const coinName = document.getElementById('coinName');
const coinSymbol = document.getElementById('coinSymbol');
const marketCap = document.getElementById('marketCap');
const fullyDilutedValuation = document.getElementById('fullyDilutedValuation');
const tradingVolume = document.getElementById('tradingVolume');
const circulatingSupply = document.getElementById('circulatingSupply');
const maxSupply = document.getElementById('maxSupply');
const high24h = document.getElementById('high24h');
const low24h = document.getElementById('low24h');
const allTimeHigh = document.getElementById('allTimeHigh');
const allTimeLow = document.getElementById('allTimeLow');
const change24h = document.getElementById('change24h');
const change7d = document.getElementById('change7d');
const change14d = document.getElementById('change14d');
const change30d = document.getElementById('change30d');
const change60d = document.getElementById('change60d');
const change1y = document.getElementById('change1y');

async function fetchCryptoData(coin) {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}`);
    if (!response.ok) throw new Error('Coin not found');
    const data = await response.json();

    // Populate data
    coinImage.src = data.image.large;
    coinName.textContent = data.name;
    coinSymbol.textContent = `Symbol: ${data.symbol.toUpperCase()}`;
    marketCap.textContent = `Market Cap: $${data.market_data.market_cap.usd.toLocaleString()}`;
    fullyDilutedValuation.textContent = `Fully Diluted Valuation: $${data.market_data.fully_diluted_valuation.usd.toLocaleString()}`;
    tradingVolume.textContent = `Trading Volume: $${data.market_data.total_volume.usd.toLocaleString()}`;
    circulatingSupply.textContent = `Circulating Supply: ${data.market_data.circulating_supply.toLocaleString()} ${data.symbol.toUpperCase()}`;
    maxSupply.textContent = `Max Supply: ${data.market_data.max_supply?.toLocaleString() || 'N/A'}`;
    high24h.textContent = `24H High: $${data.market_data.high_24h.usd.toFixed(2)}`;
    low24h.textContent = `24H Low: $${data.market_data.low_24h.usd.toFixed(2)}`;
    allTimeHigh.textContent = `All-Time High: $${data.market_data.ath.usd.toFixed(2)} (${new Date(data.market_data.ath_date.usd).toLocaleDateString()})`;
    allTimeLow.textContent = `All-Time Low: $${data.market_data.atl.usd.toFixed(2)} (${new Date(data.market_data.atl_date.usd).toLocaleDateString()})`;
    change24h.textContent = `${data.market_data.price_change_percentage_24h.toFixed(2)}%`;
    change7d.textContent = `${data.market_data.price_change_percentage_7d.toFixed(2)}%`;
    change14d.textContent = `${data.market_data.price_change_percentage_14d.toFixed(2)}%`;
    change30d.textContent = `${data.market_data.price_change_percentage_30d.toFixed(2)}%`;
    change60d.textContent = `${data.market_data.price_change_percentage_60d.toFixed(2)}%`;
    change1y.textContent = `${data.market_data.price_change_percentage_1y.toFixed(2)}%`;

    results.classList.remove('hidden');
  } catch (error) {
    alert(error.message);
  }
}

searchBtn.addEventListener('click', () => {
  const coin = searchInput.value.trim().toLowerCase();
  if (coin) fetchCryptoData(coin);
});
