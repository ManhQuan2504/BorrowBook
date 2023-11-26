import BorrowBookModel from "../models/borrowBookModel.js";

const getBorrowBook = async ({ perPage, page }) => {
    try {
        const count = await BorrowBookModel.countDocuments();
    
        const countPage = Math.ceil(count / perPage); // Sử dụng hàm Math.ceil để làm tròn lên
        const data = await BorrowBookModel
            .find()
            .limit(perPage)
            .skip((page - 1) * perPage);

        if (!count || !data.length) {
            throw new Error("Can't get BorrowBook");
        }

        const result = { count, countPage, data };
        return result;
    } catch (error) {
        throw error;
    }
};



const searchBorrowBook = async ({ perPage, status, page }) => {
    const statusValue = parseInt(status);
    console.log('key ', status);

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


const createBorrowBook = async ({ idUser, idBook, borrowDate, dueDate }) => {
    const newBorrowBook = new BorrowBookModel({
        idUser: idUser,
        idBook: idBook,
        borrowDate: borrowDate,
        dueDate: dueDate,
        returnDate: null,
        status: 1,
    });

    const createdBorrowBook = await newBorrowBook.save();

    if (!createdBorrowBook) {
        throw new Error("Lỗi khi tạo sách: ");
    } else {
        return createdBorrowBook;
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
    createBorrowBook,
    updateBorrowBook,
    deleteBorrowBook,
    exportExcel
}