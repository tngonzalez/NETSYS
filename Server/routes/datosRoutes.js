const express = require("express");
const router = express.Router();

const datos = require("../controllers/datosController"); 

router.get("/instalacion", datos.getEstInstalacion); 
router.get("/proyecto", datos.getEstProyecto); 
router.get("/retiro", datos.getEstRetiro); 
router.get("/activo", datos.getEstActivo); 
router.get("/tipoP", datos.getTipoProyecto); 

module.exports = router;