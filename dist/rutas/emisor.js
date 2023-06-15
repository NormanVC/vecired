"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const emitirBDmodel_1 = require("../modelos/emitirBDmodel");
const rutasEmisor = (0, express_1.Router)();
rutasEmisor.post('/solicitud', (req, res) => {
    //validaciones
    const dataEmisor = {
        nombre: req.body.nombre,
        rut: req.body.rut,
        motivo: req.body.motivo,
        fechaemision: req.body.date,
        certficado: req.body.certificado,
        comunidad: req.body.comunidad
    };
    emitirBDmodel_1.Emisor.create(dataEmisor).then(emisorBD => {
        res.json({
            ok: true,
            dataEmisor
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
exports.default = rutasEmisor;
