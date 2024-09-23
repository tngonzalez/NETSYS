const express = require("express");
const router = express.Router();

const datos = require("../controllers/ftthController"); 

router.get("/", datos.getFTTH); 
//Ctr + k + c 

router.post("/crear", datos.create); 
//router.put("/actualizar/:idRouter", datos.update); 

//Filtros: Servicio + Estado + Id
// router.get("/router/:idRouter", datos.getRouterById); 
// router.get("/estado/:idEstado", datos.getRouterByEstado); 

// router.delete("/eliminar/:idRouter", datos.deteleRouter); 

module.exports = router;