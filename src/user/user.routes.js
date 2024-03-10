import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { existenteEmail, existeUsuarioById } from "../helpers/db-validators.js";

import {
  usuariosPost,
  usuariosGet,
  usuariosPut,
  usuariosPutRole,
  usuariosDelete,
  usuariosLogin,
  eliminarCuenta
} from "./user.controller.js";

const router = Router();

router.post(
  "/login",
  [
    check("correo", "Este correo no sirve").isEmail(),
    check("password", "la password es necesaria").not().isEmpty(),
    validarCampos,
  ],
  usuariosLogin
);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe tener más de 6 letras").isLength({
      min: 6,
    }),
    check("correo", "El correo debe ser un correo").isEmail(),
    check("correo").custom(existenteEmail),
    validarCampos,
  ],
  usuariosPost
);

router.get("/", usuariosGet);

router.put(
  "/:id",
  validarJWT,
  [
    check("id", "El id no es un formato válido de MongoDB").isMongoId(),
    check("id").custom(existeUsuarioById),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe tener más de 6 letras").isLength({
      min: 6,
    }),
    check("correo", "El correo debe ser un correo").isEmail(),
    validarCampos,
  ],
  usuariosPut
);

router.put(
  "/role/:id",
  validarJWT,
  [
    check("id", "El id no es un formato válido de MongoDB").isMongoId(),
    check("id").custom(existeUsuarioById),
    validarCampos,
  ],
  usuariosPutRole
);

router.delete(
  "/:id",
  validarJWT,
  [
    check("id", "El id no es un formato válido de MongoDB").isMongoId(),
    check("id").custom(existeUsuarioById),
    validarCampos,
  ],
  usuariosDelete
);

router.delete(
    "/eliminar-cuenta/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("confirmacion", "La confirmación es requerida").notEmpty(),
        check("contrasenaActual", "La contraseña actual es requerida").notEmpty(),
        validarCampos,
    ],
    eliminarCuenta
);

export default router;
