const express = require("express");
const router = express.Router();

const ont = require("../controllers/ontController"); 

router.get("/", ont.get); 

router.post("/crear", ont.create); 
router.put("/actualizar/:idONT", ont.update); 


router.get("/ont/:idONT", ont.getONTById); 
router.get("/estado/:idEstado", ont.getONTByEstado); 


router.delete("/eliminar/:idONT", ont.deteleONT); 

module.exports = router;