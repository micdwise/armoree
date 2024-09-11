const express = require("express")
const ammoRoutes = require("./postgresApi/src/ammunition/routes");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("This is only a shell!");
});

app.use("/api/v1/ammunition", ammoRoutes);

app.listen(port, () => console.log(`app listening on port ${port}`));