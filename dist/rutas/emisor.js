"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const emitirBDmodel_1 = require("../modelos/emitirBDmodel");
const autenticacion_1 = require("../middlewares/autenticacion");
const rutasEmisor = (0, express_1.Router)();
rutasEmisor.post('/solicitud', [autenticacion_1.verificaToken], (req, res) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    body.comunidad = req.usuario.comunidad;
    //validaciones
    var caracteres = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!?¿@-_.,/()= ]{1,250})+$/g;
    if (caracteres.test(req.body.motivo) == false) {
        return res.json({
            ok: false,
            mensaje: 'Caracteres invalidos en mensaje'
        });
    }
    if (req.body.motivo == '') {
        return res.json({
            ok: false,
            mensaje: 'Se debe proporcionar un motivo para emitir el certificado'
        });
    }
    //agregar validacion con token de usuario
    // se debe hacer una funcion para revisar si existe una solicitud del usuario
    const dataEmisor = {
        nombre: req.body.nombre,
        rut: req.body.rut,
        motivo: req.body.motivo,
        fechaemision: req.body.date,
        certficado: req.body.certificado,
        comunidad: req.body.comunidad,
        estado: req.body.estado
    };
    emitirBDmodel_1.Emisor.create(body).then((emisorBD) => __awaiter(void 0, void 0, void 0, function* () {
        yield emisorBD.populate({ path: 'usuario', select: '-password' });
        yield emisorBD.populate({ path: 'comunidad' });
        res.json({
            ok: true,
            dataEmisor
        });
    })).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
//funcion para ver las solicitudes  a usuario privilegiado
rutasEmisor.get('/solicitudes', (req, res) => {
});
//funcion para ver los estados de mis solicitudes
rutasEmisor.get('/miscertificados', (req, res) => {
});
// funcion para aceptar  solicitudes
rutasEmisor.post('/aceptar', (req, res) => {
});
// funcion para rechazar solicitudes
rutasEmisor.post('/rechazar', (req, res) => {
});
exports.default = rutasEmisor;
