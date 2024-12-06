const express = require("express");
const router = express.Router();

const datos = require("../controllers/servicesController"); 

router.get("/", datos.getTipoCliente); 

router.post("/crear", datos.create); 
router.put("/actualizar/:idTipo", datos.update); 

router.get("/service/:idTipo", datos.getTipoClienteById); 
router.get("/detalle/:idTipo", datos.getTipoById); 

//Reportes
router.get("/reporte/:idTipo", datos.getServiceReport); 
router.get("/reporteClient/:idTipo", datos.getClienteReport); 


router.delete("/eliminar/:idTipo", datos.delete); 

module.exports = router;