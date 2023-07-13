import { Router , Request , Response} from "express";
import { Certificado } from "../modelos/certificadoBDmodel";
import { verificaToken } from "../middlewares/autenticacion";
import { Comunidad } from "../modelos/comunidadBDModel";
import { Usuario } from "../modelos/usuarioBDModel";

const rutasCertificados = Router();
const sanitizeHtml = require('sanitize-html');

rutasCertificados.post('/crear', [verificaToken],async (req: any, res: Response) => {
    // Validaciones

    // Validación de caracteres en el título
    var caracteres = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ ]{3,50})+$/g;
    if (caracteres.test(req.body.titulo) === false) {
        return res.json({
            ok: false,
            mensaje: 'Caracteres inválidos en el título, ingrese otro nombre.'
        });
    }

    if (req.body.titulo.length > 50) {
        return res.json({
            ok: false,
            mensaje: 'Título de certificado demasiado largo.'
        });
    }

    if (req.body.descripcion.length > 1200) {
        return res.json({
            ok: false,
            mensaje: 'Descripción del correo demasiado larga, intente acortar texto.'
        });
    }
    // se usa sanitize-html para limpiarla de cualquier codigo malicioso
    const descripcionSanitizada = sanitizeHtml(req.body.descripcion);

    // Validación del formato del número de contacto
    var caracterescelular = /^(\+?56)?(\s?)(0?9)(\s?)[98765432]\d{7}$/;
    if (caracterescelular.test(req.body.contacto) === false) {
        return res.json({
            ok: false,
            mensaje: 'Formato de celular no válido, intente de nuevo.'
        });
    }

        try {
            // Se verifica si la flag de emitirCertificado es igual a 0, si es asi, no se puede crear un certificado
            const comunidad = await Comunidad.findById(req.body.comunidad);
            if (!comunidad) {
            return res.json({
                ok: false,
                mensaje: 'No se encontró la comunidad en la base de datos.'
            });
            }
        
            if (comunidad.emitirCertificado === 0) {
            return res.json({
                ok: false,
                mensaje: 'La comunidad no puede emitir certificados.'
            });
            }
        
            // Revisar si  existe el usuario en la base de datos
            const usuario = await Usuario.findById(req.usuario._id);
            if (!usuario) {
            return res.json({
                ok: false,
                mensaje: 'No se encontró el usuario en la base de datos.'
            });
            }
            
            // Revisar si el rol 1 (privilegiado) pertenece al la comunidad 
            const index = usuario.comunidad.findIndex(comunidad => comunidad.toString() === req.body.comunidad);

            if (index === -1 || usuario.rol[index] !== 1) {
            return res.json({
                ok: false,
                mensaje: 'No tienes permisos para crear un certificado en esta comunidad.'
            });
            }
        
            // Crear el certificado
            const dataCertificado = {
            titulo: req.body.titulo,
            descripcion: descripcionSanitizada,
            replegal: req.body.replegal,
            contacto: req.body.contacto,
            logo: req.body.logo,
            comunidad: req.body.comunidad
            };
        
            const certificadoBD = await Certificado.create(dataCertificado);
            res.json({
            ok: true,
            dataCertificado: certificadoBD
            });
        } catch (err) {
            res.json({
            ok: false,
            err
            });
        }
      
    });
//actualizar certificado

rutasCertificados.post('/update', verificaToken, async (req: any, res: Response) => {
    try {
        const certificadoId = req.body._id;
    
        // Buscar el certificado por ID
        const certificado = await Certificado.findById(certificadoId);
    
        if (!certificado) {
            return res.json({
            ok: false,
            mensaje: 'No existe el certificado especificado',
            });
        }
    
        // Obtener el ID de la comunidad asociada al certificado
        const comunidadId = certificado.comunidad.toString();
    
        // Verificar si el usuario pertenece a la comunidad y tiene rol igual a 1
        const usuario = await Usuario.findById(req.usuario._id);
    
        if (!usuario) {
            return res.json({
            ok: false,
            mensaje: 'No se encontró el usuario en la base de datos',
            });
        }
    
        const index = usuario.comunidad.findIndex(
            (comunidad) => comunidad.toString() === comunidadId
        );
    
        if (index === -1 || usuario.rol[index] !== 1) {
            // El usuario no tiene los permisos necesarios para actualizar el certificado
            return res.json({
            ok: false,
            mensaje: 'No tienes permisos para actualizar este certificado en la comunidad especificada',
            });
        }
  
            // Validaciones
        
            // Validación de caracteres en el título
            var caracteres = /(^[A-Za-zÁÉÍÓÚáéíóúñÑ ]{3,50})+$/g;
            if (caracteres.test(req.body.titulo) === false) {
                return res.json({
                ok: false,
                mensaje: 'Caracteres inválidos en el título, ingrese otro nombre.',
                });
            }
        
            if (req.body.titulo.length > 50) {
                return res.json({
                ok: false,
                mensaje: 'Título de certificado demasiado largo.',
                });
            }
        
            if (req.body.descripcion.length > 1200) {
                return res.json({
                ok: false,
                mensaje: 'Descripción del correo demasiado larga, intente acortar texto.',
                });
            }
            const descripcionSanitizada = sanitizeHtml(req.body.descripcion);

            // Validación del formato del número de contacto
            var caracterescelular = /^(\+?56)?(\s?)(0?9)(\s?)[98765432]\d{7}$/;
            if (caracterescelular.test(req.body.contacto) === false) {
                return res.json({
                ok: false,
                mensaje: 'Formato de celular no válido, intente de nuevo.',
                });
            }
  
                        // Actualizar el certificado
                        const dataCertificado = {
                            titulo: req.body.titulo,
                            descripcion: descripcionSanitizada,
                            replegal: req.body.replegal,
                            contacto: req.body.contacto,
                            logo: req.body.logo,
                        };
                    
                        const certificadoActualizado = await Certificado.findByIdAndUpdate(
                            certificadoId,
                            dataCertificado,
                            { new: true }
                        );
                    
                        if (!certificadoActualizado) {
                            return res.json({
                            ok: false,
                            mensaje: 'No se pudo actualizar el certificado',
                            });
                        }
                    
                        res.json({
                            ok: true,
                            certificado: certificadoActualizado,
                        });
                        } catch (error) {
                        console.log(error);
                        return res.json({
                            ok: false,
                            mensaje: 'Error al actualizar el certificado',
                        });
    }
  });

export default rutasCertificados;