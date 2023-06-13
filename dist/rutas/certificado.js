"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rutasCertificados = (0, express_1.Router)();
rutasCertificados.post('/create', (req, res) => {
    //validaciones
    const cert = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        logo: req.body.logo,
        motivo: req.body.motivo,
        fechaemision: req.body.fechaemision,
        comunidad: req.body.Comunidad
    };
    res.json({
        ok: true,
        cert
        //mensaje:'Tudo bem'
    });
});
exports.default = rutasCertificados;
