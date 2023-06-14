import { Router , Request , Response} from "express";
import { Certificado } from "../modelos/certificadoBDmodel";

const rutasCertificados = Router();

rutasCertificados.post('/create', (req: any, res: Response) => {
    //validaciones
    // se debera colocar  breadcrumbs en  frontend
    
    var caracteres = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ ]{3,50})+$/g;
   
    if(caracteres.test(req.body.titulo) == false)
    {
        return res.json({
            ok: false,
            mensaje: 'Caracteres invalidos en el Titulo, ingrese otro nombre.'
             });
    }

    if(req.body.titulo.length > 50 )
    {
        return res.json({
            ok: false,
            mensaje: 'Titulo de certificado demasiado largo'
             });
    }

    //agregar validacion a descripcion
    //se debera agregar validacion para que tome el id de comunidad donde se emita

    const dataCertificado = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        logo: req.body.logo,
        motivo: req.body.motivo,
        fechaEmision: req.body.fechaemision,
        comunidad: req.body.comunidad
    }
    
    Certificado.create(dataCertificado).then(certificadoBD =>
        {
            res.json({
                ok: true,
                dataCertificado
            });
        }).catch(err => {
            res.json({
                ok: false,
                err
            });
        })


});

export default rutasCertificados;