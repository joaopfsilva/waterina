var appRouter = function(app) {
  app.get("/", function(req, res) {
    res.status(200).send({code: 200, message: 'Welcome to waterina'});
  });

  app.get("/plants/:id/water", function(req,res) {
    var plant_id = req.params.id;

    const spawn = require('child_process').spawn;
    const pythonScript = spawn('python', ['scripts/pump_system.py', plant_id]);

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


}

module.exports = appRouter;
