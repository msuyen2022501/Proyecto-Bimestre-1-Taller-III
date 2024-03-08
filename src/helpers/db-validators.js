import Role from '../role/role.model.js';
import User from '../user/user.model.js';
import Producto from '../productos/producto.model.js';
import Categorias from '../categorias/categorias.model.js';

export const esRoleValido = async (role = '') => {
    const existeRol = await Role.findOne({ role });

    if (!existeRol) {
        throw new Error(`El role ${role} no existe en la base de datos`);
    }
}

export const existenteEmail = async (correo = '') => {
    const existeEmail = await User.findOne({ correo });

    if (existeEmail) {
        throw new Error(`El email ${correo} ya fue registrado`);
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);

    if (!existeUsuario) {
        throw new Error(`El ID: ${id} No existe`);
    }
}

export const productoExistente = async (nombre = '') => {
    const productoExistente = await Producto.findOne({ nombre });

    if (productoExistente) {
        throw new Error(`El producto ${nombre} ya ha sido registrado`);
    }
}

export const existeProductoById = async (id = '') => {
    const existeProducto = await Producto.findById(id);

    if (!existeProducto) {
        throw new Error(`El ID: ${id} No existe`);
    }
}

export const categoriaExistente = async (nombre = '') => {
    const categoriaExistente = await Categorias.findOne({ nombre });

    if (categoriaExistente) {
        throw new Error(`La categoria ${nombre} ya ha sido registrado`);
    }
}