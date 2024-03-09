import mongoose from 'mongoose';

const facturaEsquema = new mongoose.Schema({
  items: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
      },
      precioUnitario: {
        type: Number,
        required: true
      },
      cantidad: {
        type: Number,
        required: true
      }
    }
  ],
  montoTotal: {
    type: Number,
    required: true
  }
});

const Factura = mongoose.model('Factura', facturaEsquema);

export default Factura;
