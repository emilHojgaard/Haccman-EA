import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import apiRoutes from './apiRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api8989', apiRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
