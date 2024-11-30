const express = require("express");
const router = express.Router();

const datos = require("../controllers/rcasaController"); 

router.get("/", datos.getRouter); 

router.post("/crear", datos.create); 
router.put("/actualizar/:idRouter", datos.update); 

router.get("/router/:idRouter", datos.getRouterById); 
router.get("/estado/:idEstado", datos.getRouterByEstado); 

//Reportes
router.get("/reporte", datos.getGeneralReport); 
router.get("/reporte/:idRouter", datos.getRouterReport); 


router.delete("/eliminar/:idRouter", datos.deteleRouter); 

module.exports = router;