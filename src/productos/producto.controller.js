import Producto from './producto.model.js';
import { productoExistente } from '../helpers/db-validators.js';

const productosGet = async (req, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, producto] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        producto
    });
}

const getProductosByid = async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await Producto.findOne({ _id: id });
        if (!producto) {
            return res.status(404).json({
                msg: 'El producto no existe'
            });
        }
        res.status(200).json({
            producto
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error al buscar el producto'
        });
    }
}


const productosPut = async (req, res) => {
    const { id } = req.params;
    const { categoria, ...resto } = req.body;

    try {
        const productoActualizado = await Producto.findByIdAndUpdate(id, resto, { new: true });

        if (!productoActualizado) {
            return res.status(404).json({
                msg: 'El producto no existe'
            });
        }

        res.status(200).json({
            msg: 'Producto actualizado',
            producto: productoActualizado
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error al actualizar el producto'
        });
    }
}

const productosDelete = async (req, res) => {
    const { id } = req.params;

    try {
        const productoEliminado = await Producto.findByIdAndDelete(id);

        if (!productoEliminado) {
            return res.status(404).json({
                msg: 'El producto no existe'
            });
        }

        res.status(200).json({
            msg: 'Producto eliminado'
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error al eliminar el producto'
        });
    }
}

const productoPost = async (req, res) => {
    const { nombre, categoria, stock } = req.body;

    try {
        await productoExistente(nombre);

        const producto = new Producto({ nombre, categoria, stock });
        await producto.save();

        res.status(200).json({
            msg: 'Producto agregado correctamente',
            producto
        });
    } catch (error) {
        res.status(400).json({
            msg: error.message
        });
    }
}

const productosAgotados = async (req, res) => {
    try {
        const productosAgotados = await Producto.find({ stock: 0 });

        if (productosAgotados.length === 0) {
            return res.status(404).json({ message: "No hay productos sin stock." });
        }

        return res.status(200).json({ productosAgotados });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Hubo un problema al obtener los productos agotados.' });
    }
}




const productosMasVendidos = async (req, res) => {
    try {
        const productosMasVendidos = await Producto.find()
            .sort({ cantidadVendida: -1 }) 
            .limit(10); 

        res.status(200).json({
            productosMasVendidos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Hubo un error al obtener los productos más vendidos'
        });
    }
}


export {
    productosGet,
    productosDelete,
    productoPost,
    getProductosByid,
    productosPut,
    productosAgotados,
    productosMasVendidos
}
