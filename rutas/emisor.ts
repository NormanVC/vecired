import { Router , Request , Response} from "express";
import { Emisor } from "../modelos/emitirBDmodel";

const rutasEmisor = Router();

rutasEmisor.post('/solicitud', (req: any, res: Response) => {
    //validaciones
    var caracteres = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!?¿@-_.,/()= ]{1,250})+$/g;

    if(caracteres.test(req.body.motivo) == false)
    {
        return res.json({
            ok: false,
            mensaje: 'Caracteres invalidos en mensaje'
         });
    }

    if(req.body.motivo == '')
    {
        return res.json({
            ok:false,
            mensaje: 'Se debe proporcionar un motivo para emitir el certificado'
        });
    }

    // se debe hacer una funcion para revisar si existe una solicitud del usuario

    const dataEmisor = {
        nombre: req.body.nombre,
        rut: req.body.rut,
        motivo: req.body.motivo,
        fechaemision: req.body.date,
        certficado:   req.body.certificado,
        comunidad:    req.body.comunidad,
        estado: req.body.estado
    }
    
    Emisor.create(dataEmisor).then(emisorBD =>
        {
            res.json({
                ok: true,
                dataEmisor
            });
        }).catch(err => {
            res.json({
                ok: false,
                err
            });
        })


});

//funcion para ver las solicitudes  a usuario privilegiado
rutasEmisor.get('/solicitudes',(req: any, res: Response) =>{

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