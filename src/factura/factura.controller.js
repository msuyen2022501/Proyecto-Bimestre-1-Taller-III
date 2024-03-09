import Factura from "./factura.model.js";
import Producto from "../productos/producto.model.js";

export const facturaPut = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const { producto, cantidad } = req.body;

    if (!producto && !cantidad) {
      return res.status(400).send({ msg: "Se requiere producto y cantidad" });
    }

    const factura = await Factura.findById(id);
    if (!factura) {
      return res.status(404).send({ msg: "Factura not found" });
    }

    const itemToUpdate = factura.items.find(
      (item) => item._id.toString() === itemId
    );
    if (!itemToUpdate) {
      return res
        .status(404)
        .send({ msg: "Artículo no encontrado en la factura." });
    }

    if (producto) {
      const productoInfo = await Producto.findById(producto);
      if (!productoInfo) {
        return res.status(404).send({ message: "Producto not found" });
      }

      const antiguoPrecioUnitario = itemToUpdate.unitPrice;
      const nuevaCantidad = cantidad !== undefined ? cantidad : itemToUpdate.quantity;
      const cantidadDiferencia = nuevaCantidad - itemToUpdate.quantity;

      if (productoInfo.stock < cantidadDiferencia) {
        return res.status(400).send({ message: "Stock insuficiente" });
      }

      factura.totalAmount +=
        (productoInfo.price - antiguoPrecioUnitario) * nuevaCantidad;

      productoInfo.stock -= cantidadDiferencia;
      await productoInfo.save();

      itemToUpdate.producto = producto;
      itemToUpdate.unitPrice = productoInfo.price;
      itemToUpdate.quantity = nuevaCantidad;
    }

    await factura.save();

    return res.send({ message: "Artículo actualizado exitosamente", factura });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error updating item" });
  }
};