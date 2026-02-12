const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");

//definir rutas

router.get("/pruebas-usuario", UserController.pruebaUser);

//exportar router

module.exports = router;