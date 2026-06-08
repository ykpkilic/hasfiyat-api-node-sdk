'use strict';
// Hasfiyat API — Node.js örnek istemci (https://altinapi.hasfiyat.com)
// Gerçek zamanlı altın & döviz fiyatları: REST + WebSocket. 11 kaynak.

const REST_BASE = 'https://api.hasfiyat.com';
const WS_BASE = 'wss://api.hasfiyat.com';

class HasfiyatClient {
  /** @param {{apiKey:string, token?:string}} opts */
  constructor({ apiKey, token } = {}) {
    if (!apiKey) throw new Error('apiKey gerekli — altinapi.hasfiyat.com panelinden alın.');
    this.apiKey = apiKey;
    this.token = token; // WebSocket için JWT (panelden / get-socket-token)
  }

  /** REST: bir kaynağın anlık fiyatları. source: harem, hakan, mayda, ... */
  async getPrices(source = 'harem') {
    const url = `${REST_BASE}/api/prices?source=${encodeURIComponent(source)}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });
    if (!res.ok) throw new Error(`Hasfiyat API hatası: ${res.status} ${await res.text()}`);
    const data = await res.json();
    return data.data || data;
  }

  /** REST: tek sembol (örn. HAS ALTIN) */
  async getSymbol(source, symbol) {
    const list = await this.getPrices(source);
    return list.find((x) => (x.title || '').toUpperCase() === symbol.toUpperCase()) || null;
  }

  /**
   * WebSocket: canlı akış. token gerekir (panelden alınan JWT).
   * @returns {() => void} bağlantıyı durduran fonksiyon
   */
  stream(source, onData, onError) {
    if (!this.token) throw new Error('WebSocket için token gerekli (panelden alın).');
    const WebSocket = require('ws');
    let ws, closed = false, retry = 0;
    const connect = () => {
      const url = `${WS_BASE}/stream?source=${encodeURIComponent(source)}&token=${this.token}`;
      ws = new WebSocket(url);
      ws.on('message', (buf) => {
        try { onData(JSON.parse(buf.toString())); } catch (e) { /* yoksay */ }
      });
      ws.on('error', (e) => { if (onError) onError(e); });
      ws.on('close', () => {
        if (closed) return;
        retry = Math.min(retry + 1, 6);
        setTimeout(connect, 1000 * retry); // otomatik yeniden bağlan
      });
      ws.on('open', () => { retry = 0; });
    };
    connect();
    return () => { closed = true; try { ws.close(); } catch (_) {} };
  }
}

module.exports = { HasfiyatClient };
