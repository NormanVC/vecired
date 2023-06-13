import { Router , Request , Response} from "express";
import { Certificado } from "../modelos/certificadoBDmodel";
import { Comunidad } from '../modelos/comunidadBDModel';

const rutasCertificados = Router();

rutasCertificados.post('/create', (req: Request, res: Response) => {
    //validaciones
    
    const cert = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        logo: req.body.logo,
        motivo: req.body.motivo,
        fechaemision: req.body.fechaemision,
        comunidad: req.body.Comunidad
    }
    
    res.json({
        ok:true,
        cert
        //mensaje:'Tudo bem'
    })
    
});

export default rutasCertificados;