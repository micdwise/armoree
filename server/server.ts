import express  from "express";
import * as dotenv from "dotenv";
import ammoRoutes from "./postgresApi/src/ammunition/routes";
import firearmRoutes from "./postgresApi/src/firearms/routes";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json())

app.get("/", (req, res) => {
  res.send("This is GET!");
});

app.post("/", (req, res) => {
  res.send("This is a POST!")
});

app.use("/api/v1/ammunition", ammoRoutes);
app.use("/api/v1/firearms", firearmRoutes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});