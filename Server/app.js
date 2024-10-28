const dotEnv = require("dotenv");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { request, response } = require("express");
const cors = require("cors");
const logger = require("morgan");
const app = express();
const prism = new PrismaClient();
//---Archivos de rutas---
const datosRoutes = require('./routes/datosRoutes'); 
const rcasaRoutes = require('./routes/rcasaRoutes'); 
const ftthRoutes = require('./routes/ftthRoutes'); 
const oltRoutes = require('./routes/oltRoutes'); 
const servicesRoutes = require('./routes/servicesRoutes'); 
const ontRoutes = require('./routes/ontRoutes'); 
const dnsRoutes = require('./routes/dnsRoutes'); 
const iptvRoutes = require('./routes/iptvRoutes'); 


// Acceder a la configuracion del archivo .env
dotEnv.config();
// Puero que escucha por defecto 300 o definido .env
const port = process.env.PORT || 3000;
// Middleware CORS para aceptar llamadas en el servidor
app.use(cors());
// Middleware para loggear las llamadas al servidor
app.use(logger("dev"));
// Middleware para gestionar Requests y Response json
app.use(express.json());
app.use(
express.urlencoded({
extended: true,
})
);
//---- Definir rutas ----
app.use("/datos/", datosRoutes); 
app.use("/rcasa/", rcasaRoutes); 
app.use("/ftth/", ftthRoutes); 
app.use("/olt/", oltRoutes); 
app.use("/service/", servicesRoutes); 
app.use("/ont/", ontRoutes); 
app.use("/dns/", dnsRoutes); 
app.use("/iptv/", iptvRoutes); 


// Servidor
app.listen(port, () => { 
console.log(`http://localhost:${port}`);
console.log("Presione CTRL-C para deternerlo\n");
});