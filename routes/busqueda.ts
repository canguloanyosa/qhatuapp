import { Router } from 'express';
const { validarJWT } = require('../middlewares/validar-jwt');
import { Tecnico } from "../models/tecnico.model";
import { Sede } from "../models/sede.model";
import { Admin } from '../models/admin.model';
import { Usuario } from "../models/usuario.model";
import { Socio } from '../models/socio.model';
import { Compra } from '../models/compra.model';
import { Servicio } from '../models/servicio.model';
import { Servicio2 } from '../models/servicio2.model';

const busquedaRouter = Router();

//Buscar Todo
busquedaRouter.get('/:busqueda', validarJWT, async (req: any, res: any) => {
    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i');
    const [ admin, sede, tecnico ] = await Promise.all([
        Admin.find({ nombre: regex }),
        Sede.find({ nombre: regex }),
        Tecnico.find({ nombre: regex })
    ])
    res.json({
        ok: true,
        admin,
        sede,
        tecnico
    })
});




//Buscar por coleccion
// busquedaRouter.get('/coleccion/:tabla/:busqueda', validarJWT, async (req: any, res: any) => {
busquedaRouter.get('/coleccion/:tabla/:busqueda',  async (req: any, res: any) => {


    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp("^" + busqueda.toLowerCase(), "i");

    // new RegExp('^'+ username + '$', "i")

    let data = [];

    switch (tabla) {
        case 'tecnico':
            data = await Tecnico.find({ nombre:regex })
                                                        .populate('usuario', 'nombre img')
                                                        .populate('sede', 'nombre img');
        break;

        case 'sede':
            data = await Sede.find({ nombre:regex })
                                                        .populate('usuario', 'nombre img');
        break;

        case 'admin':
            data = await Admin.find({ nombre:regex })
                                                        .populate('usuario', 'nombre img');
            
        break;


        case 'usuario':
            data = await Usuario.find({ nombre:regex })
                                                        .populate('usuario', 'nombre dni email celular');
        break;

        case 'usuariosede':
            data = await Usuario.find({ sede: regex })
                                                        .populate('usuario', 'nombre dni email celular');

        break;

        case 'dni':
            data = await Usuario.find({ dni:regex })
                                                        .populate('usuario', 'nombre dni email celular');
        break;

        case 'farmerid':
            data = await Usuario.find({ farmerid:regex })
                                                        .populate('usuario', 'nombre dni farmerid email celular');
        break;


        case 'email':
            data = await Usuario.find({ email:regex })
                                                        .populate('usuario', 'nombre dni email celular');
        break;


        case '_id':
            data = await Usuario.find({ _id:regex })
                                                        .populate('usuario', '_id nombre dni email celular');
        break;



        case 'compra':
            data = await Compra.find({ sede:regex })
                                                        .populate('socio', 'nombre dni email celular');              
        break;


        case 'compraEncargado':
            data = await Compra.find({ socio: regex })
                                                        .populate('socio', 'nombre dni email celular');              
        break;


        case 'servicio':
            data = await Servicio.find({ sede:regex })
                                                        .populate('usuario', 'avatar nombre dni email celular');                                        
        break;


        case 'servicio2':
            data = await Servicio2.find({ sede: regex })
                                                        .populate('usuario', 'nombre dni email celular');                                        
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

module.exports =  busquedaRouter;