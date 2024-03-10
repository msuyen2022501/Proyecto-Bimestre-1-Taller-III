import express from 'express';
import { completarCompra, editarFactura, obtenerFacturasUsuario } from './factura.controller.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = express.Router();

router.post('/factura', validarJWT, completarCompra);
router.put('/:id', validarJWT, editarFactura);
router.get('/:usuarioId/facturas', obtenerFacturasUsuario);


export default router;
