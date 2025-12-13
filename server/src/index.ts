
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { registerTenant, ensurePublicTables } from './services/tenantService';

dotenv.config({ path: '../.env' }); // Load from root .env

console.log('Current directory:', process.cwd());
console.log('Looking for .env at:', require('path').resolve('../.env'));
console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

ensurePublicTables();

app.post('/api/register-tenant', async (req, res) => {
    try {
        const { tenantName, userId } = req.body;
        if (!tenantName || !userId) {
            res.status(400).json({ error: 'Tenant name and User ID are required' });
            return;
        }

        const result = await registerTenant(tenantName, userId);
        res.json(result);
    } catch (error: any) {
        console.error('Registration failed:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
