const express = require("express");
const router = express.Router();
const PublicationController = require("../controllers/publication");

//definir rutas

router.get("/pruebas-publication", PublicationController.pruebaPublication);

//exportar router

module.exports = router;