import express from "express";
import dotenv from "dotenv";
dotenv.config();
import amqplib from "amqplib";
import connectToDatabase from "./config/connectDB.js";
import routes from "./routers/index.js";
import bookController from "./controllers/bookController.js";
import cors from "cors"

const app = express();
const PORT = process.env.PORT || 5555;
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app); 

async function recieveMsg() {
    try {
        const connection = await amqplib.connect('amqps://thoccdtr:IR6Ogo4zDnw3izVujRqFhZb6xIh8Dr7X@octopus.rmq3.cloudamqp.com/thoccdtr');
        const channel = await connection.createChannel();

        const exchangeName = 'borrow_exchange'; // Chắc chắn cùng một exchange
        const bindingKey = 'book_borrow'; // Chắc chắn cùng một binding key
        const queue = 'book_borrow_queue';

        await channel.assertExchange(exchangeName, 'direct', { durable: true });
        await channel.assertQueue(queue, { durable: true });
        await channel.bindQueue(queue, exchangeName, bindingKey);

        // Listen for messages
        await channel.consume(queue, (msg) => {
            const message = JSON.parse(msg.content.toString());
            const messageS = msg.content.toString(); // chỉ log ra chứ k dùng
            console.log(`Received message: ${messageS}`);  //chỉ để log ra chứ k dùng

            // Kiểm tra giá trị của trường type
            if (message.type === "borrow") {
                bookController.borrowBook(message);
            } else if (message.type === "return") {
                bookController.returnBook(message);
            }
        }, { noAck: true });

        console.log('Waiting for messages. To exit press CTRL+C');
    } catch (error) {
        console.log('Error:', error.message);
    }
}


connectToDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            recieveMsg();
        });
    })
    .catch((error) => {
        console.log("Can't connect to MongoDB: ", error.message);
    });
