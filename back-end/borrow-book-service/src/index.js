import express, { json } from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import router from "./routers/index.js";

const app = express();
const PORT = process.env.PORT || 6666;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router(app);

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    app.listen((PORT), () => {
        console.log(`server is runing on: http://localhost:${PORT}`);
    });
})
.catch((error) => {
    console.log("Can't connect to Mongo: ", error.message);
})

