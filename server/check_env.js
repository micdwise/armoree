
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../.env');
const exists = fs.existsSync(envPath);
dotenv.config({ path: envPath });

const output = [
    `Current Dir: ${process.cwd()}`,
    `Env Path: ${envPath}`,
    `Exists: ${exists}`,
    `DATABASE_URL present: ${!!process.env.DATABASE_URL}`
].join('\n');

fs.writeFileSync('env_check.txt', output);
