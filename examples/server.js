const http = require('http');
const url = require('url');

const Router = require('../');

const router = new Router();
router.add('GET', '/', (req, res, params) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('root');
});

router.add('POST', '/post', (req, res, params) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('/post');
});

const app = http.createServer((req, res) => {
  const urlObj = url.parse(req.url);
  const result = router.route(req.method, urlObj.pathname, true);
  switch (result.type) {
  case 'found':
    result.value(req, res, Object.assign({}, urlObj.query, result.params));
    break;
  case 'not_found':
    res.writeHead(404);
    res.end();
    break;
  case 'method_not_allowed':
    res.writeHead(405);
    res.end(`Allowed methods are: ${result.allowed.join(', ')}`);
    break;
  }
});

const PORT = process.env.PORT || 8124;
const HOSTNAME = process.env.HOSTNAME || '127.0.0.1';
app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
