const crypto = require('crypto');
const { spawn } = require('child_process');
const API_KEY = require('../secrets.js');

const API_KEY_BUFFER = Buffer.from(String(API_KEY));

const checkAuthorization = (req, res, callback) => {
  const provided = req.headers['x-api-key'];
  if (typeof provided !== 'string') {
    return res.status(403).send({ code: 403, message: 'Incorrect API key!' });
  }
  const providedBuffer = Buffer.from(provided);
  const valid =
    providedBuffer.length === API_KEY_BUFFER.length &&
    crypto.timingSafeEqual(providedBuffer, API_KEY_BUFFER);
  if (!valid) {
    return res.status(403).send({ code: 403, message: 'Incorrect API key!' });
  }
  callback();
};

const appRouter = (app) => {
  app.get('/', (req, res) => {
    checkAuthorization(req, res, () => {
      res.status(200).send({ code: 200, message: 'Welcome to waterina' });
    });
  });

  app.post('/plants/:id/water', (req, res) => {
    checkAuthorization(req, res, () => {
      const plantId = req.params.id;
      const pythonScript = spawn('python', ['./scripts/pump_system.py', plantId]);

      pythonScript.stdout.on('data', (data) => {
        const response = JSON.parse(data);
        const status = response.result === 'OK' ? 200 : 400;
        res.status(status).send({ code: status, message: response.message });
      });
    });
  });
};

module.exports = appRouter;
