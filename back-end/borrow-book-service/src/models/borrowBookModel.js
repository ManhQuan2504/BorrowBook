import mongoose from "mongoose";

const borrowbookSchema = new mongoose.Schema(
    {
        idUser: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        idBook: {
            type: String,
            required: true,
        },
        returnDate: {
            type: Date,
            required: true,
        },
        borrowDate: {
            type: Date,
            required: true,
        },
        dueDate: {
            type: Date,
            required: false,
        },
        status: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true // Thay vì "timeseries", đúng là "timestamps"
    }
);

const BorrowBook = mongoose.model('borrowbooks', borrowbookSchema);
export default BorrowBook;
