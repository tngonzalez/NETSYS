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


router.put("/actualizar/:idCliente", datos.update); 

router.get("/ftth/:idCliente", datos.getFTTHById); 


router.delete("/eliminar/:idCliente", datos.delete); 

module.exports = router;