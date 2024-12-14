const fs = require('fs');
const https = require('https');
const cors_proxy = require('cors-anywhere');

// SSL証明書の読み込み
const privateKey = fs.readFileSync('/etc/letsencrypt/live/cors-0x10.online/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/cors-0x10.online/fullchain.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// ホワイトリストの設定
const originWhitelist = ['https://kami-0x10.github.io']; // 許可するオリジンを指定

// CORSプロキシサーバーを作成
const proxy = cors_proxy.createServer({
  originWhitelist: originWhitelist,
  requireHeader: ['origin', 'x-requested-with'],
  removeHeaders: ['cookie', 'cookie2'],
});

// HTTPSサーバーでCORSプロキシを起動
const port = 443;
https.createServer(credentials, (req, res) => {
  proxy.emit('request', req, res);
}).listen(port, () => {
  console.log(`HTTPS CORS Anywhere server is running on port ${port}`);
});
