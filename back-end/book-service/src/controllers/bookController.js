import Joi from "joi";
import BookService from "../services/BookServices.js"
import shortid from "shortid";

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
        perPage = Math.max(perPage, 3);
        let page = parseInt(req.query.page) || 1;
        page = Math.max(page, 1);

        const response = await BookService.getBook({ perPage, page });
        return res.status(200).json(
            {
                status: "OK",
                data: response
            }
        )

    } catch (error) {
        return res.status(400).json(
            {
                status: "ERR",
                error: error.message
            }
        )
    }
};

const searchBook = async (req, res) => {
    try {
        const perPage = 2;
        let keyword = req.query.keyword || "";
        let page = parseInt(req.query.page) || 1;
        page = Math.max(page, 1);

        const response = await BookService.searchBook({ perPage, keyword, page });
        return res.status(200).json(
            {
                status: "OK",
                data: response
            }
        )

    } catch (error) {
        return res.status(400).json(
            {
                status: "ERR",
                error: error.message
            }
        )
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
        console.log(idBook, title, category, countInStock, publishYear, authorBook);

        const response = await BookService.createBook({ idBook, title, category, countInStock, publishYear, authorBook })

        return res.status(200).json(
            {
                status: "OK",
                data: response
            }
        )

    } catch (error) {
        return res.status(400).json(
            {
                status: "ERR",
                error: error.message
            }
        )
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

        return res.status(200).json(
            {
                status: "OK",
                data: response
            }
        )

    } catch (error) {
        return res.status(400).json(
            {
                status: "ERR",
                error: error.message
            }
        )
    }
};

const deleteBook = async (req, res) => {
    try {
        const idBook = req.params.id;
        if (!idBook) {
            throw new Error('Book ID is required');
        }

        const response = await BookService.deleteBook({ idBook });

        return res.status(200).json(
            {
                status: "OK",
                data: response
            }
        )
    } catch (error) {
        return res.status(400).json(
            {
                status: "ERR",
                error: error.message
            }
        )
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
        console.log({ id });
        const response = await BookService.borrowBook({ id });
        return {
            status: "OK",
            data: response
        }
    } catch (error) {
        return {
            status: "ERR",
            error: error.message,
        }
    }
};

const returnBook = async (message) => {
    try {
        const id = message.idBook;
        console.log({ id });
        const response = await BookService.returnBook({ id });
        return {
            status: "OK",
            data: response
        }
    } catch (error) {
        return {
            status: "ERR",
            error: error.message,
        }
    }
};

export default {
    getBook,
    searchBook,
    createBook,
    updateBook,
    deleteBook,
    deleteManyBook,
    borrowBook,
    returnBook
};
