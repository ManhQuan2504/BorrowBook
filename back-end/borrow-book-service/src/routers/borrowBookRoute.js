import express from "express";
import borrowBookController from "../controller/borrowBookController.js";

const router = express.Router();

router.get('/get', borrowBookController.getBorrowBook);

router.get('/search', borrowBookController.searchBorrowBook);

router.post('/create', borrowBookController.createBorrowBook);

router.put('/update/:id', borrowBookController.updateBorrowBook);

router.delete('/delete/:id', borrowBookController.deleteBorrowBook);

router.delete('/deletemany/:id', borrowBookController.deleteManyBorrowBook);

export default router;