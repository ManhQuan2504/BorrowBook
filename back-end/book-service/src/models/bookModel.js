import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize('microservices', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
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
