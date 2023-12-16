import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectToDatabase from "./config/connectDB.js";
import connectToAMQP from "./config/connectAMQP.js";
import routes from "./routers/index.js";
import cors from "cors"

const app = express();
const PORT = process.env.PORT || 5555;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app); 

connectToDatabase()
    .then((sequelize) => {
        // Do something with the Sequelize instance if needed
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            connectToAMQP();
        });
    })
    .catch((error) => {
        console.log("Can't connect to the database: ", error.message);
    });