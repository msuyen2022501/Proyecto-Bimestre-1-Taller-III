import mongoose from 'mongoose';

const carritoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario', 
    required: true
  },
  productos: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto', 
        required: true
      },
      cantidad: {
        type: Number,
        required: true,
        default: 1 
      }
    }
  ]
});

const Carrito = mongoose.model('Carrito', carritoSchema);

export default Carrito;
