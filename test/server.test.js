const assert = require('node:assert/strict');
const test = require('node:test');
const { createServer } = require('../src/server');

function startTestServer() {
  const server = createServer();

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, () => {
      const { port } = server.address();
      resolve({
        baseUrl: `http://127.0.0.1:${port}`,
        close: () => new Promise((done) => server.close(done))
      });
    });
  });
}

test('GET / returns app status', async () => {
  const app = await startTestServer();

  try {
    const response = await fetch(`${app.baseUrl}/`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.status, 'ok');
    assert.equal(body.app, 'devops-assignment-app');
  } finally {
    await app.close();
  }
});

test('GET /health returns healthy status. ', async () => {
  const app = await startTestServer();

  try {
    const response = await fetch(`${app.baseUrl}/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.status, 'healthy');
  } finally {
    await app.close();
  }
});
