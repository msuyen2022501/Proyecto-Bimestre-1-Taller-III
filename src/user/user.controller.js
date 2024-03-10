import { response } from 'express';
import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';

import Usuario from './user.model.js';
import { generarJWT } from "../helpers/generar-jwt.js";

const usuariosGet = async (req, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        usuarios
    });
}

const usuariosPutRole = async (req, res) => {
    const { id } = req.params;
    const { role, correoUsuario } = req.body;

    const usuarioSolicitante = await Usuario.findOne({ correo: correoUsuario });

    if (!usuarioSolicitante) {
        return res.status(400).json({
            msg: 'El usuario que realiza la solicitud no existe'
        });
    }

    const usuarioAntes = await Usuario.findById(id);

    const usuario = await Usuario.findByIdAndUpdate(id, { role });

    res.status(200).json({
        msg: 'Rol del usuario actualizado',
        usuario: {
            nombre: usuario.nombre,
            correo: usuario.correo,
            roleAnterior: usuarioAntes.role,
            roleNuevo: role
        }
    });
}


const usuariosDelete = async (req, res) => {
    const { id } = req.params;

    try {
        await Usuario.findByIdAndUpdate(id, { estado: false });

        res.status(200).json({
            msg: 'Usuario eliminado'
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error al eliminar el usuario'
        });
    }
}

const usuariosPost = async (req, res) => {
    const { nombre, correo, password, role } = req.body;

    const usuario = new Usuario({ nombre, correo, password, role });

    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();
    res.status(200).json({
        usuario
    });
}

const usuariosPut = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            msg: 'El ID proporcionado no es válido'
        });
    }

    try {
        const usuario = await Usuario.findById(id);

        if (!usuario) {
            return res.status(400).json({
                msg: 'El usuario a editar no existe'
            });
        }

        const { nombre: nombreAnterior, correo: correoAnterior, password: passwordAnterior } = usuario;

        await Usuario.findByIdAndUpdate(id, req.body);

        const usuarioActualizado = await Usuario.findById(id);
        const { nombre: nombreNuevo, correo: correoNuevo, password: passwordNuevo } = usuarioActualizado;

        res.status(200).json({
            msg: 'Información del usuario actualizada',
            cambios: {
                nombre: { anterior: nombreAnterior, nuevo: nombreNuevo },
                correo: { anterior: correoAnterior, nuevo: correoNuevo },
                password: { anterior: passwordAnterior, nuevo: passwordNuevo }
            }
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error al actualizar la información del usuario'
        });
    }
}

const usuariosLogin = async (req, res) => {
    const { correo, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario no encontrado'
            });
        }

        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario borrado de la base de datos'
            })
        }

        const passwordValido = bcryptjs.compareSync(password, usuario.password);

        if (!passwordValido) {
            return res.status(400).json({
                msg: 'Contraseña incorrecta'
            });
        }

        const token = await generarJWT(usuario.id)

        res.status(200).json({
            msg_1: 'Inicio de sesión exitoso',
            msg_2: 'Bienvenido ' + usuario.nombre,
            msg_3: 'Este su token =>' + token,
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg: 'Error inesperado'
        })
    }

}

const eliminarCuenta = async (req, res) => {
    try {
        const { id } = req.params;
        const { confirmacion, contrasenaActual } = req.body;

        if (!confirmacion || confirmacion !== 'CONFIRMAR') {
            return res.status(400).json({ message: "La confirmación es incorrecta" });
        }

        const usuario = await Usuario.findById(id);

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const contraseñaCoincide = await bcryptjs.compare(contrasenaActual, usuario.password);

        if (!contraseñaCoincide) {
            return res.status(400).json({ message: "La contraseña actual es incorrecta" });
        }

        await Usuario.findByIdAndDelete(id);

        res.status(200).json({ message: "Cuenta eliminada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export {
    usuariosDelete,
    usuariosPost,
    usuariosGet,
    usuariosPut,
    usuariosLogin,
    usuariosPutRole,
    eliminarCuenta
}
