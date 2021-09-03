import Server from "./classes/server";
import userRoutes from './routes/usuario';
import postRoutes from './routes/post';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import servicioRoutes from "./routes/servicio";
import precioRoutes from "./routes/precio";
import preciosedeRoutes from "./routes/preciosede";
import noticiaRoutes from "./routes/noticia";
import servicio2Routes from "./routes/servicio2";
import propiedadesRoutes from "./routes/propiedades";
import recuperarRoutes from "./routes/recuperar";
import express from 'express';
import versionRoutes from "./routes/version";
import socioRoutes from './routes/socio';
import compraRoutes from './routes/compra';
import photoRoutes from './routes/photo';

const server = new Server();
//configurar cors 
server.app.use(cors({origin:true, credentials:true}));
//body parser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());
//fileUpload
server.app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

//directorio Publico
server.app.use( express.static('public'));
    
//rutas de mi aplicacion
server.app.use('/socio', socioRoutes);
server.app.use('/user', userRoutes);
server.app.use('/posts', postRoutes);
server.app.use('/servicios', servicioRoutes);
server.app.use('/compras', compraRoutes);
server.app.use('/photo', photoRoutes);
server.app.use('/servicios2', servicio2Routes);
server.app.use('/precios', precioRoutes);
server.app.use('/preciosede', preciosedeRoutes);
server.app.use('/version', versionRoutes);
server.app.use('/noticia', noticiaRoutes);
server.app.use('/propiedades', propiedadesRoutes);
server.app.use('/recuperar', recuperarRoutes );
server.app.use('/admin', require('./routes/admin'));
server.app.use('/sede', require('./routes/sede'));
server.app.use('/tecnico', require('./routes/tecnico'));
server.app.use('/todo', require('./routes/busqueda'));
server.app.use('/todocompra', require('./routes/busquedacompra'));
server.app.use('/notificacion', require('./routes/notificacion'));


mongoose.set('useFindAndModify', false);
mongoose
    .connect('mongodb+srv://qhatuadmin:qhatuadmin@cluster0-hdwhu.mongodb.net/qhatuapp?retryWrites=true&w=majority', {
        useCreateIndex:true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
console.log('BD CONECTADAA');


//levantar express
server.start ( () => {
    console.log(`Servidor corriendo en el puerto ${ server.port }`);
});