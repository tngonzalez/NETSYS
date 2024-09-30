const express = require("express");
const router = express.Router();

const olt = require("../controllers/oltController"); 

router.get("/", olt.get); 

router.post("/crear", olt.create); 
router.put("/actualizar/:idOLT", olt.update); 

router.get("/olt/:idOLT", olt.getOLTById); 
router.get("/red/:idOLT", olt.getSubrededByIdOLT); 


router.delete("/eliminar/:idOLT", olt.deteleOLT); 

module.exports = router;