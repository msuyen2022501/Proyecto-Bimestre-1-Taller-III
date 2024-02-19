const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const existenteEmail = async (correo = '') => {
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        throw new Error(`El email ${ correo } ya fue registrado`);
    }
}

const noExistenteEmail = async (correo = '') => {
    const existeEmail = await Usuario.findOne({correo});
    if(!existeEmail){
        throw new Error(`El email ${ correo } no existe`);
    }
}

const existeUsuarioById = async ( id = '') => {
    const existeUsuario = await Usuario.findOne({id});
    if(existeUsuario){
        throw new Error(`El usuario con el id: ${ id } no existe`);
    }
}


const existeProductoById = async ( id = '') => {
    const existeProduct = await Producto.findOne({id});
    if(existeProduct){
        throw new Error(`El producto con el id: ${ id } no existe`);
    }
}

module.exports = {
    existenteEmail,
    existeUsuarioById,
    existeProductoById,
    noExistenteEmail,
}