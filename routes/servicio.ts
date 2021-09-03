import { Router, Response, Request } from "express";
import { verificaToken } from "../middlewares/autenticacion";
import { Servicio } from "../models/servicio.model";

const servicioRoutes = Router();

//Obtener Servicios Paginados
servicioRoutes.get('/', async(req: any, res: Response) => {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10;
    const servicios = await Servicio.find()
    .sort({_id: -1})
    .skip(skip)
    .limit(10)
    .populate('usuario','-password')
    .exec();
    res.json({
        ok: true,
        pagina,
        servicios
    });
});

//Obetner Servicios x2
servicioRoutes.get('/obtener', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    const [ servicios, total] =  await Promise.all([
                                    Servicio.find()
                                    .sort({_id: -1})          
                                    .populate('usuario', 'nombre celular email dni avatar')
                                    .skip( desde )
                                    .limit( 5 ),
                                    Servicio.countDocuments()
    ]);
    res.json({
        ok: true,
        servicios,
        total,
        id: req.id 
    });
});

// Crear una  solicitud en la seccion SERVICIOS
servicioRoutes.post('/',  [verificaToken] , (req: any, res: Response) => {
    const body = req.body
    body.usuario = req.usuario._id;
    Servicio.create(body).then(async servicioDB => {
        await servicioDB.populate('usuario').execPopulate();
        res.json({
            ok: true,
            servicios: servicioDB
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    })
});

//Actualizar Servicio Recojo de Cacao
servicioRoutes.post('/update/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const servicios = {
        estado: req.body.estado,
        proceso: req.body.proceso,
        completado: req.body.completado,
        observacion: req.body.observacion,
        grano: req.body.grano,
        sede: req.body.sede,
        tecnico: req.body.tecnico,
        comentario: req.body.comentario || req.servicios.comentario,
        precio: req.body.precio,
        start: req.body.start,
        cantidad: req.body.cantidad,
    }
    Servicio.findByIdAndUpdate(id, servicios, {new: true}, (err, servicios) => {
        if(err) throw err;
        if(!servicios){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true,
            
        });servicios
    })
});

//Borrar Servicio Recojo de cacao
servicioRoutes.delete('/:id',    (req: any, res: Response) => {
    const id = req.params.id;
    Servicio.findByIdAndRemove(id, (err, servicios ) => {
        if(err) throw err;
        res.json({
            ok: true,
            mensaje: 'Mensaje Eliminado',
            body: servicios
        })
    }); 
});

//Exportar
servicioRoutes.get('/exportar', async (req: any, res: any) => {
    const [ servicios ] =  await Promise.all([
                                    Servicio.find()
                                    .sort({_id: -1})    
    ]);
    res.json({
        ok: true,
        servicios,
    });
});

export default servicioRoutes;


