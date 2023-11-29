import amqplib from "amqplib"

import dotenv from "dotenv";
dotenv.config();
const send_msg = async (messageData) => {

    try {
        const exchangeName = 'borrow_exchange';
        const connection = await amqplib.connect(process.env.AMQP_CLOUD_URL_HH);
        const channel = await connection.createChannel();

        // Đảm bảo exchange tồn tại
        await channel.assertExchange(exchangeName, 'direct', { durable: true });

        // Gửi thông điệp tới exchange với binding key là 'book_borrow'
        channel.publish(exchangeName, 'book_borrow_user', Buffer.from(JSON.stringify(messageData)));
        // channel.publish(exchangeName, 'book_borrow_book', Buffer.from(JSON.stringify(messageData)));


        // console.log('Message sent:', messageData);
        // await connection.close();
        
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

const send_msg_return = async (messageData) => {
    try {

        const exchangeName = 'return_exchange';
        const connection = await amqplib.connect(process.env.AMQP_CLOUD_URL_HH);

        const channel = await connection.createChannel();

        // Đảm bảo exchange tồn tại
        await channel.assertExchange(exchangeName, 'direct', { durable: true });

        // Gửi thông điệp tới exchange với binding key là 'book_return'
        await channel.publish(exchangeName, 'book_return', Buffer.from(JSON.stringify(messageData)));

        console.log('Message sent:', messageData);

        // Đóng kết nối sau khi gửi tin nhắn
        await connection.close();
    } catch (error) {
        console.error('Error sending message:', error);
    }
};


export default {
    send_msg_borrow,
    send_msg_return
}