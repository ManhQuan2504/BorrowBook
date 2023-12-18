import Joi from "joi";
import rabbitmqFunc from "../config/rabbitmq.js";
import borrowBookService from "../services/borrowBookService.js";
import ExcelJS from "exceljs";
import message from "../message/index.js";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
const Schema = Joi.object({
  returnDate: Joi.date().label('returnDate'),
  borrowDate: Joi.date().label('borrowDate'),
  dueDate: Joi.date().label('dueDate'),
  status: Joi.number().label('status')
});
const getBorrowBook = async (req, res) => {
  try {
    let perPage = parseInt(req.query.perpage) || 3;
    // perPage = Math.max(perPage, 3);
    let page = parseInt(req.query.page) || 1;
    page = Math.max(page, 1);
    const response = await borrowBookService.getBorrowBook({
      perPage,
      page
    });
    return message.MESSAGE_SUCCESS(res, 'OK', response);
  } catch (error) {
    return message.MESSAGE_ERROR(res, 'ERR', error.message);
  }
};
const searchBorrowBook = async (req, res) => {
  try {
    const perPage = 2;
    let status = req.query.status || "";
    let page = parseInt(req.query.page) || 1;
    page = Math.max(page, 1);
    const response = await borrowBookService.searchBorrowBook({
      perPage,
      status,
      page
    });
    return message.MESSAGE_SUCCESS(res, 'OK', response);
  } catch (error) {
    return message.MESSAGE_ERROR(res, 'ERR', error.message);
  }
};
const searchBorrowBookByIdBookIdUser = async (req, res) => {
  try {
    const {
      keyWord
    } = req.query;
    const response = await borrowBookService.searchBorrowBookByIdBookIdUser(keyWord);
    return message.MESSAGE_SUCCESS(res, 'OK', response);
  } catch (error) {
    return message.MESSAGE_ERROR(res, 'ERR', error.message);
  }
};
const createBorrowBook = async (req, res) => {
  try {
    const {
      idUser,
      email,
      idBook,
      borrowDate,
      dueDate
    } = req.body;
    if (!idUser || !idBook || !borrowDate || !dueDate) {
      throw new Error(`Input is require`);
    }
    const validationInput = Schema.validate({
      borrowDate,
      dueDate
    });
    if (validationInput.error) {
      const errorMessages = validationInput.error.details.map(error => error.message);
      throw new Error(`Dữ liệu không hợp lệ: ${errorMessages.join(', ')}`);
    }
    const response = await borrowBookService.createBorrowBook({
      idUser,
      idBook,
      borrowDate,
      dueDate
    });
    if (response && response != undefined) {
      const messageData = {
        type: 'borrow',
        email: email,
        idBook: idBook
      };
      rabbitmqFunc.send_msg(messageData);
      console.log(`Sent message: ${JSON.stringify(messageData)}`);
    }
    return message.MESSAGE_SUCCESS(res, 'OK', response);
  } catch (error) {
    return message.MESSAGE_ERROR(res, 'ERR', error.message);
  }
};
const updateBorrowBook = async (req, res) => {
  try {
    const idBorrowBook = req.params.id;
    const {
      returnDate
    } = req.body;
    const response = await borrowBookService.updateBorrowBook({
      idBorrowBook,
      returnDate
    });
    return message.MESSAGE_SUCCESS(res, 'OK', response);
  } catch (error) {
    return message.MESSAGE_ERROR(res, 'ERR', error.message);
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

//         const response = await borrowBookService.updateBorrowBook({ idBorrowBook, idUser, idBook, returnDate, borrowDate, dueDate, status });

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
    const response = await borrowBookService.deleteBorrowBook({
      idBorrowBook
    });
    return message.MESSAGE_SUCCESS(res, 'OK', response);
  } catch (error) {
    return message.MESSAGE_ERROR(res, 'ERR', error.message);
  }
};
const deleteManyBorrowBook = async (req, res) => {
  try {} catch (error) {
    return message.MESSAGE_ERROR(res, 'ERR', error.message);
  }
};
const exportExcel = async (req, res) => {
  try {
    const response = await borrowBookService.exportExcel();
    console.log(response);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Danh sách đơn mượn', {
      properties: {
        tabColor: {
          argb: 'FFC0000'
        }
      }
    });

    // Sửa: Loại bỏ dấu || ""
    sheet.columns = [{
      header: "Mã đơn",
      key: "id",
      width: 15
    }, {
      header: "Mã khách",
      key: "idUser",
      width: 25
    }, {
      header: "Mã sách",
      key: "idBook",
      width: 15
    }, {
      header: "Ngày mượn",
      key: "borrowDate",
      width: 15
    }, {
      header: "Ngày hẹn trả",
      key: "dueDate",
      width: 15
    }, {
      header: "Ngày trả",
      key: "returnDate",
      width: 15
    }, {
      header: "Trạng thái đơn",
      key: "statusLabel",
      width: 15
    }];
    sheet.addRows(response);
    const buffer = await workbook.xlsx.writeBuffer();

    // Set content type, Set header Content-Disposition
    res.setHeader('Content-Disposition', 'attachment; filename=userData123.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);

    // Không cần return trước khi gửi phản hồi
    // res.status(200).json({
    //     status: "OK",
    //     data: response
    // });
  } catch (error) {
    return message.MESSAGE_ERROR(res, 'ERR', error.message);
  }
};
const searchBorrowBookByDate = async (req, res) => {
  try {
    let startDate = req.query.startdate;
    let endDate = req.query.enddate;
    let typeDate = req.query.typedate;
    let perPage = parseInt(req.query.perpage) || 3;
    // perPage = Math.max(perPage, 3);
    let page = parseInt(req.query.page) || 1;
    page = Math.max(page, 1);
    if (!startDate || !endDate || !typeDate) {
      throw new Error("Invalid date range");
    }
    const response = await borrowBookService.searchBorrowBookByDate({
      startDate,
      endDate,
      typeDate,
      page,
      perPage
    });
    return message.MESSAGE_SUCCESS(res, 'OK', response);
  } catch (error) {
    return message.MESSAGE_ERROR(res, 'ERR', error.message);
  }
};
const aggregateByMonth = async (req, res) => {
  try {
    const getBy = req.query.type;
    const month = req.query.month;
    const year = req.query.year;
    console.log(getBy);
    const response = await borrowBookService.aggregateByMonth({
      getBy,
      month,
      year
    });
    return message.MESSAGE_SUCCESS(res, 'OK', response);
  } catch (error) {
    return message.MESSAGE_ERROR(res, 'ERR', error.message);
  }
};
const aggregateByMonth1 = async (req, res) => {
  try {
    const month = req.query.month;
    const year = req.query.year;
    const response = await borrowBookService.aggregateByMonth1({
      month,
      year
    });
    return message.MESSAGE_SUCCESS(res, 'OK', response);
  } catch (error) {
    return message.MESSAGE_ERROR(res, 'ERR', error.message);
  }
};
const aggregateByMonth2 = async (req, res) => {
  try {
    const month = req.query.month;
    const year = req.query.year;
    const response = await borrowBookService.aggregateByMonth2({
      month,
      year
    });
    return message.MESSAGE_SUCCESS(res, 'OK', response);
  } catch (error) {
    return message.MESSAGE_ERROR(res, 'ERR', error.message);
  }
};
const fakeBorrow = async (req, res) => {
  try {
    let arrFakeBorrow = [];
    const numberOfRecordsToAdd = 100; // Số lượng bản ghi bạn muốn thêm

    const startDate = new Date('2022-01-01');
    const endDate = new Date('2023-12-31');
    const userIDs = ['65546ae838e2e69a9806a3e5', '6565580dbe66433658e1db50', '65655af6baa16ea91b60e85d', '65655f5fc53055338a50cbb1', '65656265fbeb7a9a3c256708', '65656281fbeb7a9a3c25670d', '656568ebfbeb7a9a3c256722', '65656afdfbeb7a9a3c256734', '65656c25775ab31d5fd1daac', '65656c40775ab31d5fd1dab1', '65656d20ca6d1a76ba808d8b', '65656dcd9ef523d9dcd72d49', '65656e06adea7bef85b7a657', '65656e3badea7bef85b7a65c', '65658beed1748212f5e8fb28', '65752f90211ce8b0c4d652ee'];
    const bookIDs = ['E74d5ZCtW', 'f75h7rRrC', 'HZSXZu18P', 'KZ-2yV6Bv', 'mEJY1tRDI', 'Pv5_I7r7e', 'qUIT47V04', 'Sa8ObYUzZ', 'wZdxXwz0W'];
    for (let index = 0; index < numberOfRecordsToAdd; index++) {
      const borrowDate = faker.date.between(startDate, endDate);
      const dueDate = faker.date.between(borrowDate, endDate);
      const randomIndexUserID = Math.floor(Math.random() * userIDs.length);
      const randomUserID = userIDs[randomIndexUserID];
      const randomIndexBookId = Math.floor(Math.random() * bookIDs.length);
      const randomBookID = bookIDs[randomIndexBookId];
      let returnDate = ""; // Đặt giá trị mặc định là chuỗi rỗng
      let status = 1;

      // Ngẫu nhiên quyết định có set returnDate hay không
      if (Math.random() < 0.5) {
        returnDate = faker.date.between(startDate, endDate).toISOString(); // Chuyển ngày sang chuỗi ISO
        status = 2;
      }
      const createdAt = faker.date.between(startDate, endDate);
      const updatedAt = faker.date.between(createdAt, endDate);
      let fakeBorrow = {
        idUser: randomUserID,
        idBook: randomBookID,
        borrowDate: borrowDate,
        dueDate: dueDate,
        returnDate: returnDate,
        status: status,
        createdAt: createdAt,
        updatedAt: updatedAt
      };
      arrFakeBorrow.push(fakeBorrow);
    }

    // Gọi hàm createBorrowBook từ borrowBookService cho tất cả các bản ghi
    const promises = arrFakeBorrow.map(async fakeBorrow => {
      return await borrowBookService.createBorrowBookFaker({
        idUser: fakeBorrow.idUser,
        idBook: fakeBorrow.idBook,
        borrowDate: fakeBorrow.borrowDate,
        dueDate: fakeBorrow.dueDate,
        returnDate: fakeBorrow.returnDate,
        status: fakeBorrow.status,
        createdAt: fakeBorrow.createdAt,
        updatedAt: fakeBorrow.updatedAt
      });
    });
    await Promise.all(promises);
    return res.status(200).json({
      status: "ok",
      data: arrFakeBorrow
    });
  } catch (error) {
    console.error('Error creating fake borrow:', error);
    return res.status(500).json({
      error: 'Internal Server Error'
    });
  }
};
export default {
  getBorrowBook,
  searchBorrowBook,
  searchBorrowBookByDate,
  aggregateByMonth,
  aggregateByMonth1,
  aggregateByMonth2,
  createBorrowBook,
  updateBorrowBook,
  deleteBorrowBook,
  deleteManyBorrowBook,
  exportExcel,
  searchBorrowBookByIdBookIdUser,
  fakeBorrow
};