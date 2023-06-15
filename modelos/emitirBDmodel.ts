import {Schema, Document, model} from 'mongoose';
//funcion para que tome la fecha actual  del sistema
var diferenciaZonaHorariaLocal = (new Date()).getTimezoneOffset() * 60000;
var today = (new Date(Date.now() - diferenciaZonaHorariaLocal)).toISOString().slice(0, -14);

const estructuraEmisor = new Schema({
    usuario:
    {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Las solicitudes deben incluir un usuario.']
    },
    rut:
    {
        type: String,
        required: [true, 'El usuario debe poseer un rut.']
    },
    motivo:
    {
        type: String,
        required: [true, 'Se debe dar una razon para emitir el certificado.']
    },
    fechaemision:
    {
        type: Date,
        default: today
    },
    certificado: {
        type: Schema.Types.ObjectId,
        ref:  'Certificado',
        required: [true, 'Las solicitudes deben incluir un certificado.']
    },
    comunidad: {
        type: Schema.Types.ObjectId,
        ref:  'Comunidad',
        required: [true, 'Las solicitudes deben pertenecer a una comunidad.']
    }
});

interface IEmisor extends Document {
    usuario: string;
    rut: string;
    motivo: string;
    fechaemision: string;
    certificado: string;
    comunidad: string;
}

export const Emisor = model<IEmisor>('Emisor', estructuraEmisor);