import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import apiRoutes from './apiRoutes.js';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api8989', apiRoutes);


//FOR OPENAI API TESTING
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

//THE TEST ENDPOINT
app.get("/test-openai", async (req, res) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: "Hello, can you hear me?" }],
        });

        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        console.error("OpenAI error:", error);
        res.status(500).json({ error: error.message });
    }
});


// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
