import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { pipeline } from '@xenova/transformers';

import {userRoute} from './routes/user.js';
import { aiRoute } from './routes/ai.js'; 


dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();
app.use(cors());

import connectDB from './config/db.js';

app.use(express.json());

app.use("/api/user", userRoute);
app.use("/api/ai", aiRoute);


const summarizer = await pipeline('summarization');

app.post('/summarize', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const summary = await summarizer(text, { max_length: 100, min_length: 30, do_sample: false });
    res.json({ summary: summary[0].summary_text });
  } catch (error) {
    console.error('Error while summarizing:', error);
    res.status(500).json({ error: 'Failed to summarize the text' });
  }
});



app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 7070;

connectDB()
  .then(async () => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to the database", error);
  });
