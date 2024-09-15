import express  from "express";
import * as dotenv from "dotenv";
import ammunitionRouter from "./src/routes/ammunition";
import firearmsRouter from "./src/routes/firearms";
import cors from "cors"

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json())

app.use('*', cors());

app.use ((req, res, next) => {
  console.log("routing");
  next();
});

app.use("/api/v1/ammunition", ammunitionRouter);
app.use("/api/v1/firearms", firearmsRouter);


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});