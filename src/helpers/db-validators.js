import Role from '../role/role.model.js';
import User from '../user/user.model.js';

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
