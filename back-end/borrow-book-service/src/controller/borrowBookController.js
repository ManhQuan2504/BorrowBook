import Joi from "joi";
import borrowbookService from "../services/borrowBookService.js"
import rabbitmqFunc from "../config/rabbitmq.js";
import borrowBookService from "../services/borrowBookService.js";
import ExcelJS from "exceljs";

const Schema = Joi.object({
    returnDate: Joi.date().label('returnDate'),
    borrowDate: Joi.date().label('borrowDate'),
    dueDate: Joi.date().label('dueDate'),
    status: Joi.number().label('status'),
});

const getBorrowBook = async (req, res) => {
    try {
        const perPage = 3;
        let page = parseInt(req.query.page) || 1;
        page = Math.max(page, 1);

        const response = await borrowbookService.getBorrowBook({ perPage, page });
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

const searchBorrowBook = async (req, res) => {
    try {
        const perPage = 2;
        let status = req.query.status || "";
        let page = parseInt(req.query.page) || 1;
        page = Math.max(page, 1);

        const response = await borrowbookService.searchBorrowBook({ perPage, status, page });
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

const createBorrowBook = async (req, res) => {
    try {
        const { idUser, email, idBook, borrowDate, dueDate } = req.body;
        if (!idUser || !idBook || !borrowDate || !dueDate) {
            throw new Error(`Input is require`);
        }
        const validationInput = Schema.validate({ borrowDate, dueDate });
        if (validationInput.error) {
            const errorMessages = validationInput.error.details.map((error) => error.message);
            throw new Error(`Dữ liệu không hợp lệ: ${errorMessages.join(', ')}`);
        }

        const response = await borrowbookService.createBorrowBook({ idUser, idBook, borrowDate, dueDate })

        if (response && response != undefined) {
            const messageData = {
                type: 'borrow',
                email: email,
                idBook: idBook
            };

            rabbitmqFunc.send_msg(messageData)

            console.log(`Sent message: ${JSON.stringify(messageData)}`);
        }
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

const updateBorrowBook = async (req, res) => {
    try {
        const idBorrowBook = req.params.id;
        const { returnDate } = req.body;

        const response = await borrowbookService.updateBorrowBook({ idBorrowBook, returnDate });

        // if (response && response != undefined) {
        //     const messageData = {
        //         type: 'return',
        //         email: email,
        //         idBook: idBook
        //     };
        //     rabbitmqFunc.send_msg(messageData)
        //     console.log(`Sent message: ${JSON.stringify(messageData)}`);
        // }
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

// const updateBorrowBook = async (req, res) => {
//     try {
//         const idBorrowBook = req.params.id;
//         const { idUser, idBook, returnDate, borrowDate, dueDate, status } = req.body;
//         if (!idUser || !idBook || !returnDate || !borrowDate || !dueDate || !status) {
//             throw new Error(`Input is require`);
//         }
//         const validationInput = Schema.validate({ returnDate, borrowDate, dueDate, status });
//         if (validationInput.error) {
//             const errorMessages = validationInput.error.details.map((error) => error.message);
//             throw new Error(`Dữ liệu không hợp lệ: ${errorMessages.join(', ')}`);
//         }

//         const response = await borrowbookService.updateBorrowBook({ idBorrowBook, idUser, idBook, returnDate, borrowDate, dueDate, status });

//         return res.status(200).json(
//             {
//                 status: "OK",
//                 data: response
//             }
//         )

//     } catch (error) {
//         return res.status(400).json(
//             {
//                 status: "ERR",
//                 error: error.message
//             }
//         )
//     }
// };

const deleteBorrowBook = async (req, res) => {
    try {
        const idBorrowBook = req.params.id;
        if (!idBorrowBook) {
            throw new Error('BorowBook ID is required');
        }

        const response = await borrowbookService.deleteBorrowBook({ idBorrowBook });

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

const deleteManyBorrowBook = async (req, res) => {
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

const exportExcel = async (req, res) => {
    try {
        const response = await borrowBookService.exportExcel();
        console.log(response);
        
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Danh sách đơn mượn', { properties: { tabColor: { argb: 'FFC0000' } } });
        
        // Sửa: Loại bỏ dấu || ""
        sheet.columns = [
            { header: "Mã đơn", key: "id", width: 15 },
            { header: "Mã khách", key: "idUser", width: 25 },
            { header: "Mã sách", key: "idBook", width: 15 },
            { header: "Ngày mượn", key: "borrowDate", width: 15 },
            { header: "Ngày hẹn trả", key: "dueDate", width: 15 },
            { header: "Ngày trả", key: "returnDate", width: 15 },
            { header: "Trạng thái đơn", key: "statusLabel", width: 15 },
        ];
        
        sheet.addRows(response);
        
        const buffer = await workbook.xlsx.writeBuffer();
        
        // Set header Content-Disposition
        res.setHeader('Content-Disposition', 'attachment; filename=userData123.xlsx');
        // Set content type
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        
        res.send(buffer);
        

        // Không cần return trước khi gửi phản hồi
        // res.status(200).json({
        //     status: "OK",
        //     data: response
        // });
    } catch (error) {
        console.error(error); 
        res.status(500).json({
            status: "ERR",
            error: error.message // Truyền thông điệp lỗi trong phản hồi
        });
    }
};

export default {
    getBorrowBook,
    searchBorrowBook,
    createBorrowBook,
    updateBorrowBook,
    deleteBorrowBook,
    deleteManyBorrowBook,
    exportExcel
};
