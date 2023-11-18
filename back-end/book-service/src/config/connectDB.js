import { Sequelize } from "sequelize";

// Tạo hàm kết nối đến cơ sở dữ liệu
const connectToDatabase = async () => {
    const sequelize = new Sequelize('microservices', 'root', 'root', {
        host: 'localhost', // Thay đổi thành host của cơ sở dữ liệu MySQL
        dialect: 'mysql', // Sử dụng MySQL
    });

    try {
        return await sequelize.authenticate();
    } catch (error) {
        throw error;
    }
};

export default connectToDatabase;
