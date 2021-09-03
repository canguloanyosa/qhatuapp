import { Router, Response, Request, response } from 'express';
const notificacionRouter = Router();
import { Notificacion } from '../models/notificaciones.model';


// Crear
notificacionRouter.post('/crear', (req: Request, res: Response) => {
    const notificacion = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        portada: req.body.portada,
        url: req.body.url,
        userId: req.body.userId,
        pushId: req.body.pushId,
        tipo: req.body.tipo,
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
    const [ notificacion, total] =  await Promise.all([
                                    Notificacion.find()
                                    .sort({_id: -1})          
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

// Borrar Notificacion 
notificacionRouter.delete('/:id',    (req: any, res: Response) => {
    const id = req.params.id;
    Notificacion.findByIdAndRemove(id, (err, notificacion ) => {
        if(err) throw err;
        res.json({
            ok: true,
            mensaje: 'Notificacion Eliminada',
            body: notificacion
        })
    }); 
});

module.exports =  notificacionRouter;