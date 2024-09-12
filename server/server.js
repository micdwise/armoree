const express = require("express")
const ammoRoutes = require("./postgresApi/src/ammunition/routes");
const firearmRoutes = require("./postgresApi/src/firearms/routes");

const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("This is GET!");
});

app.post("/", (req, res) => {
  res.send("This is a POST!")
});

app.use("/api/v1/ammunition", ammoRoutes);
app.use("/api/v1/firearms", firearmRoutes);

app.listen(port, () => console.log(`App listening on port ${port}`));