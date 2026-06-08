'use strict';
// Hasfiyat API örnek kullanım — Node 18+ (global fetch)
const { HasfiyatClient } = require('./hasfiyat');

const client = new HasfiyatClient({
  apiKey: process.env.HASFIYAT_API_KEY || 'API_ANAHTARINIZ',
  token: process.env.HASFIYAT_TOKEN, // WebSocket için (opsiyonel)
});

(async () => {
  // 1) REST — Harem Altın anlık fiyatları
  const harem = await client.getPrices('harem');
  console.log('Harem Altın:', harem.slice(0, 3));

  // 2) REST — tek sembol
  const has = await client.getSymbol('harem', 'HAS ALTIN');
  console.log('HAS ALTIN:', has);

  // 3) WebSocket — canlı akış (token gerekir)
  if (process.env.HASFIYAT_TOKEN) {
    const stop = client.stream('harem', (data) => {
      console.log('Canlı:', Array.isArray(data) ? data[0] : data);
    });
    setTimeout(stop, 10000); // 10 sn sonra durdur
  }
})().catch(console.error);
