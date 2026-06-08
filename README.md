# Hasfiyat API — Node.js SDK (Örnek İstemci)

Türkiye'nin gerçek zamanlı **altın, döviz ve parite fiyat API'si** [Hasfiyat API](https://altinapi.hasfiyat.com) için hafif bir Node.js istemcisi. **Harem Altın, Hakan Altın, Mayda Gold** dahil 11 canlı kaynaktan REST ve WebSocket ile fiyat çeker.

> Hasfiyat API; kuyumcular, döviz büroları ve e-ticaret için anlık altın & döviz fiyatlarını REST API, WebSocket ve Webhook üzerinden milisaniye gecikmeyle sağlar.

## Özellikler
- REST ile anlık fiyat: `getPrices(source)`
- WebSocket ile canlı akış: `stream(source, onData)`
- 11 kaynak: harem, hakan, mayda, akche, metal, nadir, anlik, saglamoglu, agora, fikri
- Otomatik yeniden bağlanma (WebSocket)

## Kurulum
```bash
npm install ws
```
`hasfiyat.js` dosyasını projenize ekleyin.

## Kullanım — REST (anlık altın fiyatları)
```js
const { HasfiyatClient } = require('./hasfiyat');
const client = new HasfiyatClient({ apiKey: 'API_ANAHTARINIZ' });

const prices = await client.getPrices('harem'); // Harem Altın
console.log(prices); // [{ title: 'HAS ALTIN', buy: '6.382,34', sell: '6.408,41' }, ...]
```

## Kullanım — WebSocket (canlı akış)
```js
const stop = client.stream('harem', (data) => console.log('Canlı:', data));
// stop();
```

## Desteklenen kaynaklar
Harem (`harem`), Hakan (`hakan`), Mayda Gold (`mayda`), Akche (`akche`), Metal (`metal`), Nadir Döviz (`nadir`), Anlık (`anlik`), Sağlamoğlu (`saglamoglu`), Agora (`agora`), Fikri Şahin (`fikri`).

## API anahtarı nasıl alınır?
[altinapi.hasfiyat.com](https://altinapi.hasfiyat.com)'da üye olun, paket seçip ödeyin, panelden API anahtarı + IP/domain whitelist ekleyin.

## Lisans
MIT
