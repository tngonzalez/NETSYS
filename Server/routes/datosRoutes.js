const express = require("express");
const router = express.Router();

const datos = require("../controllers/DatosController"); 

router.get("/instalacion", datos.getEstInstalacion); 
router.get("/proyecto", datos.getEstProyecto); 
router.get("/retiro", datos.getEstRetiro); 
router.get("/router", datos.getEstRouter); 
router.get("/tipo", datos.getTipoProyecto); 

module.exports = router;