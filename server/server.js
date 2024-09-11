const express = require("express")
const ammoRoutes = require("./postgresApi/src/ammunition/routes");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("This is GET!");
});

app.post("/", (req, res) => {
  res.send("This is a POST!")
});

app.use("/api/v1/ammunition", ammoRoutes);

app.listen(port, () => console.log(`App listening on port ${port}`));