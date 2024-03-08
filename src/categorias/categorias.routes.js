import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import {
    categoriasPost,
    categoriasGet,
    categoriasPut,
    categoriasDelete
} from "./categorias.controller.js";
import {
    categoriaExistente
} from "../helpers/db-validators.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", categoriasGet);

router.post(
    "/",
    validarJWT,
    [
        check("nombreCategoria", "El nombre de la categoria es obligatorio").not().isEmpty(),
        check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
        check("nombre").custom(categoriaExistente),
        validarCampos,
    ],
    categoriasPost
);

router.put(
    "/:id",
    validarJWT,
    [
        check("id", "El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(categoriaExistente),
        validarCampos,
    ],
    categoriasPut
);

router.delete(
    "/:id",
    validarJWT,
    [
        check("id", "El id no es un formato válido de MongoDB").isMongoId(),
        validarCampos,
    ],
    categoriasDelete
);

export default router;
