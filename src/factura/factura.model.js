import mongoose from 'mongoose';

const { Schema } = mongoose;

const facturaSchema = new Schema({
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productos: [
    {
      producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
      },
      cantidad: {
        type: Number,
        required: true
      }
    }
  ],
  total: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

const Factura = mongoose.model('Factura', facturaSchema);

export default Factura;
