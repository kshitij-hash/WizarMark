const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

dotenv.config({ path: __dirname + '/.env' });

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
app.use(cors());

const userRoute = require('./routes/user');

const connectDB = require("./config/db");

app.use(express.json());

app.use("/api/user", userRoute);

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
