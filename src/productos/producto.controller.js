import Producto from './producto.model.js';

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

const getProductoByid = async (req, res) => {
    const { id } = req.params;
    const productos = await Producto.findOne({ _id: id });

    res.status(200).json({
        productos
    });
}

const productosPut = async (req, res) => {
    const { id } = req.params;
    const { _id, categoria, ...resto } = req.body;

    const productos = await Producto.existeUsuarioById(id, resto);

    res.status(200).json({
        msg: 'Productos actualizado',
        productos
    })
}

const productosDelete = async (req, res) => {
    const { id } = req.params;

    const productos = await Producto.existeUsuarioById(id, { estado: false });

    res.status(200).json({
        msg: 'Producto eliminado'
    });
}

const productoPost = async (req, res) => {
    const { nombre, categoria, stock } = req.body;

    const productos = new Producto({ nombre, categoria, stock });

    await productos.save();
    res.status(200).json({
        productos
    });
}

export {
    productosGet,
    productosDelete,
    productoPost,
    getProductoByid,
    productosPut
}
