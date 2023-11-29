import amqplib from "amqplib";
import bookController from "../controllers/bookController.js";

async function recieveMsg() {
  try {
      const connection = await amqplib.connect(process.env.AMQP_CLOUD_URL_HH);
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

export default recieveMsg