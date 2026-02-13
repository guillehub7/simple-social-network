const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");

//definir rutas

router.get("/pruebas-usuario", UserController.pruebaUser);
router.post("/register", UserController.register);

//exportar router

module.exports = router;