const express = require("express");
const router = express.Router();

const datos = require("../controllers/ftthController"); 

router.get("/", datos.getFTTH); 
router.get("/info", datos.getInfoCliente); 
router.get("/bw", datos.getBW); 
router.post("/estado", datos.getEstado); 


router.post("/crear", datos.create); 
router.post("/retiro/crear", datos.updateStateRetiro); 
router.post("/suspencion/crear", datos.updateStateSuspencion); 
router.post("/danado/crear", datos.createStateDanado); 
router.post("/activo/crear", datos.updateStateActivo); 


router.put("/actualizar/:id", datos.update); 

router.get("/ftth/:idCliente", datos.getFTTHById); 

//Reporte 
router.get("/reporteF", datos.getFTTHReport); 
router.get("/reporteS", datos.getService1); 
router.get("/reporteSE", datos.getService2); 

router.get("/reporte/:idCliente", datos.getCondominioReport); 
router.get("/reporteE/:idCliente", datos.getEstadoReport); 

router.delete("/eliminar/:idCliente", datos.delete); 

module.exports = router;