import express from "express";
import dotenv from 'dotenv';
// import routes from './routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import amqplib from 'amqplib';
import SendMailController from "./controllers/SendMailController.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 7777;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

async function startReceiver() {
    const connection = await amqplib.connect(process.env.AMQP_CLOUD_URL_HH);
    const channel = await connection.createChannel();

    const userExchangeName = 'user_exchange';
    const userBindingKey = 'user_register';
    const userQueueName = 'send_mail_queue';

    const borrowExchangeName = 'borrow_exchange';
    const borrowBindingKey = 'book_borrow1';
    const borrowQueueName = 'book_borrow_queue';

    // Declare exchanges and queues for both receivers
    await Promise.all([
        channel.assertExchange(userExchangeName, 'direct', { durable: true }),
        channel.assertQueue(userQueueName, { durable: true }),
        channel.bindQueue(userQueueName, userExchangeName, userBindingKey),

        channel.assertExchange(borrowExchangeName, 'direct', { durable: true }),
        channel.assertQueue(borrowQueueName, { durable: true }),
        channel.bindQueue(borrowQueueName, borrowExchangeName, borrowBindingKey),
    ]);

    // Start both receivers
    await Promise.all([
        startReceiverForExchange(channel, userQueueName, SendMailController.SendMail_register),
        startReceiverForExchange(channel, borrowQueueName, handleBorrowExchangeMessage),
    ]);
}

async function startReceiverForExchange(channel, queueName, messageHandler) {
    await channel.consume(queueName, (msg) => {
        
        const message = JSON.parse(msg.content.toString());
        console.log('Received message||||:', message);
        messageHandler(message);
    }, { noAck: true });
    console.log(`Receiver for ${queueName} is waiting for messages.`);
}

async function handleBorrowExchangeMessage(message) {
    console.log('message',message)
    if (message.type === 'borrow') {
        SendMailController.SendMail_borrowBook(message);
    } else if (message.type === 'return') {
        SendMailController.SendMail_return(message);
    }
    
}


await Promise.all([
    app.listen(port, () => {
        console.log('Server is running in port: ' + port);
        startReceiver();
    })
]);
