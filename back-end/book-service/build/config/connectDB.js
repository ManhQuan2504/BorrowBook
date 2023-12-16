import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
const connectToDatabase = async () => {
    const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST, // Thay đổi thành host của cơ sở dữ liệu MySQL
        port: process.env.DB_PORT,
        dialect:  process.env.DB_DIALECT,
    });

    try {
        await sequelize.authenticate();
        console.log('Connection MySQL successful.');
        return sequelize; // Returning the Sequelize instance can be useful for further configuration or model definition.
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
        throw error;
    }
};

export default connectToDatabase;
