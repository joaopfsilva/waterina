const API_KEY = require('../secrets.js');

const checkAuthorization = (req, res, callback) => {
  if(req.headers['x-api-key'] === API_KEY) {
    callback();
  } else {
    res.status(403).send({code: 403, message: 'Incorrect API key!'});
  }
}

const appRouter = function(app) {
  app.get("/", function(req, res) {
    checkAuthorization(req, res, () => {
      res.status(200).send({code: 200, message: 'Welcome to waterina'});
    });
  });

  app.get("/plants/:id/water", function(req,res) {
    checkAuthorization(req, res, () => {
      const plant_id = req.params.id;
      const spawn = require('child_process').spawn;
      const pythonScript = spawn('python', ['./scripts/pump_system.py', plant_id]);

      pythonScript.stdout.on('data', (data) => {
        response = JSON.parse(data);
        if (response.result === 'OK') {
          status = 200;
        } else if (response.result === 'NOK') {
          status = 400;
        }
        res.status(status).send({code: status, message: response.message});
      });
    });
  });
}

module.exports = appRouter;
