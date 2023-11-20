import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import router from "./routers/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 1234;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router(app);

app.get('/', (req, res) => {
  res.status(200).json({
    'name': "MQ"
  })
})

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Couldn't connect to MongoDB:", error.message);
  });
