const amqplib = require("amqplib")

const send_msg = async (messageData) => {
    const exchangeName = 'user_exchange';
    const connection = await amqplib.connect('amqps://thoccdtr:IR6Ogo4zDnw3izVujRqFhZb6xIh8Dr7X@octopus.rmq3.cloudamqp.com/thoccdtr');
    const channel = await connection.createChannel();
    channel.assertExchange(exchangeName, 'direct', { durable: true });
    channel.publish(exchangeName, 'user_register', Buffer.from(JSON.stringify(messageData)));
}

module.exports = {
    send_msg
}