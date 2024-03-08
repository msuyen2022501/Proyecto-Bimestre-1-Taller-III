import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { existeUsuarioById } from '../helpers/db-validators.js';
import { productoPost, productosGet, getProductoByid, productosPut, productosDelete } from './producto.controller.js';

const router = Router();

router.get("/", productosGet);

router.get(
    "/:id",
    [
        check("id", "El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ], getProductoByid);

router.put(
    "/:id",
    [
        check("id", "El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ], productosPut);

router.delete(
    "/:id",
    [
        check("id_factura", "El id no es un formato válido de MongoDB").isMongoId(),
        validarCampos
    ], productosDelete);


router.post(
    "/",
    [
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("categoria", "La categoría es obligatoria").not().isEmpty(),
        check("stock", "El stock debe ser un número").isNumeric(),
        validarCampos,
    ], productoPost);

export default router;
