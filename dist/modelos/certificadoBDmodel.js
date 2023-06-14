"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Certificado = void 0;
const mongoose_1 = require("mongoose");
/* crear simil de  modelos/certificado.js */
const estructuraCertificado = new mongoose_1.Schema({
    titulo: {
        type: String,
        required: [true, 'Debe ingresar un titulo de certificado']
    },
    descripcion: {
        type: String,
        required: [true, 'El cuerpo del certificado no puede ser vacio']
    },
    logo: {
        type: String,
        default: 'veciRed.png'
    },
    motivo: {
        type: String,
        default: 'Certificado para acreditacion o postulacion beneficios'
    },
    fechaemision: {
        //se debera implementar un catch date, este es provisional
        type: Date,
        required: [true, 'Se debe emitir en una fecha']
    },
    comunidad: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Comunidad'
        }]
});
exports.Certificado = (0, mongoose_1.model)('Certificado', estructuraCertificado);
