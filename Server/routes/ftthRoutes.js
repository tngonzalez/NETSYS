const express = require("express");
const router = express.Router();

const datos = require("../controllers/ftthController"); 

router.get("/", datos.getFTTH); 
router.get("/info", datos.getInfoCliente); 
router.get("/bw", datos.getBW); 


router.post("/crear", datos.create); 
router.put("/actualizar/:idCliente", datos.update); 

router.get("/ftth/:idCliente", datos.getFTTHById); 

router.delete("/eliminar/:idCliente", datos.delete); 

module.exports = router;