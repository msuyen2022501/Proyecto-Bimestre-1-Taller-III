const { response } = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");

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

const getUsuarioByid = async (req, res) => {
    const { id } = req.params;
    const usuario = await Usuario.findOne({ _id: id });

    res.status(200).json({
        usuario
    });
}

const usuariosPut = async (req, res) => {
    const { id } = req.params;
    const { admin } = req.body;

    const Admin = await Usuario.findOne({ correo: admin });

    if (!Admin || Admin.role !== "ADMIN_ROLE") {
        return res.status(400).json({
            msg: 'El usuario administrador no existe o no tiene permisos para esta acción'
        });
    }

    const usuario = await Usuario.findByIdAndUpdate(id, { role: "ADMIN_ROLE" });

    res.status(200).json({
        msg: 'Usuario actualizado',
    });
}

const usuariosPutRole = async (req, res) => {
    const { id } = req.params;
    const { role, admin } = req.body;

    const Admin = await Usuario.findOne({ correo: admin });

    if (!Admin || Admin.role !== "ADMIN_ROLE") {
        return res.status(400).json({
            msg: 'El usuario administrador no existe o no tiene permisos para esta acción'
        });
    }

    const usuario = await Usuario.findByIdAndUpdate(id, { role });

    res.status(200).json({
        msg: 'Rol del usuario actualizado',
        usuario
    });
}

const usuariosDelete = async (req, res) => {
    const { id } = req.params;
    const { admin } = req.body;

    const Admin = await Usuario.findOne({ correo: admin });

    if (!Admin || Admin.role !== "ADMIN_ROLE") {
        return res.status(400).json({
            msg: 'El usuario administrador no existe o no tiene permisos para esta acción'
        });
    }

    await Usuario.findByIdAndUpdate(id, { estado: false });

    res.status(200).json({
        msg: 'Usuario eliminado'
    });
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

const usuariosClientPut = async (req, res) => {
    const { id } = req.params;
    const { admin, cliente, ...resto } = req.body;

    const client = await Usuario.findById(cliente);
    const usuario = await Usuario.findById(id);

    if (!usuario) {
        return res.status(400).json({
            msg: 'El usuario a editar no existe'
        });
    }

    if (client.correo !== cliente) {
        return res.status(400).json({
            msg: 'El correo asignado no coincide con el token proporcionado'
        })
    }

    if (client.role === "CLIENT_ROLE") {
        const { password, google, role, ...restoCliente } = resto;
        await Usuario.findByIdAndUpdate(id, restoCliente);
    } else {
        await Usuario.findByIdAndUpdate(id, resto);
    }

    res.status(200).json({
        msg: 'Usuario actualizado'
    });
}

const usuariosClientDelete = async (req, res) => {
    const { id } = req.params;
    const { cliente } = req.body;

    const client = await Usuario.findById(cliente);
    const usuario = await Usuario.findById(id);

    if (!usuario) {
        return res.status(400).json({
            msg: 'El usuario a eliminar no existe'
        });
    }

    if (client.correo !== cliente) {
        return res.status(400).json({
            msg: 'El correo asignado no coincide con el token proporcionado'
        })
    }

    if (client.role === "CLIENT_ROLE") {
        await Usuario.findByIdAndUpdate(id, { estado: false });
        res.status(200).json({
            msg: 'Usuario eliminado'
        });
    } else {
        return res.status(400).json({
            msg: 'No tienes permiso para eliminar este usuario'
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

module.exports = {
    usuariosDelete,
    usuariosPost,
    usuariosGet,
    getUsuarioByid,
    usuariosPut,
    usuariosLogin,
    usuariosPutRole,
    usuariosClientDelete,
    usuariosClientPut
}
