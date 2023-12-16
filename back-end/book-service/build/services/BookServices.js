import bookModel from "../models/bookModel.js"
import { Op } from 'sequelize';

const getBook = async ({ perPage, page }) => {
    try {
        const count = await bookModel.count();

        const countPage = Math.ceil(count / perPage);

        const data = await bookModel.findAll({
            limit: perPage,
            offset: (page - 1) * perPage
        });

        if (!count || !data.length) {
            throw new Error("Can't get Book");
        }

        const result = { count, countPage, data };
        return result;
    } catch (error) {
        throw error;
    }
};

const getDetailBook = async ({ idBook }) => {
    try {
        console.log(idBook);
        const data = await bookModel.findByPk(idBook.id);

        if (!data) {
            throw new Error("Can't get Book");
        }

        const result = { data };
        return result;
    } catch (error) {
        throw error;
    }
};



const searchBook = async ({ perPage, keyword, page }) => {
    const getKeyword = {
        [Op.or]: [
            { title: { [Op.like]: `%${keyword}%` } }, // Sử dụng Op.like để thực hiện truy vấn không phân biệt hoa thường
            { authorBook: { [Op.like]: `%${keyword}%` } },
        ]
    };

    const count = await bookModel.count({ where: getKeyword });
    const data = await bookModel.findAll({
        where: getKeyword,
        limit: perPage,
        offset: (page - 1) * perPage,
    });

    if (count === 0 || data.length === 0) {
        throw new Error("Không tìm thấy sách");
    }

    const result = { count, data };
    return result;
}

const createBook = async ({ idBook, title, category, countInStock, publishYear, authorBook }) => {
    // Tạo một bản ghi mới trong cơ sở dữ liệu bằng phương thức create
    const newBook = await bookModel.create({
        id: idBook,
        title: title,
        category: category,
        countInStock: countInStock,
        publishYear: publishYear,
        authorBook: authorBook,
    });

    if (!newBook) {
        throw new Error("Lỗi khi tạo sách: ", error);
    } else {
        return newBook;
    }
}

const updateBook = async ({ idBook, title, category, countInStock, publishYear, authorBook }) => {
    // Kiểm tra xem sách có tồn tại không
    const existingBook = await bookModel.findByPk(idBook);

    if (!existingBook) {
        throw new Error("Không tìm thấy sách");
    }

    existingBook.title = title;
    existingBook.category = category;
    existingBook.countInStock = countInStock;
    existingBook.publishYear = publishYear;
    existingBook.authorBook = authorBook;
    // Lưu các thay đổi
    const updatedBook = await existingBook.save();

    if (!updatedBook) {
        throw new Error("Không thể cập nhật sách");
    }
    return { updatedBook };
}

const deleteBook = async ({ idBook }) => {
    const deletedBook = await bookModel.findByPk(idBook);
    if (!deletedBook) {
        throw new Error("Không tìm thấy sách");
    }

    const deletedRowCount = await bookModel.destroy({ where: { id: idBook } });

    if (deletedRowCount === 0) {
        throw new Error("Không thể xóa sách");
    }

    return { deletedBook };
}

const borrowBook = async ({ id }) => {
    try {
        const [updatedRowCount, [borrowedBook]] = await bookModel.decrement(
            { countInStock: 1 },
            { where: { id: id }, returning: true }
        );

        if (updatedRowCount === 0 || !borrowedBook) {
            throw new Error("Không tìm thấy sách");
        }

        return { borrowedBook };
    } catch (error) {
        throw new Error(`Lỗi khi mượn sách: ${error.message}`);
    }
};
const getAllBookSearch = async (limit, page, type, key) => {
    try {
        let whereCondition = {};

        // Tạo điều kiện tìm kiếm gần đúng
        whereCondition[type] = {
            [Op.like]: `%${key}%`,
        };

        console.log('whereCondition', whereCondition);

        let allBooks = [];

        if (!limit) {
            allBooks = await bookModel.findAll({
                where: whereCondition,
                attributes: { exclude: ['image', 'password'] },
            });
        } else {
            const offset = (page - 1) * limit;
            allBooks = await bookModel.findAll({
                where: whereCondition,
                limit,
                offset,
            });
        }

        return {
            code: 200,
            success: true,
            message: 'Lấy danh sách sách thành công!',
            data: allBooks,
            total: allBooks.length,
            pageCurrent: Number(page),
            totalPage: limit ? Math.ceil(allBooks.length / limit) : 1,
        };
    } catch (e) {
        throw e;
    }
};

const returnBook = async ({ id }) => {
    try {
        const [updatedRowCount, [returnedBook]] = await bookModel.increment(
            { countInStock: 1 },
            { where: { id: id }, returning: true }
        );

        if (updatedRowCount === 0 || !returnedBook) {
            throw new Error("Không tìm thấy sách");
        }

        return { returnedBook };
    } catch (error) {
        throw new Error(`Lỗi khi trả lại sách: ${error.message}`);
    }
};

const exportExcel = async () => {
    try {
        const data = await bookModel.findAll();
        return data;
    } catch (error) {
        throw error;
    }
}


export default {
    getBook,
    getDetailBook,
    searchBook,
    createBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook,
    exportExcel,
    getAllBookSearch
}