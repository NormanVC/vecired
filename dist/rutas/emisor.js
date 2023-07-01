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
const usuarioBDModel_1 = require("../modelos/usuarioBDModel"); // Importar el modelo de Usuario
const rutasEmisor = (0, express_1.Router)();
//funcion para ver las solicitudes  a usuario
rutasEmisor.get('/solicitudes', [autenticacion_1.verificaToken], (request, res) => __awaiter(void 0, void 0, void 0, function* () {
    /* toma como parametro opcional en la url  el numero de pagina y se transforma mediante funcion Number
    si se le entrega {undefined} toma como  referencia la pagina 1 */
    let pagina = Number(request.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const estadoEmitir = 0; // solo solicitudes  sin responder
    const emisor = yield emitirBDmodel_1.Emisor.find({ estado: estadoEmitir, comunidad: request.body.comunidad })
        .sort({ _id: -1 }) // se ordena desde el mas nuevo
        .skip(skip)
        .limit(10) // se muestra 10 registros por pagina
        .populate({ path: 'usuario', select: '-password' }) // se llena la tabla con los datos del usuario, excepto la contraseña
        .populate({ path: 'comunidad' })
        .exec();
    res.json({
        ok: true,
        pagina,
        emisor
    });
}));
// funcion para ver las solicitudes aprobadas (las que esten en estado 1)
rutasEmisor.get('/solicitudes/aprobadas', [autenticacion_1.verificaToken], (request, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(request.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const estadoEmitir = 1; // solo solicitudes  aprobadas
    const emisor = yield emitirBDmodel_1.Emisor.find({ estado: estadoEmitir, comunidad: request.body.comunidad })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate({ path: 'usuario', select: '-password' })
        .populate({ path: 'comunidad' })
        .exec();
    res.json({
        ok: true,
        pagina,
        emisor
    });
}));
// funcion para ver las solicitudes rechazadas (las que esten en estado 2)
rutasEmisor.get('/solicitudes/rechazadas', [autenticacion_1.verificaToken], (request, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(request.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const estadoEmitir = 2; // solo solicitudes  rechazadas
    const emisor = yield emitirBDmodel_1.Emisor.find({ estado: estadoEmitir, comunidad: request.body.comunidad })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate({ path: 'usuario', select: '-password' })
        .populate({ path: 'comunidad' })
        .exec();
    res.json({
        ok: true,
        pagina,
        emisor
    });
}));
//funcion que hace la solicitud para conseguir el certificado
rutasEmisor.post('/solicitud', [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuarioId = req.usuario._id;
    const comunidadId = req.body.comunidad;
    try {
        // Buscar al usuario en la base de datos
        const usuario = yield usuarioBDModel_1.Usuario.findById(usuarioId);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Usuario no encontrado'
            });
        }
        //Se Verifica si el usuario pertenece a la comunidad especificada
        const perteneceComunidad = usuario.comunidad.some((comunidad) => comunidad.toString() === comunidadId);
        if (!perteneceComunidad) {
            return res.status(403).json({
                ok: false,
                mensaje: 'El usuario no pertenece a la comunidad especificada'
            });
        }
        const body = req.body;
        body.usuario = usuarioId;
        body.comunidad = comunidadId;
        // Validaciones
        const caracteres = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!?¿@-_.,/()= ]{1,250})+$/g;
        if (!caracteres.test(req.body.motivo)) {
            return res.json({
                ok: false,
                mensaje: 'Caracteres inválidos en el mensaje'
            });
        }
        if (req.body.motivo === '') {
            return res.json({
                ok: false,
                mensaje: 'Se debe proporcionar un motivo para emitir el certificado'
            });
        }
        const dataEmisor = {
            nombre: req.body.nombre,
            rut: req.body.rut,
            motivo: req.body.motivo,
            fechaemision: req.body.date,
            certficado: req.body.certificado,
            comunidad: req.body.comunidad,
            estado: req.body.estado
        };
        const emisorBD = yield emitirBDmodel_1.Emisor.create(body);
        yield emisorBD.populate({ path: 'usuario', select: '-password' });
        yield emisorBD.populate({ path: 'comunidad' });
        res.json({
            ok: true,
            dataEmisor
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            err
        });
    }
}));
// funcion para listar todas las solicitudes que el usuario ha hecho  y el estado de cada una (sin responder, rechazadas y aprobadas)
rutasEmisor.get('/miscertificados', [autenticacion_1.verificaToken], (request, res) => __awaiter(void 0, void 0, void 0, function* () {
    /* toma como parametro opcional en la url  el numero de pagina y se transforma mediante funcion Number
    si se le entrega {undefined} toma como  referencia la pagina 1 */
    let pagina = Number(request.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const estadoEmitir = [0, 1, 2]; // todas las solicitudes  0 = sin responder , 1 = aprobada, 2 = rechazada
    const emisor = yield emitirBDmodel_1.Emisor.find({ estado: estadoEmitir, usuario: request.body.usuario })
        .sort({ _id: -1 }) // se ordena desde el mas nuevo
        .skip(skip)
        .limit(10) // se muestra 10 registros por pagina
        .populate({ path: 'usuario', select: '-password' }) // se llena la tabla con los datos del usuario, excepto la contraseña
        .populate({ path: 'comunidad' })
        .exec();
    res.json({
        ok: true,
        pagina,
        emisor
    });
}));
// funcion para aceptar  solicitudes
rutasEmisor.post('/aceptar', [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emisorId = req.body._id;
        const emisorDB = yield emitirBDmodel_1.Emisor.findById(emisorId);
        if (!emisorDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe la solicitud indicada'
            });
        }
        if (emisorDB.estado !== 0) {
            return res.json({
                ok: false,
                mensaje: 'El estado de la solicitud no es válido para ser actualizado'
            });
        }
        emisorDB.estado = 1;
        const updatedEmisor = yield emisorDB.save();
        res.json({
            ok: true,
            emisor: updatedEmisor
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, mensaje: 'Error al actualizar la solicitud' });
    }
}));
// funcion para rechazar solicitudes
rutasEmisor.post('/rechazar', [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emisorId = req.body._id;
        const emisorDB = yield emitirBDmodel_1.Emisor.findById(emisorId);
        if (!emisorDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe la solicitud indicada'
            });
        }
        if (emisorDB.estado !== 0) {
            return res.json({
                ok: false,
                mensaje: 'El estado de la solicitud no es válido para ser actualizado'
            });
        }
        emisorDB.estado = 2;
        const updatedEmisor = yield emisorDB.save();
        res.json({
            ok: true,
            emisor: updatedEmisor
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, mensaje: 'Error al actualizar la solicitud' });
    }
}));
exports.default = rutasEmisor;
