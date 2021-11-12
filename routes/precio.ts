
import { verificaToken } from "../middlewares/autenticacion";
import { Router, Response, Request } from "express";
import { Precio } from "../models/precios.model";

const precioRoutes = Router();

// obtener el ultimo precio
precioRoutes.get('/', async (req: any, res: Response ) => {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 1;
    const precios = await  Precio.find()
                                    .sort({_id: -1})
                                    .skip( skip )
                                    .limit(1)
                                    .exec();
    res.json ({
        ok:true,
        pagina,
        precios
    });
});


// obtener el ultimo precio
precioRoutes.get('/historial', async (req: any, res: Response ) => {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 1;
    const precios = await  Precio.find({}, '-_id created humedo1 seco1 humedo2')
                                    .sort({_id: -1})
                                    .skip( skip )
                                    .limit(5)
                                    .exec();
    res.json ({
        precios
    });

});

//Obetner precios x2
precioRoutes.get('/obtener', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    const [ precios, total] =  await Promise.all([
                                    Precio.find({}, '_id created comentario humedo1 seco1 humedo2 humedo3 seco3 sede')
                                    .sort({_id: -1})          
                                    // .populate('usuario', 'nombre celular email dni avatar')
                                    .skip( desde )
                                    .limit( 5 ),
                                    Precio.countDocuments()
    ]);
    res.json({
        ok: true,
        precios,
        total,
        id: req.id 
    });
});


//Obetner Usuarios x2  nuevo
precioRoutes.get('/30', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    console.log(desde);

    const [ precios, total] =  await Promise.all([
                                    Precio.find({}, '_id created comentario humedo1 seco1 humedo2 humedo3 seco3 sede')
                                    .sort({_id: -1})          
                                    // .populate('usuario', 'nombre celular email dni avatar')
                                    .skip( desde )
                                    .limit( 100 ),
                                    Precio.countDocuments()
    ]);
    res.json({
        ok: true,
        precios,
        total,
        id: req.id 
    });
});


//Obetner 10 precios
precioRoutes.get('/10', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    console.log(desde);

    const [ precios, total] =  await Promise.all([
                                    Precio.find({}, '_id created comentario humedo1 seco1 humedo2 humedo3 seco3 sede')
                                    .sort({_id: -1})          
                                    // .populate('usuario', 'nombre celular email dni avatar')
                                    .skip( desde )
                                    .limit( 100 ),
                                    Precio.countDocuments()
    ]);
    res.json({
        ok: true,
        precios,
        total,
        id: req.id 
    });
});


//crear precios 
precioRoutes.post('/', [verificaToken], (req: any, res: Response ) => {
    const body = req.body;
    Precio.create(body).then(PrecioDB => {
        res.json ({
            ok:true,
            precio: PrecioDB
        });
    }).catch( err => {
        res.json(err)
    });
});


// Crear un sipo de solicitud en la seccion SERVICIOS
precioRoutes.post('/create', (req: Request, res: Response) => {
    const precio = {
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

    Precio.create( precio).then( PrecioDB => {
        res.json({
            ok: true,
            precio: PrecioDB
        });


    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    })
});


//Borrar precio
precioRoutes.delete('/:id',    (req: any, res: Response) => {
    const id = req.params.id;

    Precio.findByIdAndRemove(id, (err, precios ) => {
        if(err) throw err;

        res.json({
            ok: true,
            mensaje: 'Precio Eliminado',
            body: precios
        })
    }); 
});



//Actualizar precio
precioRoutes.post('/update/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const precio = {
        humedo1: req.body.humedo1,
        seco1: req.body.seco1,
        humedo3: req.body.humedo3,
        seco3: req.body.seco3,
        comentario: req.body.comentario,
        sede: req.body.sede
    }
    Precio.findByIdAndUpdate(id, precio, {new: true}, (err, precio) => {
        if(err) throw err;
        if(!precio){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true, 
            precio 
        })
    })
});


export default precioRoutes;