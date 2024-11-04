const express = require("express");
const router = express.Router();

const datos = require("../controllers/dnsController"); 

router.get("/", datos.getAll); 

router.post("/crear", datos.create); 
router.put("/actualizar/:idDNS", datos.update); 

router.get("/dns/:idDNS", datos.getById); 
router.get("/estado/:idEstado", datos.getByIdEstado); 


router.delete("/eliminar/:idDNS", datos.delete); 

module.exports = router;