"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const certificadoBDmodel_1 = require("../modelos/certificadoBDmodel");
const rutasCertificados = (0, express_1.Router)();
rutasCertificados.post('/create', (req, res) => {
    //validaciones
    // se debera colocar  breadcrumbs en  frontend
    var caracteres = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ ]{3,50})+$/g;
    if (caracteres.test(req.body.titulo) == false) {
        return res.json({
            ok: false,
            mensaje: 'Caracteres invalidos en el Titulo, ingrese otro nombre.'
        });
    }
    if (req.body.titulo.length > 50) {
        return res.json({
            ok: false,
            mensaje: 'Titulo de certificado demasiado largo'
        });
    }
    const dataCertificado = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        logo: req.body.logo,
        motivo: req.body.motivo,
        fechaEmision: req.body.fechaemision,
        comunidad: req.body.comunidad
    };
    res.json({
        ok: true,
        dataCertificado
        //mensaje:'Tudo bem'
    });
    certificadoBDmodel_1.Certificado.create(dataCertificado).then(certificadoBD => {
        res.json({
            ok: true
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
exports.default = rutasCertificados;
