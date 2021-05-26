import { Router, Request, Response, response } from "express";
import { Socio } from "../models/socio.model";
import  bcrypt  from 'bcrypt';
import TokenSocio from "../classes/tokenSocio";
import { verificaTokenSocio } from "../middlewares/autenticationSocio";

import  nodemailer  from "nodemailer";

const socioRoutes = Router();


const { googleVerify } = require('../helpers/google-verify');
const { generarJWT } = require ('../helpers/jwt'); 




//login
socioRoutes.post('/login', (req: Request, res: Response) => {
    const body = req.body;
    Socio.findOne({dni:body.dni} , (err, socioDB) => {
        if( err ) throw err;

        if( !socioDB ) {
            return res.json({
                ok: false,
                mensaje: 'Usuario socio / contraseña no son correctos'
            });
        }
        if( socioDB.compararPassword(body.password)) {
            const tokenSocio = TokenSocio.getJwtToken({
                _id: socioDB._id, 
                nombre: socioDB.nombre,
                dni: socioDB.dni,
                avatar: socioDB.avatar,
                email: socioDB.email,
                celular: socioDB.celular,
                ubicacion: socioDB.ubicacion,
                departamento: socioDB.departamento,
                provincia: socioDB.provincia,
                region: socioDB.region,

                password: req.body.password,
                password_show: req.body.password_show,
                
            });
            res.json({
                ok: true,
                tokenSocio: tokenSocio
            });
        } else {
            return res.json({
                ok: false,
                mensaje: 'Usuario / contraseña no son correctos ****'
            });
        }
    });
});







//crear usuario
socioRoutes.post('/create',(req: Request, res: Response) => {


    
    const socio = {
        nombre: req.body.nombre,
        dni: req.body.dni,
        password_show:  req.body.password_show,
        password: bcrypt.hashSync(req.body.password_show, 10),
        avatar: req.body.avatar,
        email: req.body.email,
        celular: req.body.celular,
        ubicacion: req.body.ubicacion,
        departamento: req.body.departamento,
        provincia: req.body.provincia,
        region: req.body.region,

        

    };

   

    Socio.create( socio ).then( socioDB => {


        const tokenSocio = TokenSocio.getJwtToken({
            _id: socioDB._id, 
            nombre: socioDB.nombre,
            dni: socioDB.dni,
            avatar: socioDB.avatar,
            email: socioDB.email,
            celular: socioDB.celular,
            ubicacion: socioDB.ubicacion,
            departamento: socioDB.departamento,
            provincia: socioDB.provincia,
            region: socioDB.region,
        });
        res.json({
            ok: true,
            tokenSocio: tokenSocio,
        });

        var transporter = nodemailer.createTransport({

            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "qhatucacao@gmail.com",
                pass: "@D3v@tP*"
            }
        });
    
        var mailOptions = {
            from: "qhatucacao@gmail.com",
            to: socio.email,
            subject: "BIENVENIDA QHATU PARTER APP",
            html: `<html><head><title>QHATU CACAO APP 2020</title></head><body><table style='max-width: 600px; padding: 10px; margin:0 auto; border-collapse: collapse;'><tr><td style='padding: 0'><center><img style='padding: 0; display: block; margin-bottom: -10px' src='https://admin.amazonastrading.com.pe/resources/images/icono-app.png' width='20%'> <br> <br> </center></td></tr><tr><td style='background-color: #ecf0f1'><div style='color: #34495e; margin: 4% 10% 2%; text-align: justify;font-family: sans-serif'><h2 style='color: #e67e22; margin: 0 0 7px'>BIENVENIDO ${socio.nombre} tu registro fue un exito.</h2><p style='margin: 2px; font-size: 15px'> Tus accesos para la plataforma móvil son: </p><ul style='font-size: 15px; margin: 10px 0'>  <br>  <li>DNI: ${socio.dni} </li> <li>CLAVE:  ${socio.password_show} </li></ul> <br><div style='width: 100%; text-align: center'> <a href='https://play.google.com/store/apps/details?id=com.amazonastrading.app' target='_blank'> <img src='https://admin.amazonastrading.com.pe/resources/images/disponible-en-google-play-badge.png'  width='30%'> </a></div><p style='color: #b3b3b3; font-size: 12px; text-align: center;margin: 30px 0 0'>Amazonas Trading Perú SAC</p></div></td></tr></table></body></html>`
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
                res.status(500).send(error.message);
            } else {
                res.json({
                    ok: true,
                    msg: 'Email enviado'
                });
                console.log("Email enviado");
            }
        });

    }).catch(err =>  {
        res.json({
            ok: false,
            err
        });
    });  
});



//crear precios 
socioRoutes.post('/recuperar',  (req: any, res: Response ) => {

    const body = {
        _id: req.body._id,
        dni: req.body.dni,
        nombre: req.body.nombre,
        userId: req.body.userId,
    }

    Socio.create(body).then(socioDB => {
        res.json ({
            ok:true,
            socio: socioDB
        });
    }).catch( err => {
        res.json(err)
    });
});








//actualizar push 
socioRoutes.post('/updatepush', verificaTokenSocio , (req: any, res: Response) => {

    const socio = {
        push: req.body.push || req.socio.push,
    }

    Socio.findByIdAndUpdate(req.socio._id, socio, { new: true}, (err, socioDB) => {
        if(err) throw err;

        if(!socioDB){
            return res.json({
                ok: false,
                mensaje: 'No existe un socio con ese ID'
            });
        }
        const tokenSocio = TokenSocio.getJwtToken({
            push: socioDB.push,
        });

        res.json({
            ok: true,
            token: tokenSocio
        });
    });

});








//actualizar usuario
socioRoutes.post('/update', verificaTokenSocio , (req: any, res: Response) => {

    const socio = {
        nombre: req.body.nombre || req.socio.nombre,
        dni: req.body.dni || req.socio.dni,
        avatar: req.body.avatar || req.socio.avatar,
        email: req.body.email || req.socio.email,
        celular: req.body.celular || req.socio.celular,
        // ubicacion: req.body.ubicacion || req.socio.ubicacion,
        // departamento: req.body.departamento || req.socio.departamento,
        // provincia: req.body.provincia || req.socio.provincia,
        // region: req.body.region || req.socio.region,

        // password_show:  req.body.password_show,
        // password: bcrypt.hashSync(req.body.password_show, 10),
  
    }


    Socio.findByIdAndUpdate(req.socio._id, socio, { new: true}, (err, socioDB) => {
        if(err) throw err;

        if(!socioDB){
            return res.json({
                ok: false,
                mensaje: 'No existe un partner con ese ID'
            });
        }
        const tokenSocio = TokenSocio.getJwtToken({
            _id: socioDB._id, 
            nombre: socioDB.nombre,
            dni: socioDB.dni,
            avatar: socioDB.avatar,

            // password: userDB.password,
            // password_show: userDB.password_show,

            email: socioDB.email,
            celular: socioDB.celular,
            // ubicacion: socioDB.ubicacion,
            // departamento: socioDB.departamento,
            // provincia: socioDB.provincia,
            // region: socioDB.region,
        });
        res.json({
            ok: true,
            tokenSocio: tokenSocio
        });
    });
});






//actualizar usuario
socioRoutes.post('/updatepass', verificaTokenSocio , (req: any, res: Response) => {
    const socio = {
        nombre: req.body.nombre || req.socio.nombre,
        dni: req.body.dni || req.socio.dni,
        avatar: req.body.avatar || req.socio.avatar,
        email: req.body.email || req.socio.email,
        celular: req.body.celular || req.socio.celular,
        // ubicacion: req.body.ubicacion || req.socio.ubicacion,
        // departamento: req.body.departamento || req.socio.departamento,
        // provincia: req.body.provincia || req.socio.provincia,
        // region: req.body.region || req.socio.region,

        password_show:  req.body.password_show,
        password: bcrypt.hashSync(req.body.password_show, 10),
    }
    Socio.findByIdAndUpdate(req.socio._id, socio, { new: true}, (err, socioDB) => {
        if(err) throw err;

        if(!socioDB){
            return res.json({
                ok: false,
                mensaje: 'No existe un socio con ese ID'
            });
        }
        const tokenSocio = TokenSocio.getJwtToken({
            _id: socioDB._id, 
            nombre: socioDB.nombre,
            dni: socioDB.dni,
            avatar: socioDB.avatar,
            password: socioDB.password,
            password_show: socioDB.password_show,
            email: socioDB.email,
            celular: socioDB.celular,
            // ubicacion: socioDB.ubicacion,
            // departamento: socioDB.departamento,
            // provincia: socioDB.provincia,
            // region: socioDB.region,
        });




        var transporter = nodemailer.createTransport({

            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "qhatucacao@gmail.com",
                pass: "@D3v@tP*"
            }
        });
    
        var mailOptions = {
            from: "qhatucacao@gmail.com",
            to: socio.email,
            subject: "ACTUALIZACION DE CONTRASEÑA QHATU PARTNER APP",
            html: `<html><head><title>QHATU PARTNER APP 2020</title></head><body><table style='max-width: 600px; padding: 10px; margin:0 auto; border-collapse: collapse;'><tr><td style='padding: 0'><center><img style='padding: 0; display: block; margin-bottom: -10px' src='https://admin.amazonastrading.com.pe/resources/images/icono-app.png' width='20%'> <br> <br> </center></td></tr><tr><td style='background-color: #ecf0f1'><div style='color: #34495e; margin: 4% 10% 2%; text-align: justify;font-family: sans-serif'><h2 style='color: #e67e22; margin: 0 0 7px'>HOLA ${socio.nombre} tu cambio de contraseña fue un exito.</h2><p style='margin: 2px; font-size: 15px'> Tus accesos para la plataforma móvil son: </p><ul style='font-size: 15px; margin: 10px 0'>  <br>  <li>DNI: ${socio.dni} </li> <li>CLAVE:  ${socio.password_show} </li></ul> <br><div style='width: 100%; text-align: center'> <a href='https://play.google.com/store/apps/details?id=com.amazonastrading.app' target='_blank'> <img src='https://admin.amazonastrading.com.pe/resources/images/disponible-en-google-play-badge.png'  width='30%'> </a></div><p style='color: #b3b3b3; font-size: 12px; text-align: center;margin: 30px 0 0'>Amazonas Trading Perú SAC</p></div></td></tr></table></body></html>`
        }
    
    
    
        transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
                res.status(500).send(error.message);
            } else {
                res.json({
                    ok: true,
                    msg: 'Email enviado'
                });
    
                console.log("Email enviado");
            }
        });


        res.json({
            ok: true,
            tokenSocio: tokenSocio
        });
    });
});





//Actualizar Contraseña del Socio Seleccionado
socioRoutes.post('/update_pass/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const socio = {
        nombre: req.body.nombre || req.socio.nombre,
        dni: req.body.dni || req.socio.dni,
        email: req.body.email || req.socio.email,

        password_show:  req.body.password_show,
        password: bcrypt.hashSync(req.body.password_show, 10),
    }
    Socio.findByIdAndUpdate(id, socio, {new: true}, (err, socio) => {
        if(err) throw err;
        if(!socio){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }


        var transporter = nodemailer.createTransport({

            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "qhatucacao@gmail.com",
                pass: "@D3v@tP*"
            }
        });
    
        var mailOptions = {
            from: "qhatucacao@gmail.com",
            to: socio.email,
            subject: "ACCESOS QHATU PARTNER APP - IMPORTANTE",
            html: `<html><head><title>DINDON APP</title></head><body><table style='max-width: 600px; padding: 10px; margin:0 auto; border-collapse: collapse;'><tr><td style='padding: 0'><center><img style='padding: 0; display: block; margin-bottom: -10px' src='https://deliverydindon.com/assets/img/landing/mapa.png' width='20%'> <br> <br> </center></td></tr><tr><td style='background-color: #ecf0f1'><div style='color: #34495e; margin: 4% 10% 2%; text-align: justify;font-family: sans-serif'><h2 style='color: #e67e22; margin: 0 0 7px'>BIENVENIDO Chamo, tu registro fue un exito.</h2><p style='margin: 2px; font-size: 15px'> Tus accesos son los siguientes: </p><ul style='font-size: 15px; margin: 10px 0'>  <br>  <li>USUARIO: dindon@gmail.com </li> <li>CLAVE:  *&$#*_% </li></ul> <br><div style='width: 100%; text-align: center'> <a href='https://play.google.com/store/apps/details?id=com.amazonastrading.app' target='_blank'> <img src='https://admin.amazonastrading.com.pe/resources/images/disponible-en-google-play-badge.png'  width='30%'> </a></div><p style='color: #b3b3b3; font-size: 12px; text-align: center;margin: 30px 0 0'>Amazonas Trading Perú SAC</p></div></td></tr></table></body></html>`
        }
    
    
    
        transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
                res.status(500).send(error.message);
            } else {
                res.json({
                    ok: true,
                    msg: 'Email enviado'
                });
    
                console.log("Email enviado");
            }
        });



        res.json({
            ok: true,
            msg: 'Contraseña actualizada correctamente',
            socio
            
        });
    })
});












socioRoutes.get('/', [ verificaTokenSocio ], ( req: any, res: Response ) => {
    const socio = req.socio;
    res.json({
        ok: true,
        socio
    });
});


socioRoutes.get('/', [verificaTokenSocio], (req: any, res: Response) => {
    const socio = req.socio;
    res.json({
        ok: true,
        socio
    });
});




//Obetner Socio x2
socioRoutes.get('/obtener', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    console.log(desde);

    const [ socio, total] =  await Promise.all([
                                    Socio.find()
                                    .sort({_id: -1})          
                                    // .populate('usuario', 'nombre celular email dni avatar')
                                    .skip( desde )
                                    .limit( 10 ),
                                    Socio.countDocuments()
    ]);
    res.json({
        ok: true,
        socio,
        total,
        id: req.id 
    });
});








//Borrar 
socioRoutes.delete('/:id',    (req: any, res: Response) => {
    const id = req.params.id;

    Socio.findByIdAndRemove(id, (err, socio ) => {
        if(err) throw err;

        res.json({
            ok: true,
            mensaje: 'Socio APP Eliminado',
            body: socio
        })
    }); 
});








//Obetner Usuarios TODOS
socioRoutes.get('/exportar', async (req: any, res: any) => {
    const [ socio, total] =  await Promise.all([
                                    Socio.find({}, ' -_id nombre email celular dni password_show')
                                    .sort({_id: -1})    
    ]);
    res.json({
        ok: true,
        socio,
    });
});



socioRoutes.post('/send-email', (req, res) => {
    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "qhatucacao@gmail.com",
            pass: "@D3v@tP*"
        }
    });
    var mailOptions = {
        from: "qhatucacao@gmail.com",
        to: "alaimes64@gmail.com",
        subject: "Enviado desde nodemailer XX",
        text: "Hola alex laime como haz estado causita, nos metemos una peli de hackers :x",
        html: "<p style='background: green; color: red;'>HTML version of the message</p> <br> <br> <h1>Hoooola </h1>"
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            res.status(500).send(error.message);
        } else {
            res.json({
                ok: true,
                msg: 'Email enviado'
            });

            console.log("Email enviado");
        }
    });
});




export default socioRoutes;