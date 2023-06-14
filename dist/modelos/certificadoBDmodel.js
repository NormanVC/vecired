"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Certificado = void 0;
const mongoose_1 = require("mongoose");
var diferenciaZonaHorariaLocal = (new Date()).getTimezoneOffset() * 60000;
var today = (new Date(Date.now() - diferenciaZonaHorariaLocal)).toISOString().slice(0, -14);
const estructuraCertificado = new mongoose_1.Schema({
    titulo: {
        type: String,
        default: 'Certificado de Residencia',
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
    fechaEmision: {
        //se debera implementar un catch date, este es provisional
        type: Date,
        default: today,
        //required:[true,'Se debe emitir en una fecha']
    },
    comunidad: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Comunidad'
        }]
});
exports.Certificado = (0, mongoose_1.model)('Certificado', estructuraCertificado);
