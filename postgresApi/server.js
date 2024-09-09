const express = require('express')
const ammoRoutes = require('./src/routes.js');

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hellow World!");
});

app.use("./api/v1/ammo", ammoRoutes);

app.listen(port, () => console.log(`app listening on port ${port}`));