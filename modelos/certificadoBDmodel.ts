import { model, Document, Schema } from 'mongoose';

const estructuraCertificado= new Schema({
    
    titulo:
    {
        type: String,
        default:'Certificado de Residencia',
        required: [true,'Debe ingresar un titulo de certificado']
    },

    descripcion:
    {
        type: String,
        required: [true,'El cuerpo del certificado no puede ser vacio']
    },
    
    logo:
    {
        type: String,
        default: 'veciRed.png'
    },

    comunidad:[{
        type: Schema.Types.ObjectId,
        ref: 'Comunidad'
    }]

});

interface ICertificado extends Document {
    titulo: string;
    descripcion: string;
    logo: string;
    comunidad:string;
}

export const Certificado = model<ICertificado>('Certificado', estructuraCertificado);