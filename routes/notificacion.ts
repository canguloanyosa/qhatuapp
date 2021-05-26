import { Router, Response, Request, response } from 'express';
import { check, validationResult } from 'express-validator';
const notificacionRouter = Router();
import { Notificacion } from '../models/notificaciones.model';




// Crear un sipo de solicitud en la seccion NOTICIAS
notificacionRouter.post('/crear', (req: Request, res: Response) => {
    const notificacion = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        portada: req.body.portada,
        url: req.body.url,
        userId: req.body.userId,
        pushId: req.body.pushId,

    }

    Notificacion.create( notificacion).then( notificacionDB => {
        res.json({
            ok: true,
            notificacion: notificacionDB
        });


    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    })
});






//Obetner Servicios x2
notificacionRouter.get('/obtener', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    // console.log(desde);



    const [ notificacion, total] =  await Promise.all([
                                    Notificacion.find()
                                    .sort({_id: -1})          
                                    // .populate('usuario', 'nombre celular email dni avatar')
                                    .skip( desde )
                                    .limit( 10 ),
                                    Notificacion.countDocuments()
    ]);
    res.json({
        ok: true,
        notificacion,
        total,
        id: req.id 
    });
});




module.exports =  notificacionRouter;