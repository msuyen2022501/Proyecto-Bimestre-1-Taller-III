import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import {
  productoPost,
  productosGet,
  getProductosByid,
  productosPut,
  productosDelete,
  productosAgotados,
  productosMasVendidos
} from "./producto.controller.js";
import {
  productoExistente,
  existeProductoById,
} from "../helpers/db-validators.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", productosGet);

router.get(
  "/:id",
  [
    check("id", "El id no es un formato válido de MongoDB").isMongoId(),
    check("id").custom(existeProductoById),
    validarCampos,
  ],
  getProductosByid
);

router.post('/productosAgotados', validarJWT, productosAgotados); 

router.post('/productosMasVendidos', validarJWT, productosMasVendidos);

router.put(
  "/:id",
  validarJWT,
  [
    check("id", "El id no es un formato válido de MongoDB").isMongoId(),
    check("id").custom(existeProductoById),
    validarCampos,
  ],
  productosPut
);

router.delete(
  "/:id",
  validarJWT,
  [
    check("id", "El id no es un formato válido de MongoDB").isMongoId(),
    validarCampos,
  ],
  productosDelete
);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "La categoría es obligatoria").not().isEmpty(),
    check("stock", "El stock debe ser un número").isNumeric(),
    check("nombre").custom(productoExistente),
    validarCampos,
  ],
  productoPost
);

export default router;
