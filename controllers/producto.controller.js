const { response } = require('express');
const Producto = require('../models/producto');
const Usuario = require('../models/usuario');

const productosGet = async (req, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        productos
    });
}

const productosDeshabilitadosGet = async (req, res = response) => {
    const { limite, desde } = req.query;

    const query = { estado: false };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        productos
    });
}

const productosNombreGet = async (req, res = response) => {
    const { producto } = req.body;
    const query = { nombre: producto };

    const Productos = await Producto.findOne(query);

    if (!Productos) {
        return res.status(400).json({
            msg: 'El producto no existe'
        });
    }

    if (!Productos.estado) {
        return res.status(400).json({
            msg: 'El producto se encuentra deshabilitado'
        });
    }

    res.status(200).json({
        Productos
    });
}

const productosAgotadosGet = async (req, res = response) => {
    const { limite, desde } = req.query;

    const query = { estado: true, stock: 0 };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        productos
    });
}

const productosMasVendidos = async (req, res) => {
    const facturas = await Factura.find({ en_compra: false });

    const productosVendidos = [];

    for (const factura of facturas) {
        const productosFactura = await FacturaHasProducto.find({ factura: factura._id });
        productosVendidos.push(...productosFactura.map(pf => pf.producto));
    }

    const productosMasVendidos = {};
    productosVendidos.forEach(producto => {
        if (productosMasVendidos[producto]) {
            productosMasVendidos[producto]++;
        } else {
            productosMasVendidos[producto] = 1;
        }
    });

    const productosOrdenados = Object.entries(productosMasVendidos).sort((a, b) => b[1] - a[1]);

    const productos_mas_vendidos = {};
    productosOrdenados.forEach(([producto, cantidad]) => {
        productos_mas_vendidos[producto] = cantidad;
    });

    res.status(200).json({
        Producto: "cantidad",
        productos_mas_vendidos
    });
};

const getProductoByCategoria = async (req, res) => {
    const { categoria_producto } = req.body;

    const tipo = await Categoria.findOne({ nombre: categoria_producto });

    console.log(tipo);

    if (!tipo) {
        return res.status(400).json({
            msg: 'La categoría asignada no existe, por favor verifique en la base de datos'
        })
    }

    const query = { estado: true, categoria: categoria_producto };
    const { limite, desde } = req.query;

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        productos
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

    const productos = await Producto.findByIdAndUpdate(id, resto);

    res.status(200).json({
        msg: 'Productos actualizado',
        productos
    })
}

const productosDelete = async (req, res) => {
    const { id } = req.params;

    const productos = await Producto.findByIdAndUpdate(id, { estado: false });

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

module.exports = {
    productosDelete,
    productoPost,
    productosGet,
    getProductoByid,
    productosPut,
    productosAgotadosGet,
    productosNombreGet,
    getProductoByCategoria,
    productosDeshabilitadosGet,
    productosMasVendidos
}
