import mongoose from "mongoose";
import BorrowBookModel from "../models/borrowBookModel.js";
import { faker } from '@faker-js/faker';





const searchBorrowBook = async ({ perPage, status, page }) => {
  const statusValue = parseInt(status);

  if (isNaN(statusValue)) {
    return { count: 0, data: [] };
  }

  const getKeyword = {
    $or: [
      { status: statusValue } // Sử dụng keyword đã được chuyển đổi thành số
    ]
  };


  const count = await BorrowBookModel.countDocuments(getKeyword);
  const data = await BorrowBookModel
    .find(getKeyword)
    .limit(perPage)
    .skip((page - 1) * perPage);

  if (count === 0 || data.length === 0) {
    throw new Error("Không tìm thấy sách");
  }

  const result = { count, data };
  return result;
};

// const searchBorrowBookByDate = async ({ startDate, endDate, typeDate, page, perPage }) => {
//   try {
//     let matchQuery = {};
//     matchQuery[typeDate] = {
//       $gte: new Date(startDate),
//       $lte: new Date(endDate),
//     };

//     let typeSort = {};
//     typeSort[typeDate];

//     const data = await BorrowBookModel.aggregate([
//       {
//         $match: matchQuery,
//       },
//     ])
//       .sort({ typeSort: -1 })
//       .skip((page - 1) * perPage)
//       .limit(perPage);

//     const count = data.length;

//     if (data.length > 0) {
//       return { count, data };
//     } else {
//       throw new Error("No records found");
//     }
//   } catch (error) {
//     throw new Error(`Error searching for borrow books: ${error.message}`);
//   }

//   // try {
//   //   const data = await BorrowBookModel.aggregate([
//   //     {
//   //       $match: {
//   //         borrowDate: {
//   //           $gte: new Date(startDate),
//   //           $lte: new Date(endDate),
//   //         },
//   //       },
//   //     },
//   //   ])
//   //     .sort({ borrowDate: -1 })
//   //     .skip((page - 1) * perPage)
//   //     .limit(perPage);

//   //   const count = data.length;

//   //   // Check if there is any data returned
//   //   if (data.length > 0) {
//   //     return { count, data };
//   //   } else {
//   //     throw new Error("No records found");
//   //   }
//   // } catch (error) {
//   //   throw new Error(`Error searching for borrow books: ${error.message}`);
//   // }
// };

const getBorrowBook = async ({ perPage, page }) => {
  try {
    const count = await BorrowBookModel.countDocuments();

    const countPage = Math.ceil(count / perPage); // Sử dụng hàm Math.ceil để làm tròn lên
    const data = await BorrowBookModel
      .find()
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ borrowDate: -1 })


    // const { startDate, endDate } = req.body;
    // const data = await BorrowBookModel.aggregate([
    //     {
    //         $match: {
    //             borrowDate: {
    //                 $gte: new Date(startDate),
    //                 $lte: new Date(endDate),
    //             }
    //         }
    //     }
    // ]);

    if (!count || !data.length) {
      const result = { count: 0, countPage: 1, data: [] };
      return result;
    }

    const result = { count, countPage, data };
    return result;
  } catch (error) {
    throw error;
  }
};
const searchBorrowBookByDate = async ({ startDate, endDate, typeDate, page, perPage }) => {

      try {
    
    let matchQuery = {};
    let dataSearch = [];
    let dataSearchLength = [];
    let typeSort = {};
    if (startDate=='' || endDate==undefined || typeDate==undefined) {
      
      dataSearch = await BorrowBookModel
        .find()
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ borrowDate: -1 })

      dataSearchLength = await BorrowBookModel
        .find()
    } else {
      matchQuery[typeDate] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
      console.log("🚀 ~ file: borrowBookService.js:155 ~ searchBorrowBookByDate ~ matchQuery:", matchQuery)

      typeSort[typeDate] = -1;

      if (!page || !perPage) {
        dataSearch = await BorrowBookModel.aggregate([
          {
            $match: matchQuery,
          },
          {
            $sort: typeSort, // Sắp xếp theo typeSort giảm dần (-1)
          },
        ]);
        dataSearchLength = await BorrowBookModel.aggregate([
          {
            $match: matchQuery,
          },
          {
            $sort: typeSort, // Sắp xếp theo typeSort giảm dần (-1)
          },
        ]);
      } else {
        dataSearch = await BorrowBookModel.aggregate([
          {
            $match: matchQuery,
          },
          {
            $sort: typeSort,
          },
          {
            $skip: (page - 1) * perPage,
          },
          {
            $limit: perPage,
          },
        ]);
        dataSearchLength = await BorrowBookModel.aggregate([
          {
            $match: matchQuery,
          },
          {
            $sort: typeSort,
          }

        ]);
      }
    }


    const count = dataSearchLength.length;
    const countPage = Math.ceil(count / perPage); // Sử dụng hàm Math.ceil để làm tròn lên
    return { count, countPage, data: dataSearch };

  } catch (error) {
    throw new Error(`Error searching for borrow books: ${error.message}`);
  }
};

const aggregateByMonth = async ({ getBy, month, year }) => {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Parse mảng JSON từ getBy
    const parsedGetBy = JSON.parse(getBy);

    const data = await BorrowBookModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
          status: { $in: parsedGetBy },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          soLuong: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1, // Sắp xếp theo ngày
        },
      },
    ]);

    return data;

  } catch (error) {
    throw new Error(`Error searching for borrow books: ${error.message}`);
  }
};




const aggregateByMonth1 = async ({ month, year }) => {
  try {
    const startDate = new Date(year, month - 1, 1); // month - 1 vì tháng trong JavaScript bắt đầu từ 0
    const endDate = new Date(year, month, 0);
    const data = await BorrowBookModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
          status: 1
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          soLuong: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1, // Sắp xếp theo ngày
        },
      },
    ]);

    return data;

  } catch (error) {
    throw new Error(`Error searching for borrow books: ${error.message}`);
  }
};

const aggregateByMonth2 = async ({ month, year }) => {
  try {
    const startDate = new Date(year, month - 1, 1); // month - 1 vì tháng trong JavaScript bắt đầu từ 0
    const endDate = new Date(year, month, 0);
    const data = await BorrowBookModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
          status: 2,
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          soLuong: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1, // Sắp xếp theo ngày
        },
      },
    ]);

    return data;

  } catch (error) {
    throw new Error(`Error searching for borrow books: ${error.message}`);
  }
};


const searchBorrowBookByIdBookIdUser = async (keyWord) => {
  try {
    let query;
    if (mongoose.Types.ObjectId.isValid(keyWord)) {
      // Nếu keyWord là ObjectId, tìm kiếm theo idUser
      query = { idUser: new mongoose.Types.ObjectId(keyWord) };
    } else {
      // Nếu keyWord không phải là ObjectId, tìm kiếm theo idBook
      query = { idBook: keyWord };
    }

    const result = await BorrowBookModel.find(query);

    return { data: result };
  } catch (error) {
    console.error('Error in searchBorrowBookByIdBookIdUser:', error);
    return { error: 'An error occurred during the search.' };
  }
};




const createBorrowBook = async ({ idUser, idBook, borrowDate, dueDate, returnDate }) => {
  let borrowBookData = {
    idUser: idUser,
    idBook: idBook,
    borrowDate: borrowDate,
    dueDate: dueDate,
    status: 1,
  };

  // Kiểm tra nếu returnDate không tồn tại (null hoặc undefined) thì không thêm vào đối tượng
  if (returnDate !== null && returnDate !== undefined) {
    borrowBookData.returnDate = returnDate;
  }

  const newBorrowBook = new BorrowBookModel(borrowBookData);

  try {
    const createdBorrowBook = await newBorrowBook.save();
    return createdBorrowBook;
  } catch (error) {
    throw new Error(`Lỗi khi tạo đơn mượn sách: ${error.message}`);
  }
};

const createBorrowBookFaker = async ({ idUser, idBook, borrowDate, dueDate, returnDate, status, createdAt, updatedAt }) => {
  let borrowBookData = {
    idUser: idUser,
    idBook: idBook,
    borrowDate: borrowDate,
    dueDate: dueDate,
    status: status,
    createdAt: createdAt,
    updatedAt: updatedAt
  };

  // Kiểm tra nếu returnDate không tồn tại (null hoặc undefined) thì không thêm vào đối tượng
  if (returnDate !== null && returnDate !== undefined) {
    borrowBookData.returnDate = returnDate;
  }

  const newBorrowBook = new BorrowBookModel(borrowBookData);

  try {
    const createdBorrowBook = await newBorrowBook.save();
    return createdBorrowBook;
  } catch (error) {
    throw new Error(`Lỗi khi tạo đơn mượn sách: ${error.message}`);
  }
};

const updateBorrowBook = async ({ idBorrowBook, returnDate }) => {
  try {
    // Kiểm tra xem bản ghi mượn sách có tồn tại không
    const existingBorrowBook = await BorrowBookModel.findById(idBorrowBook);

    if (!existingBorrowBook) {
      throw new Error("Không tìm thấy bản ghi mượn sách");
    }

    existingBorrowBook.returnDate = returnDate;
    existingBorrowBook.status = 2;

    // Lưu các thay đổi
    const updatedBorrowBook = await existingBorrowBook.save();

    if (!updatedBorrowBook) {
      throw new Error("Không thể cập nhật bản ghi mượn sách");
    }

    return { updatedBorrowBook };
  } catch (error) {
    throw error;
  }
};

// const updateBorrowBook = async ({ idBorrowBook, idUser, idBook, returnDate, borrowDate, dueDate, status }) => {
//     try {
//         // Kiểm tra xem bản ghi mượn sách có tồn tại không
//         const existingBorrowBook = await BorrowBookModel.findById(idBorrowBook);

//         if (!existingBorrowBook) {
//             throw new Error("Không tìm thấy bản ghi mượn sách");
//         }

//         // Cập nhật thông tin mượn sách
//         existingBorrowBook.idUser = idUser;
//         existingBorrowBook.idBook = idBook;
//         existingBorrowBook.returnDate = returnDate;
//         existingBorrowBook.borrowDate = borrowDate;
//         existingBorrowBook.dueDate = dueDate;
//         existingBorrowBook.status = status;

//         // Lưu các thay đổi
//         const updatedBorrowBook = await existingBorrowBook.save();

//         if (!updatedBorrowBook) {
//             throw new Error("Không thể cập nhật bản ghi mượn sách");
//         }

//         return { updatedBorrowBook };
//     } catch (error) {
//         throw error;
//     }
// };

const deleteBorrowBook = async ({ idBorrowBook }) => {
  try {
    const deletedBorrowBook = await BorrowBookModel.findById(idBorrowBook);

    if (!deletedBorrowBook) {
      throw new Error("Không tìm thấy bản ghi mượn sách");
    }

    const deletedResult = await BorrowBookModel.findByIdAndDelete(idBorrowBook);

    if (!deletedResult) {
      throw new Error("Không thể xóa bản ghi mượn sách");
    }

    return { deletedBorrowBook };
  } catch (error) {
    throw error;
  }
};

const exportExcel = async () => {
  try {
    const data = await BorrowBookModel
      .find()
    if (!data.length) {
      throw new Error("Can't get BorrowBook");
    }
    const formattedData = data.map(item => {
      item.statusLabel = item.status === 1 ? 'Đang mượn' : (item.status === 2 ? 'Đã trả' : '');
      return item;
    });
    return formattedData;
  } catch (error) {
    throw error;
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
  exportExcel,
  searchBorrowBookByIdBookIdUser,
  createBorrowBookFaker
}