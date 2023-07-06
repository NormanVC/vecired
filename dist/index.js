"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const servidor_1 = __importDefault(require("./clases/servidor"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const usuario_1 = __importDefault(require("./rutas/usuario"));
const avisos_1 = __importDefault(require("./rutas/avisos"));
const comunidad_1 = __importDefault(require("./rutas/comunidad"));
const acuerdos_1 = __importDefault(require("./rutas/acuerdos"));
const solicitud_1 = __importDefault(require("./rutas/solicitud"));
const certificado_1 = __importDefault(require("./rutas/certificado"));
const emisor_1 = __importDefault(require("./rutas/emisor"));
const publicacion_1 = __importDefault(require("./rutas/publicacion"));
const servidor = new servidor_1.default();
servidor.app.use(express_1.default.urlencoded({ extended: true }));
servidor.app.use(express_1.default.json());
//configuracion para obtener los archivos que subimos 
servidor.app.use((0, express_fileupload_1.default)({
// useTempFiles : true,
//tempFileDir : '/tmp/'
}));
//Configuración de CORS para que el servidor no bloquee peticiones hTTp de origin !=
servidor.app.use((0, cors_1.default)({ origin: true, credentials: true }));
//rutas de la aplicacion
servidor.app.use('/usuario', usuario_1.default);
servidor.app.use('/avisos', avisos_1.default);
servidor.app.use('/comunidad', comunidad_1.default);
servidor.app.use('/acuerdos', acuerdos_1.default);
servidor.app.use('/solicitud', solicitud_1.default);
servidor.app.use('/certificados', certificado_1.default);
servidor.app.use('/emisor', emisor_1.default);
servidor.app.use('/publicacion', publicacion_1.default);
//conexion a base de datos de verdad
mongoose_1.default.connect('mongodb+srv://normanvergara1901:kOc5Gp0Gb7dhzlmu@vecired.l8aedga.mongodb.net/', (err) => {
    if (err)
        throw err;
    console.log("Conectado exitosamente a BD1");
});
//conecion a base de dato local
// mongoose.connect('mongodb://localhost:27017/veciRed',
//                 (err) => 
//                 {
//                     if(err) throw err;
//                     console.log("Conectado exitosamente a BD1");
//                 })
// main().catch(err => console.log(err));
// async function main() {
//     await mongoose.connect('mongodb://localhost:27017/veciRed').then( () =>
//      {console.log("Conectado exitosamente a BD")})
//   }
//levantamos el servidor
servidor.start(() => {
    console.log(`Servidor operativo en puerto ${servidor.port} `);
});
