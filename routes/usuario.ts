import { Router, Request, Response, response } from "express";
import { Usuario } from '../models/usuario.model';
import  bcrypt  from 'bcrypt';
import Token from "../classes/token";
import TokenQR from "../classes/tokenQR";
import { verificaToken } from "../middlewares/autenticacion";
import  nodemailer  from "nodemailer";
const userRoutes = Router();

const cloudinary = require('cloudinary').v2
cloudinary.config({ 
    cloud_name: 'amazonastrading', 
    api_key: '921375412961546',
    api_secret: 'mm8GUA4-e2Ck1g6XdJWq5oKjsWc'
});


//login
userRoutes.post('/login', (req: Request, res: Response) => {
    const body = req.body;
    Usuario.findOne({dni:body.dni} , (err, userDB) => {
        if( err ) throw err;

        if( !userDB ) {
            return res.json({
                ok: false,
                mensaje: 'Usuario / contraseña no son correctos'
            });
        }
        if( userDB.compararPassword(body.password)) {
            const tokenUser = Token.getJwtToken({
                _id: userDB._id, 
                nombre: userDB.nombre,
                dni: userDB.dni,
                avatar: userDB.avatar,
                email: userDB.email,
                celular: userDB.celular,
                ubicacion: userDB.ubicacion,
                departamento: userDB.departamento,
                provincia: userDB.provincia,
                region: userDB.region,
                farmerid: userDB.farmerid,
                sede: userDB.sede,
                password: req.body.password,
                password_show: req.body.password_show,
                photo: userDB.photo
                
            });
            res.json({
                ok: true,
                token: tokenUser
            });
        } else {
            return res.json({
                ok: false,
                mensaje: 'Usuario / contraseña no son correctos ****'
            });
        }
    });
});


userRoutes.post('/qr', (req: Request, res: Response) => {
    const body = req.body;
    Usuario.findOne({dni:body.dni} , (err, userDB) => {
        if( err ) throw err;

        if( !userDB ) {
            return res.json({
                ok: false,
                mensaje: 'Usuario / contraseña no son correctos'
            });
        }
        if( userDB.compararPassword(body.password)) {
            const tokenUser = TokenQR.getJwtTokenQR({
                _id: userDB._id, 
                nombre: userDB.nombre,
                dni: userDB.dni,
                avatar: userDB.avatar,
                email: userDB.email,
                celular: userDB.celular,
                ubicacion: userDB.ubicacion,
                departamento: userDB.departamento,
                provincia: userDB.provincia,
                region: userDB.region,

                password: req.body.password,
                password_show: req.body.password_show,
                
            });
            res.json({
                ok: true,
                token: tokenUser
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
userRoutes.post('/create',(req: Request, res: Response) => {
    const user = {
        nombre: req.body.nombre,
        dni: req.body.dni,
        password_show:  req.body.password_show,
        password: bcrypt.hashSync(req.body.password_show, 10),
        avatar: req.body.avatar,
        email: req.body.email,
        celular: req.body.celular,
        sede: req.body.sede,
        farmerid: req.body.farmerid,
    };

    Usuario.create( user ).then( userDB => {
        const tokenUser = Token.getJwtToken({
            _id: userDB._id, 
            nombre: userDB.nombre,
            dni: userDB.dni,
            avatar: userDB.avatar,
            email: userDB.email,
            celular: userDB.celular,
            farmerid: userDB.farmerid,
            sede: userDB.sede,
        });
        res.json({
            ok: true,
            token: tokenUser,
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
            to: user.email,
            subject: "BIENVENIDA QHATU CACAO APP",
            html: `<html><head><title>QHATU CACAO APP 2021</title></head><body><table style='max-width: 600px; padding: 10px; margin:0 auto; border-collapse: collapse;'><tr><td style='padding: 0'><center><img style='padding: 0; display: block; margin-bottom: -10px' src='https://amazonastrading.com.pe/recursos/resources/images/icono-app.png' width='20%'> <br> <br> </center></td></tr><tr><td style='background-color: #ecf0f1'><div style='color: #34495e; margin: 4% 10% 2%; text-align: justify;font-family: sans-serif'><h2 style='color: #e67e22; margin: 0 0 7px'>HOLA ${user.nombre} tus datos fueron actualizados.</h2><p style='margin: 2px; font-size: 15px'> Tus accesos para la plataforma móvil son: </p><ul style='font-size: 15px; margin: 10px 0'>  <br>  <li>DNI: ${user.dni} </li> <li>CLAVE:  ${user.password_show} </li></ul> <br><div style='width: 100%; text-align: center'> <a href='https://play.google.com/store/apps/details?id=com.amazonastrading.app' target='_blank'> <img src='https://amazonastrading.com.pe/recursos/resources/images/disponible-en-google-play-badge.png'  width='30%'> </a></div><p style='color: #b3b3b3; font-size: 12px; text-align: center;margin: 30px 0 0'>Amazonas Trading Perú SAC</p></div></td></tr></table></body></html>`
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



//recuperar 
userRoutes.post('/recuperar',  (req: any, res: Response ) => {
    const body = {
        dni: req.body.dni,
        nombre: req.body.nombre,
        userId: req.body.userId,
    }

    Usuario.create(body).then(userDB => {
        res.json ({
            ok:true,
            usuario: userDB
        });
    }).catch( err => {
        res.json(err)
    });
});


//actualizar usuario
userRoutes.post('/update', verificaToken , (req: any, res: Response) => {

    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        dni: req.body.dni || req.usuario.dni,
        avatar: req.body.avatar || req.usuario.avatar,
        email: req.body.email || req.usuario.email,
        celular: req.body.celular || req.usuario.celular,
        ubicacion: req.body.ubicacion || req.usuario.ubicacion,
        departamento: req.body.departamento || req.usuario.departamento,
        provincia: req.body.provincia || req.usuario.provincia,
        region: req.body.region || req.usuario.region,
        photo: req.body.photo || req.usuario.photo,
    }

    Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true}, (err, userDB) => {
        if(err) throw err;

        if(!userDB){
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID'
            });
        }
        const tokenUser = Token.getJwtToken({
            _id: userDB._id, 
            nombre: userDB.nombre,
            dni: userDB.dni,
            avatar: userDB.avatar,
            email: userDB.email,
            celular: userDB.celular,
            ubicacion: userDB.ubicacion,
            departamento: userDB.departamento,
            provincia: userDB.provincia,
            region: userDB.region,
            photo: userDB.photo,

        });
        res.json({
            ok: true,
            token: tokenUser
        });
    });
});



//actualizar push 
userRoutes.post('/updatepush', verificaToken , (req: any, res: Response) => {
    const user = {
        push: req.body.push || req.usuario.push,
    }
    Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true}, (err, userDB) => {
        if(err) throw err;

        if(!userDB){
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID'
            });
        }
        const tokenUser = Token.getJwtToken({
            push: userDB.push,
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    });

});






//actualizar usuario
userRoutes.post('/updatepass', verificaToken , (req: any, res: Response) => {
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        dni: req.body.dni || req.usuario.dni,
        avatar: req.body.avatar || req.usuario.avatar,
        email: req.body.email || req.usuario.email,
        celular: req.body.celular || req.usuario.celular,
        ubicacion: req.body.ubicacion || req.usuario.ubicacion,
        departamento: req.body.departamento || req.usuario.departamento,
        provincia: req.body.provincia || req.usuario.provincia,
        region: req.body.region || req.usuario.region,
        farmerid: req.body.farmerid || req.usuario.farmerid,

        password_show:  req.body.password_show,
        password: bcrypt.hashSync(req.body.password_show, 10),
    }
    Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true}, (err, userDB) => {
        if(err) throw err;

        if(!userDB){
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID'
            });
        }
        const tokenUser = Token.getJwtToken({
            _id: userDB._id, 
            nombre: userDB.nombre,
            dni: userDB.dni,
            avatar: userDB.avatar,
            password: userDB.password,
            password_show: userDB.password_show,
            email: userDB.email,
            celular: userDB.celular,
            ubicacion: userDB.ubicacion,
            departamento: userDB.departamento,
            provincia: userDB.provincia,
            region: userDB.region,
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
            to: user.email,
            subject: "ACTUALIZACION DE CONTRASEÑA QHATU CACAO APP",
            html: `<html><head><title>QHATU CACAO APP 2021</title></head><body><table style='max-width: 600px; padding: 10px; margin:0 auto; border-collapse: collapse;'><tr><td style='padding: 0'><center><img style='padding: 0; display: block; margin-bottom: -10px' src='https://amazonastrading.com.pe/recursos/resources/images/icono-app.png' width='20%'> <br> <br> </center></td></tr><tr><td style='background-color: #ecf0f1'><div style='color: #34495e; margin: 4% 10% 2%; text-align: justify;font-family: sans-serif'><h2 style='color: #e67e22; margin: 0 0 7px'>HOLA ${user.nombre} tu cambio de contraseña fue un exito.</h2><p style='margin: 2px; font-size: 15px'> Tus accesos para la plataforma móvil son: </p><ul style='font-size: 15px; margin: 10px 0'>  <br>  <li>DNI: ${user.dni} </li> <li>CLAVE:  ${user.password_show} </li></ul> <br><div style='width: 100%; text-align: center'> <a href='https://play.google.com/store/apps/details?id=com.amazonastrading.app' target='_blank'> <img src='https://amazonastrading.com.pe/recursos/resources/images/disponible-en-google-play-badge.png'  width='30%'> </a></div><p style='color: #b3b3b3; font-size: 12px; text-align: center;margin: 30px 0 0'>Amazonas Trading Perú SAC</p></div></td></tr></table></body></html>`
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
            token: tokenUser
        });
    });
});





//Actualizar Contraseña del Usuario Seleccionado
userRoutes.post('/update_pass/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const usuario = {
        nombre: req.body.nombre || req.usuario.nombre,
        dni: req.body.dni || req.usuario.dni,
        email: req.body.email || req.usuario.email,

        password_show:  req.body.password_show,
        password: bcrypt.hashSync(req.body.password_show, 10),
    }
    Usuario.findByIdAndUpdate(id, usuario, {new: true}, (err, usuario) => {
        if(err) throw err;
        if(!usuario){
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
            to: usuario.email,
            subject: "ACCESOS QHATU CACAO APP - IMPORTANTE",
            html: `<html><head><title>QHATU CACAO APP 2021</title></head><body><table style='max-width: 600px; padding: 10px; margin:0 auto; border-collapse: collapse;'><tr><td style='padding: 0'><center><img style='padding: 0; display: block; margin-bottom: -10px' src='https://amazonastrading.com.pe/recursos/resources/images/icono-app.png' width='20%'> <br> <br> </center></td></tr><tr><td style='background-color: #ecf0f1'><div style='color: #34495e; margin: 4% 10% 2%; text-align: justify;font-family: sans-serif'><h2 style='color: #e67e22; margin: 0 0 7px'>HOLA ${usuario.nombre} tu cambio de contraseña fue un exito.</h2><p style='margin: 2px; font-size: 15px'> Tus accesos para la plataforma móvil son: </p><ul style='font-size: 15px; margin: 10px 0'>  <br>  <li>DNI: ${usuario.dni} </li> <li>CLAVE:  ${usuario.password_show} </li></ul> <br><div style='width: 100%; text-align: center'> <a href='https://play.google.com/store/apps/details?id=com.amazonastrading.app' target='_blank'> <img src='https://amazonastrading.com.pe/recursos/resources/images/disponible-en-google-play-badge.png'  width='30%'> </a></div><p style='color: #b3b3b3; font-size: 12px; text-align: center;margin: 30px 0 0'>Amazonas Trading Perú SAC</p></div></td></tr></table></body></html>`
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
            usuario
            
        });usuario
    })
});








//Actualizar Farmer ID del Usuario Seleccionado
userRoutes.post('/update_farmerid/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const usuario = {
        nombre: req.body.nombre || req.usuario.nombre,
        dni: req.body.dni || req.usuario.dni,
        email: req.body.email || req.usuario.email,
        sede: req.body.sede || req.usuario.sede,
        farmerid: req.body.farmerid ||  req.usuario.farmerid
    }
    Usuario.findByIdAndUpdate(id, usuario, {new: true}, (err, usuario) => {
        if(err) throw err;
        if(!usuario){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true,
            msg: 'Farmer ID actualizada correctamente',
            usuario
        });usuario
    })
});


userRoutes.get('/', [ verificaToken ], ( req: any, res: Response ) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    });
});

userRoutes.get('/', [verificaToken], (req: any, res: Response) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    });
});


//Obetner Usuarios x2
userRoutes.get('/obtener', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    console.log(desde);

    const [ usuario, total] =  await Promise.all([
                                    Usuario.find()
                                    .sort({_id: -1})          
                                    // .populate('usuario', 'nombre celular email dni avatar')
                                    .skip( desde )
                                    .limit( 10 ),
                                    Usuario.countDocuments()
    ]);
    res.json({
        ok: true,
        usuario,
        total,
        id: req.id 
    });
});


//Borrar 
userRoutes.delete('/:id',    (req: any, res: Response) => {
    const id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuario ) => {
        if(err) throw err;
        res.json({
            ok: true,
            mensaje: 'Usuario APP Eliminado',
            body: usuario
        })
    }); 
});


//Obetner Usuarios TODOS
userRoutes.get('/exportar', async (req: any, res: any) => {
    const [ usuario, total] =  await Promise.all([
                                    Usuario.find({}, ' -_id nombre email celular dni password password_show ubicacion departamento provincia region push farmerid avatar')
                                    .sort({_id: -1})    
    ]);
    res.json({
        ok: true,
        usuario,
    });
});


userRoutes.post('/send-email', (req, res) => {
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





// obtener el ultimo usuario
userRoutes.get('/ultimo', async (req: any, res: Response ) => {

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 1;

    const usuario = await  Usuario.find()
                                    .sort({_id: -1})
                                    .skip( skip )
                                    .limit(1)
                                    .exec();
    res.json ({
        ok:true,
        pagina,
        usuario
    });
    
});





userRoutes.post('/updatephoto', verificaToken , async   (req: any, res: Response) => {
    const { tempFilePath } =  req.files.photo;
    const resp = await cloudinary.uploader.upload(tempFilePath,{folder:"avatars"});
    console.log(resp.secure_url);

    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        dni: req.body.dni || req.usuario.dni,
        avatar: req.body.avatar || req.usuario.avatar,
        email: req.body.email || req.usuario.email,
        celular: req.body.celular || req.usuario.celular,
        ubicacion: req.body.ubicacion || req.usuario.ubicacion,
        departamento: req.body.departamento || req.usuario.departamento,
        provincia: req.body.provincia || req.usuario.provincia,
        region: req.body.region || req.usuario.region,
        sede: req.body.sede || req.usuario.sede,
        photo: resp.secure_url
    }


        Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true}, (err, userDB) => {
            if(err) throw err;

            if(!userDB){
                return res.json({
                    ok: false,
                    mensaje: 'No existe un usuario con ese ID'
                });
            }

        const tokenUser = Token.getJwtToken({
            _id: userDB._id, 
            nombre: userDB.nombre,
            dni: userDB.dni,
            avatar: userDB.avatar,
            email: userDB.email,
            celular: userDB.celular,
            ubicacion: userDB.ubicacion,
            departamento: userDB.departamento,
            provincia: userDB.provincia,
            region: userDB.region,
            sede: userDB.sede,
            photo: userDB.photo,
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    });
});


export default userRoutes;