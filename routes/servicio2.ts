import { Router, Response, Request } from "express";
import { verificaToken } from "../middlewares/autenticacion";
import { Servicio2 } from "../models/servicio2.model";

const servicio2Routes = Router();


//Obtener Servicios Paginados
servicio2Routes.get('/', async(req: any, res: Response) => {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10;

    const servicios2 = await Servicio2.find()
    .sort({_id: -1})
    .skip(skip)
    .limit(10)
    .populate('usuario','-password')
    .exec();


    res.json({
        ok: true,
        pagina,
        servicios2
    });
});











//Obetner Servicios x2
servicio2Routes.get('/obtener', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    // console.log(desde);



    const [ servicios2, total] =  await Promise.all([
                Servicio2.find()
                .sort({_id: -1}) 
                .populate('usuario', 'nombre celular email dni avatar')
                                    .skip( desde )
                                    .limit( 5 ),
                                    Servicio2.countDocuments()
    ]);
    res.json({
        ok: true,
        servicios2,
        total,
        id: req.id 
    });
});





// Crear una  solicitud en la seccion SERVICIOS
servicio2Routes.post('/',  [verificaToken] , (req: any, res: Response) => {

    const body = req.body
    body.usuario = req.usuario._id;


    

    Servicio2.create(body).then(async servicio2DB => {
        await servicio2DB.populate('usuario').execPopulate();
        res.json({
            ok: true,
            servicio2: servicio2DB
        });
   


    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    })
});













//Actualizar Servicio Asistencia Tecnica
servicio2Routes.post('/update/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const servicio2 = {
        estado: req.body.estado,
        proceso: req.body.proceso,
        completado: req.body.completado,
        observacion: req.body.observacion,


        start: req.body.start,
        
    }
    Servicio2.findByIdAndUpdate(id, servicio2, {new: true}, (err, servicio2) => {
        if(err) throw err;
        if(!servicio2){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true,
            servicio2
        });
    })
});







//Borrar Servicio Recojo de cacao
servicio2Routes.delete('/:id',    (req: any, res: Response) => {
    const id = req.params.id;

    Servicio2.findByIdAndRemove(id, (err, servicio2 ) => {
        if(err) throw err;

        res.json({
            ok: true,
            mensaje: 'Servicio Asistencia Tecnica Eliminado',
            body: servicio2
        })
    }); 
});






export default servicio2Routes;


