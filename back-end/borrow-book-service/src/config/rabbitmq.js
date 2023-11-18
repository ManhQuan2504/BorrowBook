import amqplib from "amqplib"

const send_msg = async (messageData) => {
    try {
        const exchangeName = 'borrow_exchange';
        const connection = await amqplib.connect('amqps://thoccdtr:IR6Ogo4zDnw3izVujRqFhZb6xIh8Dr7X@octopus.rmq3.cloudamqp.com/thoccdtr');
        const channel = await connection.createChannel();

        // Đảm bảo exchange tồn tại
        await channel.assertExchange(exchangeName, 'direct', { durable: true });

        // Gửi thông điệp tới exchange với binding key là 'book_borrow'
        channel.publish(exchangeName, 'book_borrow', Buffer.from(JSON.stringify(messageData)));
        channel.publish(exchangeName, 'book_borrow1', Buffer.from(JSON.stringify(messageData)));


        console.log('Message sent:', messageData);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

const send_msg_return = async (messageData) => {
    try {
        const exchangeName = 'return_exchange';
        const connection = await amqplib.connect('amqps://thoccdtr:IR6Ogo4zDnw3izVujRqFhZb6xIh8Dr7X@octopus.rmq3.cloudamqp.com/thoccdtr');
        const channel = await connection.createChannel();

        // Đảm bảo exchange tồn tại
        await channel.assertExchange(exchangeName, 'direct', { durable: true });

        // Gửi thông điệp tới exchange với binding key là 'book_borrow'
        channel.publish(exchangeName, 'book_return', Buffer.from(JSON.stringify(messageData)));

        console.log('Message sent:', messageData);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

export default {
    send_msg,
    send_msg_return
}