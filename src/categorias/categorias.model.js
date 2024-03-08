import mongoose from 'mongoose';

const categoriaSchema = new mongoose.Schema({
  nombreCategoria: {
    type: String,
    required: [true, 'NombreCategoria obligatorio'],
    unique: true
  },
  descripcion: {
    type: String,
    required: [true, 'descripcion obligatorio'],
  },
  estado:{
      type: Boolean,
      default: true
  }
});

const Categoria = mongoose.model('Categoria', categoriaSchema);

export default Categoria;
