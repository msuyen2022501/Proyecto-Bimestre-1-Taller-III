import express from 'express';
import { agregarAlCarrito } from './carrito.controller.js';
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = express.Router();

router.post('/',validarJWT,  agregarAlCarrito, validarCampos);

export default router;
 