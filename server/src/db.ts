import { Pool } from 'pg';
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool ({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_SERVER,
  database: process.env.DATABASE,
  password: process.env.DATABASE_USER_PASSWORD,
  port: 5432
});

export default pool;