const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { existeProductoById } = require('../helpers/db-validators');
const { productoPost, productosGet, getProductoByid, productosPut, productosDeshabilitadosGet, productosDelete, productosAgotadosGet, productosNombreGet, getProductoByCategoria, productosMasVendidos } = require('../controllers/producto.controller');

const router = Router();

router.get("/", productosGet);

router.get(
    "/:id",
    [
        check("id", "El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(existeProductoById),
        validarCampos
    ], getProductoByid);

router.put(
    "/:id",
    [
        check("id", "El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(existeProductoById),
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

router.post(
    "/nombre",
    [
        check("producto", "El nombre del producto es obligatorio").not().isEmpty(),
        validarCampos
    ], productosNombreGet);

router.post(
    "/agotado",
    [
        validarCampos
    ], productosAgotadosGet);

router.post(
    "/categoria",
    [
        check("categoria_producto", "El nombre de la categoría es obligatorio").not().isEmpty(),
        validarCampos
    ], getProductoByCategoria);

router.post(
    "/deshabilitados",
    [
        validarCampos
    ], productosDeshabilitadosGet);

router.post(
    "/masVendidos",
    [
        validarCampos
    ], productosMasVendidos);

module.exports = router;
