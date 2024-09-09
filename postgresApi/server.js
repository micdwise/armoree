const express = require("express")
const ammoRoutes = require("./src/ammunition/routes");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/ammunition", ammoRoutes);

app.listen(port, () => console.log(`app listening on port ${port}`));