const express = require("express");
const router = express.Router();

const iptv = require("../controllers/iptvController"); 

router.get("/", iptv.getAll); 

router.post("/crear", iptv.create); 
router.put("/actualizar/:idIPTV", iptv.update); 

router.get("/iptv/:idIPTV", iptv.getByIdIPTV); 

router.delete("/eliminar/:idIPTV", iptv.detele); 

module.exports = router;