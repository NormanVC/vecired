"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rutasCertificados = (0, express_1.Router)();
rutasCertificados.get('/prueba', (req, res) => {
    res.json({
        ok: true,
        mensaje: 'Tudo bem'
    });
});
exports.default = rutasCertificados;
