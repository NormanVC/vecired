"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const certificadoBDmodel_1 = require("../modelos/certificadoBDmodel");
const autenticacion_1 = require("../middlewares/autenticacion");
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
            mensaje: 'Titulo de certificado demasiado largo.'
        });
    }
    if (req.body.descripcion.length > 1200) {
        return res.json({
            ok: false,
            mensaje: 'Descripcion del correo demasiado larga, intente acortar texto.'
        });
    }
    //se debera agregar validacion para que tome el id de comunidad donde se emita, de manera que no se deba interactuar con IDs
    const dataCertificado = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        logo: req.body.logo,
        comunidad: req.body.comunidad
    };
    certificadoBDmodel_1.Certificado.create(dataCertificado).then(certificadoBD => {
        res.json({
            ok: true,
            dataCertificado
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
//actualizar certificado
rutasCertificados.post('/update', autenticacion_1.verificaToken, (req, res) => {
    res.json({
        ok: true
    });
});
exports.default = rutasCertificados;
