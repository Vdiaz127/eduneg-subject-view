import mongoose, { Schema, Document, model } from 'mongoose';

interface IMateria extends Document {
  codigo: string;
  nombre: string;
  descripcion: string;
  creditos: number;
  activo: boolean;  
}

const MateriaSchema = new Schema<IMateria>({
  codigo: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  creditos: { type: Number, required: true, min: 1 },
  activo: { type: Boolean, default: true }, 
});

const Materia = mongoose.models.Materia || model<IMateria>('Materia', MateriaSchema);

export default Materia;
