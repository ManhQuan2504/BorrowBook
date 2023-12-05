const amqplib = require("amqplib")
const dotenv =require("dotenv");
dotenv.config();
const send_msg = async (messageData) => {
    const exchangeName = 'user_exchange';
    const connection = await amqplib.connect(process.env.AMQP_CLOUD_URL);
    const channel = await connection.createChannel();
    channel.assertExchange(exchangeName, 'direct', { durable: true });
    channel.publish(exchangeName, 'user_register', Buffer.from(JSON.stringify(messageData)));
}

module.exports = {
    send_msg
}