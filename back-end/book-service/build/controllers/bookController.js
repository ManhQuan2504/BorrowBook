import Joi from "joi";
import BookService from "../services/BookServices.js"
import shortid from "shortid";
import ExcelJS from "exceljs"
import message from "../message/index.js";

const Schema = Joi.object({
    title: Joi.string().label('title'),
    category: Joi.string().label('category'),
    countInStock: Joi.number().label('countInStock'),
    publishYear: Joi.date().label('publishYear'),
    authorBook: Joi.string().label('authorBook'),
});

const getBook = async (req, res) => {
    try {
        let perPage = parseInt(req.query.perpage) || 3;
        // perPage = Math.max(perPage, 3);
        let page = parseInt(req.query.page) || 1;
        page = Math.max(page, 1);

        const response = await BookService.getBook({ perPage, page });

        return message.MESSAGE_SUCCESS(res, 'OK', response);
    } catch (error) {
        return message.MESSAGE_ERROR(res, 'ERR', error.message)
    }
};
const getAllBookSearch = async (req, res) => {
    try {
        const { perPage, page, type, key } = req.query

        const response = await BookService.getAllBookSearch(Number(perPage) || null, Number(page) || 0, String(type) || 'id', String(key) || '')

        return res.status(response.code).json(response)

    } catch (e) {

        console.log('getAllUser err', e)

        return res.status(500).json({
            code: 500,
            success: false,
            message: e + ''
        })
    }
}

const getDetailBook = async (req, res) => {
    try {
        const idBook = req.params;

        const response = await BookService.getDetailBook({ idBook });

        return message.MESSAGE_SUCCESS(res, 'OK', response);
    } catch (error) {
        return message.MESSAGE_ERROR(res, 'ERR', error.message)
    }
};

const searchBook = async (req, res) => {
    try {
        const perPage = 2;
        let keyword = req.query.keyword || "";
        let page = parseInt(req.query.page) || 1;
        page = Math.max(page, 1);

        const response = await BookService.searchBook({ perPage, keyword, page });

        return message.MESSAGE_SUCCESS(res, 'OK', response);
    } catch (error) {
        return message.MESSAGE_ERROR(res, 'ERR', error.message)
    }
}

const createBook = async (req, res) => {
    try {
        const { title, category, countInStock, publishYear, authorBook } = req.body;
        if (!title || !category || !countInStock || !publishYear || !authorBook) {
            throw new Error(`Input is require`);
        }
        const validationInput = Schema.validate({ title, category, countInStock, publishYear, authorBook });
        if (validationInput.error) {
            const errorMessages = validationInput.error.details.map((error) => error.message);
            throw new Error(`Dữ liệu không hợp lệ: ${errorMessages.join(', ')}`);
        }

        const idBook = shortid.generate();

        const response = await BookService.createBook({ idBook, title, category, countInStock, publishYear, authorBook })

        return message.MESSAGE_SUCCESS(res, 'OK', response);
    } catch (error) {
        return message.MESSAGE_ERROR(res, 'ERR', error.message)
    }
};

const updateBook = async (req, res) => {
    try {
        const idBook = req.params.id;
        const { title, category, countInStock, publishYear, authorBook } = req.body;
        if (!title || !category || !countInStock || !publishYear || !authorBook) {
            throw new Error(`Input is require`);
        }
        const validationInput = Schema.validate({ title, category, countInStock, publishYear, authorBook });
        if (validationInput.error) {
            const errorMessages = validationInput.error.details.map((error) => error.message);
            throw new Error(`Dữ liệu không hợp lệ: ${errorMessages.join(', ')}`);
        }

        const response = await BookService.updateBook({ idBook, title, category, countInStock, publishYear, authorBook });

        return message.MESSAGE_SUCCESS(res, 'OK', response);
    } catch (error) {
        return message.MESSAGE_ERROR(res, 'ERR', error.message)
    }
};

const deleteBook = async (req, res) => {
    try {
        const idBook = req.params.id;
        if (!idBook) {
            throw new Error('Book ID is required');
        }

        const response = await BookService.deleteBook({ idBook });

        return message.MESSAGE_SUCCESS(res, 'OK', response);
    } catch (error) {
        return message.MESSAGE_ERROR(res, 'ERR', error.message)
    }
};

const deleteManyBook = async (req, res) => {
    try {

    } catch (error) {
        return res.status(400).json(
            {
                status: "ERR",
                error: error.message
            }
        )
    }
};

const borrowBook = async (message) => {
    try {
        const id = message.idBook;

        const response = await BookService.borrowBook({ id });

        return ({
            status: "OK",
            data: response
        })
    } catch (error) {
        return ({
            status: "ERR",
            message: error.message
        })
    }
};

const returnBook = async (req, res) => {
    try {
        const id = message.idBook;
        console.log({ id });

        const response = await BookService.returnBook({ id });

        return message.MESSAGE_SUCCESS(res, 'OK', response);
    } catch (error) {
        return message.MESSAGE_ERROR(res, 'ERR', error.message)
    }
};

const exportExcel = async (req, res) => {
    try {
        const response = await BookService.exportExcel();

        const workbook = new ExcelJS.Workbook();

        const sheet = workbook.addWorksheet('My Sheet', { properties: { tabColor: { argb: 'FFC0000' } } });

        sheet.columns = [
            { header: "Id", key: "id", width: 15 } || "",
            { header: "Tên sách", key: "title", width: 25 } || "",
            { header: "Thể loại", key: "category", width: 15 } || "",
            { header: "Số lượng", key: "countInStock", width: 15 } || "",
            { header: "Năm xuất bản", key: "publishYear", width: 15 } || "",
            { header: "Tác giả", key: "authorBook", width: 15 } || "",
        ];

        sheet.addRows(response);

        const buffer = await workbook.xlsx.writeBuffer();

        // Set content type, Set header Content-Disposition, 
        res.setHeader('Content-Disposition', 'attachment; filename=userData123.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        res.send(buffer);

    } catch (error) {
        return message.MESSAGE_ERROR(res, 'ERR', error.message)
    }
};


export default {
    getBook,
    getDetailBook,
    searchBook,
    createBook,
    updateBook,
    deleteBook,
    deleteManyBook,
    borrowBook,
    returnBook,
    exportExcel,
    getAllBookSearch
};
