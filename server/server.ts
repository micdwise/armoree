import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { rateLimit } from "express-rate-limit";
import ammunitionRouter from "./src/routes/ammunition";
import firearmsRouter from "./src/routes/firearms";

dotenv.config();

const app = express();
const port = process.env.PORT;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});

app.use(express.json());
app.use(limiter);
app.use("*", cors());

app.use((req, res, next) => {
  console.log("routing");
  next();
});

app.use("/api/v1/ammunition", ammunitionRouter);
app.use("/api/v1/firearms", firearmsRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
