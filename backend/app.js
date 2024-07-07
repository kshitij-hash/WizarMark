import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';

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
