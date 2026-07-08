const express = require('express');
const routes = require('./routes/routes.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
