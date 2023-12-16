import express from "express";
import borrowBookController from "../controller/borrowBookController.js";

const router = express.Router();

router.get('/get', borrowBookController.getBorrowBook);

router.get('/search', borrowBookController.searchBorrowBook);

router.get('/searchbydate', borrowBookController.searchBorrowBookByDate);

router.get('/aggregatebymonth', borrowBookController.aggregateByMonth);

router.get('/aggregatebymonth1', borrowBookController.aggregateByMonth1);

router.get('/aggregatebymonth2', borrowBookController.aggregateByMonth2);

router.get('/search-borrow-by-idBook-idUser', borrowBookController.searchBorrowBookByIdBookIdUser);

router.post('/create', borrowBookController.createBorrowBook);

router.put('/update/:id', borrowBookController.updateBorrowBook);

router.delete('/delete/:id', borrowBookController.deleteBorrowBook);

router.delete('/deletemany/:id', borrowBookController.deleteManyBorrowBook);

router.get('/export', borrowBookController.exportExcel);

router.get('/faker', borrowBookController.fakeBorrow);

export default router;