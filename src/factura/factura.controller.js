import Factura from "./factura.model.js";
import Carrito from "../carritoCompras/carrito.model.js";
import Producto from "../productos/producto.model.js";
import Usuario from "../user/user.model.js";

export const completarCompra = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;

    const carrito = await Carrito.findOne({ usuario: usuarioId })
      .populate("productos.producto")
      .lean(false);

    if (!carrito) {
      return res
        .status(404)
        .json({ mensaje: "No se encontró un carrito para este usuario" });
    }

    let total = 0;
    const productosConStockSuficiente = [];
    const productosSinStockSuficiente = [];

    for (const item of carrito.productos) {
      const producto = await Producto.findById(item.producto);
      if (!producto) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
      }

      if (producto.stock < item.cantidad) {
        productosSinStockSuficiente.push({
          producto: producto.nombre,
          cantidadRequerida: item.cantidad,
          stockDisponible: producto.stock,
        });
      } else {
        productosConStockSuficiente.push({
          producto: producto.nombre,
          cantidad: item.cantidad,
          precio: producto.precio,
        });
        total += producto.precio * item.cantidad;
      }
    }

    if (productosSinStockSuficiente.length > 0) {
      return res.status(400).json({
        mensaje: "No hay suficiente stock para completar la compra",
        productosSinStockSuficiente,
      });
    }

    if (isNaN(total)) {
      return res
        .status(400)
        .json({ mensaje: "El total de la factura no es un número válido" });
    }

    const facturaProductos = await Promise.all(
      carrito.productos.map(async (item) => {
        const producto = await Producto.findById(item.producto);
        return {
          producto: producto._id,
          nombreProducto: producto.nombre,
          cantidad: item.cantidad,
        };
      })
    );

    const factura = new Factura({
      usuario: usuarioId,
      productos: facturaProductos,
      total: total,
    });

    await factura.save();
    await Carrito.deleteOne({ _id: carrito._id });

    const cliente = await Usuario.findById(usuarioId);

    return res.status(200).json({
      mensaje: "Compra completada exitosamente",
      factura: {
        idFactura: factura._id,
        idProductos: facturaProductos.map((prod) => prod.producto),
        nombreCliente: cliente.nombre,
        productos: facturaProductos.map((prod) => ({
          nombre: prod.nombreProducto,
          cantidad: prod.cantidad,
        })),
      },
    });
  } catch (error) {
    console.error("Error al completar la compra:", error);
    return res.status(500).json({ mensaje: "Error al completar la compra" });
  }
};

export const editarFactura = async (req, res) => {
  try {
    const facturaId = req.params.id;
    const { productos } = req.body;

    if (!Array.isArray(productos)) {
      return res
        .status(400)
        .json({ mensaje: "La lista de productos debe ser un array" });
    }

    const facturaExistente = await Factura.findById(facturaId).populate(
      "productos.producto"
    );

    if (!facturaExistente) {
      return res
        .status(404)
        .json({ mensaje: "No se encontró la factura especificada" });
    }

    const productosActualizados = [];
    const productosSinStockSuficiente = [];

    for (const item of productos) {
      const producto = await Producto.findById(item.producto);

      if (!producto) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
      }

      if (producto.stock < item.cantidad) {
        productosSinStockSuficiente.push({
          producto: producto.nombre,
          cantidadRequerida: item.cantidad,
          stockDisponible: producto.stock,
        });
      } else {
        productosActualizados.push({
          producto: producto._id,
          nombre: producto.nombre,
          cantidad: item.cantidad,
          precio: producto.precio,
        });
      }
    }

    if (productosSinStockSuficiente.length > 0) {
      return res.status(400).json({
        mensaje:
          "No hay suficiente stock para completar la edición de la factura",
        productosSinStockSuficiente,
      });
    }

    facturaExistente.productos = productosActualizados;
    await facturaExistente.save();

    return res.status(200).json({
      mensaje: "Factura editada exitosamente",
      factura: {
        idFactura: facturaExistente._id,
        productos: productosActualizados,
      },
    });
  } catch (error) {
    console.error("Error al editar la factura:", error);
    return res.status(500).json({ mensaje: "Error al editar la factura" });
  }
};

export const obtenerFacturasUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.usuarioId;

    const facturas = await Factura.find({ usuario: usuarioId });

    return res.status(200).json({ facturas });
  } catch (error) {
    console.error("Error al obtener las facturas del usuario:", error);
    return res.status(500).json({ mensaje: "Error al obtener las facturas del usuario" });
  }
};