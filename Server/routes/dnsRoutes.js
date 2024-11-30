const express = require("express");
const router = express.Router();

const datos = require("../controllers/dnsController"); 

router.get("/", datos.getAll); 

router.post("/crear", datos.create); 
router.put("/actualizar/:idDSN", datos.update); 

router.get("/dns/:idDSN", datos.getById); 
router.get("/estado/:idEstado", datos.getByIdEstado); 

//Reportes
router.get("/reporte", datos.getGeneralReport); 
router.get("/reporte/:idDSN", datos.getDSNReport); 

router.delete("/eliminar/:idDSN", datos.delete); 

module.exports = router;