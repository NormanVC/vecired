import { Router , Request , Response} from "express";

const rutasCertificados = Router();

rutasCertificados.get('/prueba', (req: Request, res: Response) => {
    res.json({
        ok:true,
        mensaje:'Tudo bem'
    })
    
});

export default rutasCertificados;