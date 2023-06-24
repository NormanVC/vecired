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
    
       //validaciones telefono celular
       var caracterescelular = /^(\+?56)?(\s?)(0?9)(\s?)[98765432]\d{7}$/
       if(caracterescelular.test(req.body.contacto) == false)
       {
           return res.json({
               ok:false,
               mensaje: 'Formato de celular no valido, intente de nuevo.'
           });
       }
    //se debera agregar validacion para que tome el id de comunidad donde se emita, de manera que no se deba interactuar con IDs


    const dataCertificado = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        replegal: req.body.replegal,
        contacto: req.body.contacto,
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
rutasCertificados.post('/update', (req: any, res: Response) => {

    //validaciones titulo
    if(req.body.titulo == ''){
        return res.json({
            ok:false,
            mensaje: 'El titulo no puede ser enviado vacio.'
        });
    }

    var caracteres = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ ]{3,50})+$/g;

    if(caracteres.test(req.body.titulo) == false)
    {
        return res.json({
            ok: false,
            mensaje: 'Caracteres invalidos en el Titulo, ingrese otro nombre.'
             });
    }

    //validaciones descripcion
    if(req.body.descripcion == ''){
        return res.json({
            ok:false,
            mensaje: 'La descripcion del certificado no puede estar vacia.'
        });
    }

    if(req.body.descripcion.length > 1200)
    {
        return res.json({
            ok: false,
            mensaje: 'Descripcion del correo demasiado larga, intente acortar texto.'
        });
    }

    //validaciones rep legal

    var caracteresrep = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ ]{3,30})+$/g;
    if(caracteresrep.test(req.body.titulo) == false)
    {
        return res.json({
            ok: false,
            mensaje: 'Caracteres invalidos en el nombre.'
             });
    }

    if(req.body.replegal.length > 30 )
    {
        return res.json({
            ok: false,
            mensaje: 'Nombre demasiado largo, intente recortar.'
             });
    }

    //validaciones telefono celular
    var caracterescelular = /^(\+?56)?(\s?)(0?9)(\s?)[98765432]\d{7}$/
    if(caracterescelular.test(req.body.contacto) == false)
    {
        return res.json({
            ok:false,
            mensaje: 'Formato de celular no valido, intente de nuevo.'
        });
    }

    //validaciones logo

    if(req.body.logo == ''){
        return res.json({
            ok:false,
            mensaje: 'Se tiene que proporcionar un logo'
        });
    }

    
    const dataCertificado ={
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        replegal: req.body.replegal,
        contacto: req.body.contacto,
        logo: req.body.logo
    }
    
    Certificado.findByIdAndUpdate(req.body._id, dataCertificado, {new: true}, (err,certificadoDB) => {
        
        if (err) throw err;

        if (!certificadoDB) {
            return res.json({
                ok:false,
                mensaje: 'No existe el siguiente certificado'
            })
        }
        /*
            SE DEBE IMPLEMENTAR UNA VALIDACION PARA QUE SOLO UNA PERSONA DENTRO DE LA COMUNIDAD  Y DE ROL ADECUADO PUEDA ACTUALIZAR
        */
            res.json({
                ok: true,
                certificadoDB
            });

    });

});


export default rutasCertificados;