import express from 'express';
import { facturaPut } from './factura.controller.js';
import { productosGet, productoPost } from '../productos/producto.controller.js'; 

const router = express.Router();

router.put('/facturas/:id/items/:itemId', facturaPut);

router.get('/productos/:id', productosGet);

router.post('/productos', productoPost);

export default router;