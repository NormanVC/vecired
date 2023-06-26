import { Router, Request, Response } from "express";
import { Emisor } from "../modelos/emitirBDmodel";
import { verificaToken } from "../middlewares/autenticacion";
import { Usuario } from '../modelos/usuarioBDModel';// Importar el modelo de Usuario

const rutasEmisor = Router();

//funcion para ver las solicitudes  a usuario
/* por ahora  muestra todas las peticiones */

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



//funcion para ver los estados de mis solicitudes
rutasEmisor.get('/miscertificados',(req: any, res: Response) =>{

});
// funcion para aceptar  solicitudes
rutasEmisor.post('/aceptar',(req: any, res: Response) =>{

});
// funcion para rechazar solicitudes
rutasEmisor.post('/rechazar',(req: any, res: Response) =>{

});
export default rutasEmisor;