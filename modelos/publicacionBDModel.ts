import {Schema, Document, model} from 'mongoose';

export enum OpcionesCategoria {
    Hogar='Hogar',
    Entretenimiento='Entretenimiento',
    Electronica='Electronica',
    Ropa='Ropa',
    Gastronomia='Gastronomia',
}


const estructuraPublicacion = new Schema({
    titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio'],
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatoria'],
    },
    imagenes: [String],
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
    },
    categoria: {
        type: String,
        enum: Object.values(OpcionesCategoria),
        required: [true, 'La categoria es obligatoria'],
    },
    usuarioId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El ID del usuario es obligatorio'],
    },
});

interface IPublicacion extends Document {
    titulo: string;
    descripcion: string;
    imagenes: string[];
    precio: number;
    categoria: OpcionesCategoria;
    usuarioId: Schema.Types.ObjectId;
}

export const Publicacion = model<IPublicacion>('Publicacion', estructuraPublicacion);