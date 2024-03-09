import Carrito from './carrito.model.js';
import Producto from '../productos/producto.model.js';

export const agregarAlCarrito = async (req, res) => {
    try {
        console.log('Iniciando controlador agregarAlCarrito');
        const { idProducto } = req.body;
        console.log('ID del producto:', idProducto);

        if (!idProducto) {
            console.log('No se proporcionó un ID de producto en la solicitud');
            return res.status(400).json({ mensaje: 'Se requiere el ID del producto en el cuerpo de la solicitud' });
        }

        const usuarioId = req.usuarioId;

        if (!usuarioId) {
            console.log('Usuario no autenticado');
            return res.status(401).json({ mensaje: 'Usuario no autenticado' });
        }

        const producto = await Producto.findById(idProducto);

        if (!producto) {
            console.log('Producto no encontrado');
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        let carrito = await Carrito.findOne({ usuario: usuarioId });
        console.log('Carrito encontrado:', carrito);

        if (!carrito) {
            console.log('Creando nuevo carrito para el usuario:', usuarioId);
            carrito = new Carrito({
                usuario: usuarioId,
                productos: [{ producto: idProducto, cantidad: 1 }] 
            });
        } else {
            const productoExistente = carrito.productos.find(item => item.producto.toString() === idProducto.toString());
            if (productoExistente) {
                productoExistente.cantidad += 1;
            } else {
                carrito.productos.push({ producto: idProducto, cantidad: 1 });
            }
        }

        await carrito.save();

        return res.status(200).json({ 
            mensaje: 'Producto agregado al carrito correctamente',
            productoAgregado: producto
        });

    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        return res.status(500).json({ mensaje: 'Error al agregar producto al carrito' });
    }
};
