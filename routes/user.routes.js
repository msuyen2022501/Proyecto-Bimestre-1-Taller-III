const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { existenteEmail, existeUsuarioById } = require('../helpers/db-validators');

const { usuariosPost, usuariosGet, getUsuarioByid, usuariosPut, usuariosPutRole, usuariosDelete, usuariosClientDelete, usuariosClientPut, usuariosLogin } = require('../controllers/user.controller');

const router = Router();

router.post(
    "/login",
    [
        check('correo', 'Este correo no sirve').isEmail(),
        check('password', 'la password es necesaria').not().isEmpty(),
        validarCampos,
    ], usuariosLogin);

router.post(
    "/",
    [
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("password", "El password debe tener más de 6 letras").isLength({ min: 6, }),
        check("correo", "El correo debe ser un correo").isEmail(),
        check("correo").custom(existenteEmail),
        validarCampos,
    ], usuariosPost);

router.get("/", usuariosGet);

router.get(
    "/:id",
    [
        check("id", "El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ], getUsuarioByid);

router.put(
    "/:id",
    [
        check("id", "El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ], usuariosPut);

router.put(
    "/role/:id",
    [
        check("id", "El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ], usuariosPutRole);

router.delete(
    "/:id",
    [
        check("id", "El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ], usuariosDelete);

router.delete(
    "/cliente/:id",
    [
        check('correo', 'Este correo no sirve').isEmail(),
    ], usuariosClientDelete);

router.put(
    "/cliente/:id",
    [
        check('correo', 'Este correo no sirve').isEmail(),
    ], usuariosClientPut);

module.exports = router;
