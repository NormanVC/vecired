import {Router, Request, Response, request} from "express";
import { Publicacion, OpcionesCategoria } from "../modelos/publicacionBDModel";
import { verificaToken } from "../middlewares/autenticacion";
import { Usuario } from '../modelos/usuarioBDModel';
import { Comunidad } from '../modelos/comunidadBDModel';


const rutasPublicacion = Router();

//Ver todas las publicaciones de la comunidad
rutasPublicacion.get('/', [verificaToken], async (req:any, res: Response) => {

    try{
        const usuario = await Usuario.findById(req.usuario._id);
        if(!usuario){
            return res.status(404).json({
                ok: false,
                mensaje: 'Usuario no encontrado.'
            });
        }

        const comunidad = usuario.comunidad;
        const publicaciones = await Publicacion.find({ comunidadId: {$in: comunidad } }).populate('usuarioId');
        if(publicaciones.length === 0){
            return res.status(404).json({
                ok:false,
                mensaje: 'No se encontraron publicaciones.'
            });
        }

        res.json({
            publicaciones,
            ok: true
        });
    } catch(error){
        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener las publicaciones.',
            error
        });
    }
});

//Crear publicacion
rutasPublicacion.post('/crear', (req:any, res: Response) =>{

    //VALIDACIONES
    //Validacion caracteres titulo
    var caracteres = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!?¿@-_.,/()= ]{1,100})+$/g;
    if(caracteres.test(req.body.titulo) == false){
        return res.json({
            ok: false,
            mensaje: 'Caracteres invalidos en el título.'
        });
    }

    //Validacion caracteres descripcion
    var caracteres2 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!?¿@-_.,/()= ]{1,500})+$/g;
    if(caracteres2.test(req.body.descripcion) == false){
        return res.json({
            ok: false,
            mensaje: 'Caracteres invalidos en la descripción.'
        })
    }

    //Validacion longitud de titulo
    if(req.body.titulo.length > 100 || req.body.titulo.length <= 2){
        return res.json({
            ok: false,
            mensaje: 'Título demasiado largo o corto.'
        });
    }

    //Validacion longitud descripcion
    if(req.body.descripcion.length > 500 || req.body.descripcion.length <= 2){
        return res.json({
            ok: false,
            mensaje: 'Descripción demasiado larga o corta.'
        });
    }

    //Validacion si el precio es un numero
    const precio= Number(req.body.precio);
    if(isNaN(precio)){
        return res.json({
            ok:false,
            mensaje: 'El precio debe ser un número válido.',
        });
    }

    //Validacion precio num positivo
    if(!Number.isInteger(precio) || precio <= 0){
        return res.json({
            ok:false,
            mensaje: 'El precio debe ser un número entero positivo.',
        })
    }

    //Validacion Categoria
    const categoria: OpcionesCategoria = req.body.categoria;
    if(!Object.values(OpcionesCategoria).includes(categoria)){
        return res.json({
            ok: false,
            mensaje: 'La categoría no es válida.',
        });
    }
    //Validacion Imagenes
    /*if(!Array.isArray(req.body.imagenes) || req.body.imagenes.some((imagen: string) => typeof imagen !== 'string')){
        return res.json({
            ok:false,
            mensaje:'el campo imagenes debe ser un arreglo de cadenas (URL).',
        })
    }*/

    //Fin validaciones
    const dataPublicacion = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        imagenes: req.body.imagenes,
        precio: req.body.precio,
        categoria: req.body.categoria,
        usuarioId: req.body.usuarioId
    }

    Publicacion.create(dataPublicacion).then(publicacionBD =>{
        res.json({
            ok: true,
            dataPublicacion
        });
    }).catch(err=>{
        res.json({
            ok: false,
            err
        });
    })


})


//Editar Publicacion
rutasPublicacion.post('/editar/:publicacionId', [verificaToken], async (req: any, res: Response) =>{

    //VALIDACIONES
    //Validacion caracteres titulo
    var caracteres = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!?¿@-_.,/()= ]{1,100})+$/g;
    if(caracteres.test(req.body.titulo) == false){
        return res.json({
            ok: false,
            mensaje: 'Caracteres invalidos en el título.'
        });
    }

    //Validacion caracteres descripcion
    var caracteres2 = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9¡!?¿@-_.,/()= ]{1,500})+$/g;
    if(caracteres2.test(req.body.descripcion) == false){
        return res.json({
            ok: false,
            mensaje: 'Caracteres invalidos en la descripción.'
        })
    }

    //Validacion longitud de titulo
    if(req.body.titulo.length > 100 || req.body.titulo.length <= 2){
        return res.json({
            ok: false,
            mensaje: 'Título demasiado largo o corto.'
        });
    }

    //Validacion longitud descripcion
    if(req.body.descripcion.length > 500 || req.body.descripcion.length <= 2){
        return res.json({
            ok: false,
            mensaje: 'Descripción demasiado larga o corta.'
        });
    }

    //Validacion si el precio es un numero
    const precio= Number(req.body.precio);
    if(isNaN(precio)){
        return res.json({
            ok:false,
            mensaje: 'El precio debe ser un número válido.',
        });
    }

    //Validacion precio num positivo
    if(!Number.isInteger(precio) || precio <= 0){
        return res.json({
            ok:false,
            mensaje: 'El precio debe ser un número entero positivo.',
        })
    }

    //Validacion Categoria
    const categoria: OpcionesCategoria = req.body.categoria;
    if(!Object.values(OpcionesCategoria).includes(categoria)){
        return res.json({
            ok: false,
            mensaje: 'La categoría no es válida.',
        });
    }
    //Validacion Imagenes
    /*if(!Array.isArray(req.body.imagenes) || req.body.imagenes.some((imagen: string) => typeof imagen !== 'string')){
        return res.json({
            ok:false,
            mensaje:'el campo imagenes debe ser un arreglo de cadenas (URL).',
        })
    }*/

    try {
        const usuarioId = req.usuario._id;
        const publicacionId = req.params.publicacionId;

        //Verificamos si la publicacion existe y pertenece al usuario actual
        const publicacion = await Publicacion.findOne({ _id: publicacionId, usuarioId})
        if(!publicacion){
            return res.status(404).json({
                ok:false,
                mensaje: 'La publicacion no existe o no te pertenece.'
            });
        }

        publicacion.titulo = req.body.titulo;
        publicacion.descripcion = req.body.descripcion;
        publicacion.imagenes = req.body.imagenes;
        publicacion.precio = req.body.precio;
        publicacion.categoria = req.body.categoria;

        await publicacion.save();

        res.json({
            ok: true,
            publicacion
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error al editar la publicacion.'
        });
    }
});

//Ver publicacion del mismo usuario
rutasPublicacion.get('/mis-publicaciones', [verificaToken], async (req: any, res: Response)=>{

    try{
        const usuarioId = req.usuario._id;

        const publicaciones = await Publicacion.find({ usuarioId });

        res.json ({
            publicaciones,
            ok: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            mensaje: 'Error al obtener las publicaciones del usuario.'
        });
    }

});

//Borrar la publicacion del mismo usuario
rutasPublicacion.delete('/borrar/:publicacionId', [verificaToken], async (req: any, res: Response)=>{

    try {
        const usuarioId = req.usuario._id;
        const publicacionId = req.params.publicacionId;

        //Verificamos si la publicacion pertenece al usuario
        const publicacion = await Publicacion.findOne({ _id: publicacionId, usuarioId });
        if(!publicacion){
            return res.status(404).json({
                ok:false,
                mensaje: 'La publicacion no existe o no pertenece al usuario.'
            });
        }

        //Eliminar la publicacion
        await Publicacion.findByIdAndRemove(publicacionId);

        res.json({
            ok: true,
            mensaje: 'Publicacion eliminada exitosamente.'
        });
    } catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error al eliminar la publicacion.'
        });
    }
});


//Borrar una publicacion especifica de otro usuario en una comunidad dependiendo de su rol
rutasPublicacion.delete('/borrarPublicaciones/:publicacionId', [verificaToken], async(req: any, res:Response)=>{

    try {
        const usuarioId = req.usuario._id;
        const publicacionId = req.params.publicacionId;

        //Verificamos si el usuario tiene el rol adecuado (en este caso el valor para el rol de miembro directiva es 2)
        const usuario = await Usuario.findOne({ _id: usuarioId, rol: 2});
        if(!usuario){
            return res.status(401).json({
                ok: false,
                mensaje: 'No tienes permisos para borrar otras publicaciones.'
            });
        }

        //Verificamos si la publicacion existe y pertenece a la misma comunidad del usuario
        const publicacion = await Publicacion.findOne({ _id: publicacionId, comunidadId: { $in: usuario.comunidad } });
        if(!publicacion) {
            return res.status(404).json({
                ok: false,
                mensaje: 'La publicacion no existe o no pertenece a tu comunidad.'
            });
        }

        //Borramos la publicacion
        await Publicacion.findByIdAndDelete(publicacionId);

        res.json({
            ok:true,
            mensaje: 'La publicacion ha sido borrada exitosamente.'
        });
    } catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            mensaje: 'Error al borrar la publicacion.'
        });
    }

});


export default rutasPublicacion;