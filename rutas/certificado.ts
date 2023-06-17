import { Router , Request , Response} from "express";
import { Certificado } from "../modelos/certificadoBDmodel";
import { verificaToken } from "../middlewares/autenticacion";
import { Usuario } from '../modelos/usuarioBDModel';

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
            mensaje: 'Titulo de certificado demasiado largo.'
             });
    }

    if(req.body.descripcion.length > 1200)
    {
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

//actualizar certificado
rutasCertificados.post('/update',verificaToken, (req: Request, res: Response) => {

    res.json({
        ok:true
    });

});


export default rutasCertificados;