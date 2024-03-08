import Categorias from './categorias.model.js';
import { categoriaExistente } from '../helpers/db-validators.js';

const categoriasGet = async (req, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, categorias] = await Promise.all([
        Categorias.countDocuments(query),
        Categorias.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        categorias
    });
}

const categoriasPut = async (req, res) => {
    const { id } = req.params;
    const { nombreCategoria, descripcion } = req.body;

    try {
        const categoriaAnterior = await Categorias.findById(id);

        const categoriasActualizado = await Categorias.findByIdAndUpdate(id, { nombreCategoria, descripcion }, { new: true });

        if (!categoriasActualizado) {
            return res.status(404).json({
                msg: 'La categoría no existe'
            });
        }

        const respuesta = {
            msg: 'Categoría actualizada',
            categorias: {
                id: categoriasActualizado._id,
                nombres: {
                    anterior: categoriaAnterior.nombreCategoria,
                    nuevo: categoriasActualizado.nombreCategoria
                },
                descripciones: {
                    anterior: categoriaAnterior.descripcion,
                    nuevo: categoriasActualizado.descripcion
                },
                estado: categoriasActualizado.estado
            }
        };

        res.status(200).json(respuesta);
    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error al actualizar la categoría'
        });
    }
}

const categoriasDelete = async (req, res) => {
    const { id } = req.params;

    try {
        const categoriaEliminada = await Categorias.findByIdAndDelete(id);

        if (!categoriaEliminada) {
            return res.status(404).json({
                msg: 'La categoria no existe'
            });
        }

        res.status(200).json({
            msg: 'Categoría eliminada y productos transferidos a la categoría predeterminada'
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error al eliminar el producto'
        });
    }
}

const categoriasPost = async (req, res) => {
    const { nombreCategoria, descripcion } = req.body;

    try {
        await categoriaExistente(nombreCategoria);

        const categorias = new Categorias({ nombreCategoria, descripcion });
        await categorias.save();

        res.status(200).json({
            msg: 'Categoria agregada correctamente',
            categorias
        });
    } catch (error) {
        res.status(400).json({
            msg: error.message
        });
    }
}

export {
    categoriasPost,
    categoriasGet,
    categoriasPut,
    categoriasDelete
}
