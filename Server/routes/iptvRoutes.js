const express = require("express");
const router = express.Router();

const iptv = require("../controllers/iptvController"); 

router.get("/", iptv.getAll); 
router.get("/cliente", iptv.getClientesByBW); 


router.post("/crear", iptv.create); 
router.put("/actualizar/:idIPTV", iptv.update); 

router.get("/iptv/:idIPTV", iptv.getByIdIPTV); 

//Reporte
router.get("/reporteF", iptv.getReportGeneral); 
router.get("/reporte/:idIPTV", iptv.getIPTVReport); 


router.delete("/eliminar/:idIPTV", iptv.detele); 

module.exports = router;