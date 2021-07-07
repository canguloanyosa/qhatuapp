
import { verificaToken } from "../middlewares/autenticacion";
import { Router, Response, Request } from "express";
import { PrecioSede } from "../models/preciosede.model";


const preciosedeRoutes = Router();



// Crear precio x sede
preciosedeRoutes.post('/create', (req: Request, res: Response) => {
    const preciosede = {
        humedo1: req.body.humedo1,
        seco1: req.body.seco1,
        humedo2: req.body.humedo2,
        sede: req.body.sede,
        seco2: req.body.seco2,
        humedo3: req.body.humedo3,
        seco3: req.body.seco3,
        comentario: req.body.comentario,
        img: req.body.img

    }

    PrecioSede.create( preciosede).then( PrecioSedeDB => {
        res.json({
            ok: true,
            preciosede: PrecioSedeDB
        });


    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    })
});


//Obetner 30 precios por sede
preciosedeRoutes.get('/30', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    console.log(desde);

    const [ preciosede, total] =  await Promise.all([
                                    PrecioSede.find({}, '_id created comentario humedo1 seco1 humedo2 humedo3 seco3 sede')
                                    .sort({_id: -1})          
                                    // .populate('usuario', 'nombre celular email dni avatar')
                                    .skip( desde )
                                    .limit( 30 ),
                                    PrecioSede.countDocuments()
    ]);
    res.json({
        ok: true,
        preciosede,
        total,
        id: req.id 
    });
});


//Obetner precios por sede x2
preciosedeRoutes.get('/obtener', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    console.log(desde);

    const [ preciosede, total] =  await Promise.all([
                                    PrecioSede.find({}, '_id created comentario humedo1 seco1 humedo2 humedo3 seco3 sede')
                                    .sort({_id: -1})          
                                    .skip( desde )
                                    .limit( 5 ),
                                    PrecioSede.countDocuments()
    ]);
    res.json({
        ok: true,
        preciosede,
        total,
        id: req.id 
    });
});




//Borrar precio
preciosedeRoutes.delete('/:id',    (req: any, res: Response) => {
    const id = req.params.id;

    PrecioSede.findByIdAndRemove(id, (err, preciosede ) => {
        if(err) throw err;

        res.json({
            ok: true,
            mensaje: 'Precio Eliminado',
            body: preciosede
        })
    }); 
});








export default preciosedeRoutes;