import { Router, Request, Response } from "express";
import { Emisor } from "../modelos/emitirBDmodel";
import { verificaToken } from "../middlewares/autenticacion";
import { Usuario } from '../modelos/usuarioBDModel';
import { Certificado } from "../modelos/certificadoBDmodel";
import { Comunidad } from "../modelos/comunidadBDModel";
const rutasEmisor = Router();

//funcion para ver las solicitudes  a usuario

rutasEmisor.get('/solicitudes',[verificaToken], async (request: any, res: Response) => {

  /* toma como parametro opcional en la url  el numero de pagina y se transforma mediante funcion Number
  si se le entrega {undefined} toma como  referencia la pagina 1 */
  let pagina = Number(request.query.pagina) || 1 ; 
  let skip = pagina - 1;
  skip = skip * 10;
  const estadoEmitir = 0; // solo solicitudes  sin responder


const emisor = await Emisor.find({estado: estadoEmitir, comunidad:request.body.comunidad})
                        .sort({_id: -1}) // se ordena desde el mas nuevo
                        .skip(skip)
                        .limit(10) // se muestra 10 registros por pagina
                        .populate({path:'usuario',select: '-password'}) // se llena la tabla con los datos del usuario, excepto la contraseña
                        .populate({path:'comunidad'})
                        .exec();

  res.json({
    ok:true,
    pagina,
    emisor
  });
  
});

// funcion para ver las solicitudes aprobadas (las que esten en estado 1)

rutasEmisor.get('/solicitudes/aprobadas',[verificaToken], async (request: any, res: Response) => {
  let pagina = Number(request.query.pagina) || 1 ; 
  let skip = pagina - 1;
  skip = skip * 10;
  const estadoEmitir = 1; // solo solicitudes  aprobadas


const emisor = await Emisor.find({estado: estadoEmitir, comunidad:request.body.comunidad})
                        .sort({_id: -1})
                        .skip(skip)
                        .limit(10)
                        .populate({path:'usuario',select: '-password'})
                        .populate({path:'comunidad'})
                        .exec();

  res.json({
    ok:true,
    pagina,
    emisor
  });
  
});

// funcion para ver las solicitudes rechazadas (las que esten en estado 2)


rutasEmisor.get('/solicitudes/rechazadas',[verificaToken], async (request: any, res: Response) => {
  let pagina = Number(request.query.pagina) || 1 ; 
  let skip = pagina - 1;
  skip = skip * 10;
  const estadoEmitir = 2; // solo solicitudes  rechazadas


const emisor = await Emisor.find({estado: estadoEmitir, comunidad:request.body.comunidad})
                        .sort({_id: -1})
                        .skip(skip)
                        .limit(10)
                        .populate({path:'usuario',select: '-password'})
                        .populate({path:'comunidad'})
                        .exec();

  res.json({
    ok:true,
    pagina,
    emisor
  });
  
});


//funcion que hace la solicitud para conseguir el certificado

rutasEmisor.post('/solicitud', [verificaToken], async (req: any, res: Response) => {
            const usuarioId = req.usuario._id;
            const comunidadId = req.body.comunidad;

         try {
             // Buscar al usuario en la base de datos
             const usuario = await Usuario.findById(usuarioId);

            if (!usuario) {
                    return res.status(404).json({
                        ok: false,
                        mensaje: 'Usuario no encontrado'
                     });
                 }

            //Se Verifica si el usuario pertenece a la comunidad especificada
             const perteneceComunidad = usuario.comunidad.some((comunidad: string) => comunidad.toString() === comunidadId);

             if (!perteneceComunidad) {
                    return res.status(403).json({
                            ok: false,
                            mensaje: 'El usuario no pertenece a la comunidad especificada'
                         });
                 }

                 const certificadoId = req.body.certificado;
                 const certificado = await Certificado.findById(certificadoId);

                 if (!certificado) {
                   return res.status(404).json({
                     ok: false,
                     mensaje: 'Certificado no encontrado'
                   });
                 }

                 const comunidad = await Comunidad.findById(comunidadId);

                 if (!comunidad) {
                   return res.status(404).json({
                     ok: false,
                     mensaje: 'Comunidad no encontrada'
                   });
                 }
             
                 if (comunidad.emitirCertificado === 0) {
                   return res.json({
                     ok: false,
                     mensaje: 'Comunidad no apta para emitir certificados'
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

    const emisorBD = await Emisor.create(body);
    await emisorBD.populate({ path: 'usuario', select: '-password' });
    await emisorBD.populate({ path: 'comunidad' });

    res.json({
      ok: true,
      dataEmisor
    });
  } catch (err) {
    res.status(500).json({
        ok: false,
        err
    });
  }
});


// funcion para listar todas las solicitudes que el usuario ha hecho  y el estado de cada una (sin responder, rechazadas y aprobadas)

rutasEmisor.get('/miscertificados',[verificaToken], async (request: any, res: Response) => {

  /* toma como parametro opcional en la url  el numero de pagina y se transforma mediante funcion Number
  si se le entrega {undefined} toma como  referencia la pagina 1 */
  let pagina = Number(request.query.pagina) || 1 ; 
  let skip = pagina - 1;
  skip = skip * 10;
  const estadoEmitir= [0,1,2] // todas las solicitudes  0 = sin responder , 1 = aprobada, 2 = rechazada


const emisor = await Emisor.find({estado: estadoEmitir, usuario:request.body.usuario})
                        .sort({_id: -1}) // se ordena desde el mas nuevo
                        .skip(skip)
                        .limit(10) // se muestra 10 registros por pagina
                        .populate({path:'usuario',select: '-password'}) // se llena la tabla con los datos del usuario, excepto la contraseña
                        .populate({path:'comunidad'})
                        .exec();

  res.json({
    ok:true,
    pagina,
    emisor
  });
  
});



// funcion para aceptar  solicitudes
rutasEmisor.post('/aceptar', [verificaToken], async (req: any, res: Response) => {
  try {
    const emisorId = req.body._id;

    const emisorDB = await Emisor.findById(emisorId);
    
    if (!emisorDB) {
      return res.json({
        ok: false,
        mensaje: 'No existe la solicitud indicada'
      });
    }

    if (emisorDB.estado !== 0) {
      return res.json({
        ok: false,
        mensaje: 'El estado de la solicitud no es válido para ser actualizada'
      });
    }

    const usuario = await Usuario.findById(req.usuario._id);
    if (!usuario) {
      return res.json({
        ok: false,
        mensaje: 'No se encontró el usuario en la BD'
      });
    }

    const index = usuario.comunidad.findIndex(comunidad => comunidad.toString() === emisorDB.comunidad.toString());
    if (index === -1 || usuario.rol[index] !== 1) {
      return res.json({
        ok: false,
        mensaje: 'No tienes permisos para actualizar esta solicitud'
      });
    }

    emisorDB.estado = 1;
    const updatedEmisor = await emisorDB.save();

    res.json({
      ok: true,
      emisor: updatedEmisor
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar la solicitud' });
  }
});

// funcion para rechazar solicitudes
rutasEmisor.post('/rechazar',[verificaToken], async (req: any, res: Response) =>{
  try {
    const emisorId = req.body._id;

    const emisorDB = await Emisor.findById(emisorId);
    
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

    const usuario = await Usuario.findById(req.usuario._id);
    if (!usuario) {
      return res.json({
        ok: false,
        mensaje: 'No se encontró el usuario en la BD'
      });
    }

    const index = usuario.comunidad.findIndex(comunidad => comunidad.toString() === emisorDB.comunidad.toString());
    if (index === -1 || usuario.rol[index] !== 1) {
      return res.json({
        ok: false,
        mensaje: 'No tienes permisos para actualizar esta solicitud'
      });
    }

    emisorDB.estado = 2;
    const updatedEmisor = await emisorDB.save();

    res.json({
      ok: true,
      emisor: updatedEmisor
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar la solicitud' });
  }
});
export default rutasEmisor;