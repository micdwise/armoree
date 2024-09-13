import express  from "express";
import * as dotenv from "dotenv";
import ammunitionRouter from "./postgresApi/src/routes/ammunition";
import firearmsRouter from "./postgresApi/src/routes/firearms";

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

app.use("/api/v1/ammunition", ammunitionRouter);
app.use("/api/v1/firearms", firearmsRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});