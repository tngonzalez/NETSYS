const express = require("express");
const router = express.Router();

const datos = require("../controllers/usuarioController"); 

router.get("/", datos.getAll); 

router.post("/crear", datos.create); 
router.post("/login", datos.login); 
router.put("/:idUsuario", datos.update); 

router.get("/detail/:idUsuario", datos.getUsuarioById); 
 
router.delete("/eliminar/:idUsuario", datos.detele); 

module.exports = router;