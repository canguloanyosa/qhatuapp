import { Router, Response, Request } from "express";
import { verificaToken } from "../middlewares/autenticacion";
import { Propiedades } from "../models/propiedades.model";

const propiedadesRoutes = Router();

propiedadesRoutes.get('/', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    const [ propiedades, total] =  await Promise.all([
                                    Propiedades.find()
                                    .sort({_id: -1})          
                                    .populate('usuario', 'nombre celular email dni avatar')
                                    .skip( desde )
                                    .limit( 30 ),
                                    Propiedades.countDocuments()
    ]);
    res.json({
        ok: true,
        total,
        propiedades,
        id: req.id 
    });
});

// Crear una  solicitud en la seccion SERVICIOS
propiedadesRoutes.post('/',  [verificaToken] , (req: any, res: Response) => {
    const body = req.body
    body.usuario = req.usuario._id;
    Propiedades.create(body).then(async propiedadesDB => {
        await propiedadesDB.populate('usuario').execPopulate();
        res.json({
            ok: true,
            propiedades: propiedadesDB
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    })
});


//Actualizar Propiedades
propiedadesRoutes.post('/update/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const propiedades = {
        codigo: req.body.codigo,
        altitud: req.body.altitud,
        precipitacion: req.body.precipitacion,
        temperatura: req.body.temperatura,
        hectareas: req.body.hectareas,
    }
    Propiedades.findByIdAndUpdate(id, propiedades, {new: true}, (err, propiedades) => {
        if(err) throw err;
        if(!propiedades){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true,
            propiedades
        });
    })
});


//Borrar Servicio Recojo de cacao
propiedadesRoutes.delete('/:id',    (req: any, res: Response) => {
    const id = req.params.id;

    Propiedades.findByIdAndRemove(id, (err, propiedades ) => {
        if(err) throw err;

        res.json({
            ok: true,
            mensaje: 'Propiedad Eliminada',
            body: propiedades
        })
    }); 
});


export default propiedadesRoutes;











