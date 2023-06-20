"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Certificado = void 0;
const mongoose_1 = require("mongoose");
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
    replegal: {
        type: String,
        required: [true, 'Para emitir un certificado, debe haber un representante legal']
    },
    contacto: {
        type: String,
        required: [true, 'Se debe colocar un numero de contacto']
    },
    logo: {
        type: String,
        default: 'veciRed.png'
    },
    comunidad: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Comunidad'
        }]
});
exports.Certificado = (0, mongoose_1.model)('Certificado', estructuraCertificado);
