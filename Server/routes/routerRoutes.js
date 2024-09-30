const express = require("express");
const router = express.Router();

const datos = require("../controllers/routerController"); 

router.get("/", datos.getRouter); 

router.post("/crear", datos.create); 
router.put("/actualizar/:idRouter", datos.update); 

router.get("/router/:idRouter", datos.getRouterById); 
router.get("/detail/:idRouter", datos.getRouterDetailById); 
router.get("/estado/:idEstado", datos.getRouterByEstado); 

router.delete("/eliminar/:idRouter", datos.deteleRouter); 

module.exports = router;