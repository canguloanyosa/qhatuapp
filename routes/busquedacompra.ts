import { Router, Response, Request, response } from 'express';
import { check, validationResult } from 'express-validator';
import { Compra } from '../models/compra.model';
import { Socio } from '../models/socio.model';

const { validarJWT } = require('../middlewares/validar-jwt');


const busquedaCompraRouter = Router();





busquedaCompraRouter.get('/coleccion/:tabla/:busquedacompra',  async (req: any, res: any) => {


    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    // const regex = new RegExp( busqueda, 'i');
    const regex = new RegExp( busqueda);


    let data = [];


    switch (tabla) {
        




        case 'compra':
            data = await Compra.find({ dni: regex })
                                                     .populate('compra', 'nombre dni celular')
                                                     .populate('socio', 'nombre dni email celular');              
                                        
        break;



        case 'socio':
            data = await Socio.find({ nombre: regex })
                                                        .populate('socio', 'nombre dni email celular')
                                                        .populate('compra', 'nombre dni celular');              
                                        
        break;

        default:
            return res.status(400).json({
                ok:false,
                msg: 'La coleccion tiene que ser admin/sede/tecnico/usuario'

            })        
    }
    res.json({
        ok: true,
        resultados: data
    }) 
});







module.exports =  busquedaCompraRouter;