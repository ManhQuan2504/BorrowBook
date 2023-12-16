import { Sequelize, DataTypes } from "sequelize";

  const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST, // Thay đổi thành host của cơ sở dữ liệu MySQL
        port: process.env.DB_PORT,
        dialect:  process.env.DB_DIALECT,
    });

const Book = sequelize.define('books', {
    id: {
        type: DataTypes.UUID, // Sử dụng kiểu UUID cho ID
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4, // Giá trị mặc định là UUID ngẫu nhiên
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    countInStock: {
        type: DataTypes.INTEGER, // Sử dụng kiểu INTEGER cho số lượng trong kho
        allowNull: false,
    },
    publishYear: {
        type: DataTypes.INTEGER, // Sử dụng kiểu INTEGER cho năm xuất bản
        allowNull: false,
    },
    authorBook: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true
});

export default Book;
