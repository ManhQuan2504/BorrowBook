import express from "express";
import bookController from "../controllers/bookController.js";

const router = express.Router(); // Sử dụng `express.Router()` thay vì `Express.Router()`

router.get('/get', bookController.getBook);

router.get('/detail/:id', bookController.getDetailBook);

router.get('/search', bookController.searchBook);
router.get('/get-all-book-search', bookController.getAllBookSearch)


router.post('/create', bookController.createBook);

router.put('/update/:id', bookController.updateBook);

router.delete('/delete/:id', bookController.deleteBook);

router.delete('/deletemany/:id', bookController.deleteManyBook);

router.get('/export/', bookController.exportExcel);

export default router;
