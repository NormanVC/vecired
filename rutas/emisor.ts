import { Router , Request , Response} from "express";
import { Emisor } from "../modelos/emitirBDmodel";

const rutasEmisor = Router();

rutasEmisor.post('/solicitud', (req: any, res: Response) => {
    //validaciones

    const dataEmisor = {
        nombre: req.body.nombre,
        rut: req.body.rut,
        motivo: req.body.motivo,
        fechaemision: req.body.date,
        certficado:   req.body.certificado,
        comunidad:    req.body.comunidad
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

export default rutasEmisor;