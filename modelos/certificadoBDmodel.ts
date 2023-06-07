import { model, Document, Schema } from 'mongoose';
/* crear simil de  modelos/certificado.js */

const estructuraCertificado= new Schema({
    
    titulo:
    {
        type: String,
        required: [true,'Debe ingresar un titulo de certificado']
    },

    descripcion:
    {
        type: String,
        required: [true,'El cuerpo del certificado no puede ser vacio']
    },

    motivo:
    {
        type: String,
        default: 'Certificado para acreditacion o postulacion beneficios'
    },

    fechaemision:
    {
        //se debera implementar un catch date, este es provisional
        type: Date,
        required:[true,'Se debe emitir en una fecha']
    },

    comunidad:[{
        type: Schema.Types.ObjectId,
        ref: 'Comunidad'
    }]



});

interface ICertificado extends Document {
    nombre: string;
    descripcion: string;
    motivo: string;
    fechaemision: Date;
    comunidad:string;
}

export const Certificado = model<ICertificado>('Certificado', estructuraCertificado);