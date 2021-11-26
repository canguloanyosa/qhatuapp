import { Router, Response } from "express";
import { Compra } from "../models/compra.model";
import { verificaTokenSocio } from '../middlewares/autenticationSocio';

const webpush = require('web-push');
const compraRoutes = Router();


//Obtener compra Paginados
compraRoutes.get('/', async(req: any, res: Response) => {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10;

    const compras = await Compra.find()
    .sort({_id: -1})
    .skip(skip)
    .limit(10)
    .populate('socio')
    .exec();


    res.json({
        ok: true,
        pagina,
        compras
    });
});


//Obtener Compras Paginados
compraRoutes.get('/listar', async(req: any, res: Response) => {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10;

    const compras = await Compra.find()
    .sort({_id: -1})
    .skip(skip)
    .limit(80)
    .populate('socio')
    .exec();

    res.json({
        ok: true,
        pagina,
        compras
    });
});

// compraRoutes.get('/filtrar',(req: any, res: any) => {

//     Compra.find({ "created":{
//         "$gte": new Date("2021-04-24"), 
//         "$lt": new Date("2021-04-29")
//     }},
//     function (err, result) {
//     if (err){
//         res.status(400).send({data: { message: err }});
//         return;
//     }
//     else if(result)
//     {
//         res.status(200).send({data: { message: result }});
//     }
//     })
// })




//OBTENER COMPRAS EN UN RANGO DE FECHA
compraRoutes.post('/filtro', async (req: any, res: any) => {

    Compra.find({ "created":{
        "$gte": new Date(req.body.startDate), 
        "$lt": new Date(req.body.endDate)
    }},
    function (err, result) {
    if (err){
        res.status(400).send({data: { message: err }});
        return;
    }
    else if(result)
    {
        res.status(200).send({data: { message: result }});
    }
    })
})




compraRoutes.post('/filtrofecha', async (req: any, res: any) => {

  
    const [ compra, total] =  await Promise.all([
        Compra.find({ "created":{
            "$gte": new Date(req.body.startDate), 
            "$lt": new Date(req.body.endDate)
        }}, '_foto  dni nombre email celular precio cantidad  total sede')
        .sort({_id: -1})   
        .populate('socio'),
    ]);
        res.json({
        ok: true,
        total,
        compra,
    });

    
})





compraRoutes.post('/filtro_socio', async (req: any, res: any) => {
    const socio = req.body.socio;
    const [ compra, total] =  await Promise.all([
        Compra.find({ "socio":{
            "_id": socio, 
        }}, '_foto  dni nombre email celular precio cantidad  total sede ')
        .sort({_id: -1})   
        .populate('socio'),
        Compra.countDocuments({ "socio":{
            "_id": socio, 
        }})
    ]);
        res.json({
        ok: true,
        total,
        compra,
    });
})







compraRoutes.post('/filtroid', async (req: any, res: any) => {
    const socio = req.body.socio;
    const desde =  Number(req.query.desde) || 0;
    const [ compra, total] =  await Promise.all([
        Compra.find({ "socio":{
            "_id": socio, 
        }})
        .sort({_id: -1})   
        .skip( desde )
        .limit( 5 )
        .populate('socio'),
        Compra.countDocuments({ "socio":{
            "_id": socio, 
        }})
    ]);
        res.json({
        ok: true,
        total,
        compra,
    });


    // Compra.find({}, ' -_id  dni nombre celular precio cantidad total sede created')


    // Compra.find({ "socio":{
    //     "_id": socio, 
    // }},
    // function (err, result) {
    // if (err){
    //     res.status(400).send({data: { message: err }});
    //     return;
    // }
    // else if(result)
    // {
    //     res.status(200).send({data: { message: result }});
    // }
    // })
})



//Obetner 10 precios
compraRoutes.get('/10', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    console.log(desde);

    const [ compras, total] =  await Promise.all([
                                    Compra.find({})
                                    .sort({_id: -1})          
                                    .skip( desde )
                                    .limit( 80 ),
                                    Compra.countDocuments()
    ]);
    res.json({
        ok: true,
        compras,
        total,
        id: req.id 
    });
});





//Obetner Servicios x2
compraRoutes.get('/obtener', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    const [ compra, total] =  await Promise.all([
                                    Compra.find()
                                    .sort({_id: -1})          
                                    .populate('socio', 'nombre celular email dni avatar')
                                    .skip( desde )
                                    .limit( 5 ),
                                    Compra.countDocuments()
    ]);
    res.json({
        ok: true,
        compra,
        total,
        id: req.id 
    });
});


// Crear una  solicitud en la seccion SERVICIOS
compraRoutes.post('/',  [verificaTokenSocio] , (req: any, res: Response) => {
    const body = req.body
    body.socio = req.socio._id;
    Compra.create(body).then(async compraDB => {
        await compraDB.populate('socio').execPopulate();
        res.json({
            ok: true,
            compras: compraDB
        });

    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    })
});


// Actualizar Servicio Recojo de Cacao
compraRoutes.post('/update/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const compra = {
        estado: req.body.estado,
        calificacion: req.body.calificacion,
    }
    Compra.findByIdAndUpdate(id, compra, {new: true}, (err, compra) => {
        if(err) throw err;
        if(!compra){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true,
            
        });compra
    })
});



// Borrar Servicio Recojo de cacao
compraRoutes.delete('/:id',    (req: any, res: Response) => {
    const id = req.params.id;
    Compra.findByIdAndRemove(id, (err, compras ) => {
        if(err) throw err;
        res.json({
            ok: true,
            mensaje: 'Compra Eliminada',
            body: compras
        })
    }); 
});


// Actualizar compras
compraRoutes.post('/updatecompra/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const compra = {
        nombre: req.body.nombre,
        dni: req.body.dni,
        email: req.body.email,
        celular: req.body.celular,
        precio: req.body.precio,
        cantidad: req.body.cantidad,
        total: req.body.total,
        farmerid: req.body.farmerid,
        estado: req.body.estado
    }
    Compra.findByIdAndUpdate(id, compra, {new: true}, (err, compra) => {
        if(err) throw err;
        if(!compra){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true,
            
        });compra
    })
});


//Obetner Usuarios TODOS
compraRoutes.get('/exportar', async (req: any, res: any) => {
    const [ compra, total] =  await Promise.all([
                                    Compra.find({}, ' -_id  dni nombre celular precio cantidad total sede created')
                                    .sort({_id: -1})    
    ]);
    res.json({
        ok: true,
        compra,
    });
});


export default compraRoutes;


