const http = require('http');

const PORT = Number(process.env.PORT || 3000);

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);

  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

function createServer() {
  return http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
      sendJson(res, 200, {
        app: 'devops-assignment-app',
        message: 'Node.js pipeline test app is running',
        status: 'ok'
      });
      return;
    }

    if (req.method === 'GET' && req.url === '/health') {
      sendJson(res, 200, {
        status: 'healthy'
      });
      return;
    }

    sendJson(res, 404, {
      error: 'Not found'
    });
  });
}

if (require.main === module) {
  createServer().listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = {
  createServer
};
