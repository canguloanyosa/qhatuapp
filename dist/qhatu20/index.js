"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const post_1 = __importDefault(require("./routes/post"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const servicio_1 = __importDefault(require("./routes/servicio"));
const precio_1 = __importDefault(require("./routes/precio"));
const noticia_1 = __importDefault(require("./routes/noticia"));
const servicio2_1 = __importDefault(require("./routes/servicio2"));
const propiedades_1 = __importDefault(require("./routes/propiedades"));
const server = new server_1.default();
// const mongoose = require("mongoose");
//configurar cors 
server.app.use(cors_1.default({ origin: true, credentials: true }));
//body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//FileUpload
server.app.use(express_fileupload_1.default());
//rutas de mi aplicacion
server.app.use('/user', usuario_1.default);
server.app.use('/posts', post_1.default);
server.app.use('/servicios', servicio_1.default);
server.app.use('/servicios2', servicio2_1.default);
server.app.use('/precios', precio_1.default);
server.app.use('/noticia', noticia_1.default);
server.app.use('/propiedades', propiedades_1.default);
// server.app.use('/preciosnacional', servicioRoutes);
// conectra DB
// mongoose.connect('mongodb://localhost:27017/amazonasapp',
//                 { useNewUrlParser: true, useCreateIndex: true }, ( err ) => {
//                 if(err) throw err;
//                 console.log('Base de datos QhatuAPP - ONLINE @LaimeDev | www.laimedev.com')
// });
// mongoose.set('useFindAndModify', false);
// mongoose
//     .connect('mongodb+srv://alaimes64:alaimes64@cluster0-4c089.mongodb.net/test?retryWrites=true&w=majority', {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     });
//     console.log('BD CONECTADA');
mongoose_1.default.set('useFindAndModify', false);
mongoose_1.default
    .connect('mongodb+srv://qhatuadmin:qhatuadmin@cluster0-hdwhu.mongodb.net/qhatuapp?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
console.log('BD CONECTADA');
//levantar express
server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`);
});
