"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emisor = void 0;
const mongoose_1 = require("mongoose");
//funcion para que tome la fecha actual  del sistema
var diferenciaZonaHorariaLocal = (new Date()).getTimezoneOffset() * 60000;
var today = (new Date(Date.now() - diferenciaZonaHorariaLocal)).toISOString().slice(0, -14);
const estructuraEmisor = new mongoose_1.Schema({
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Las solicitudes deben incluir un usuario.']
    },
    rut: {
        type: String,
        required: [true, 'El usuario debe poseer un rut.']
    },
    motivo: {
        type: String,
        required: [true, 'Se debe dar una razon para emitir el certificado.']
    },
    fechaemision: {
        type: Date,
        default: today
    },
    certificado: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Certificado',
        required: [true, 'Las solicitudes deben incluir un certificado.']
    },
    comunidad: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Comunidad',
        required: [true, 'Las solicitudes deben pertenecer a una comunidad.']
    },
    estado: {
        type: Number,
        default: 0
    }
});
exports.Emisor = (0, mongoose_1.model)('Emisor', estructuraEmisor);
