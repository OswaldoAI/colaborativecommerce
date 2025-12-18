import express from 'express';
import multer from 'multer';
import { createProduct, getProducts, updateProduct, deleteProduct, bulkUploadProducts } from '../controllers/product.controller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getProducts);
router.post('/', upload.single('image'), createProduct);
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);
router.post('/bulk', upload.single('file'), bulkUploadProducts);

export default router;
