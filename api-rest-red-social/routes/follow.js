const express = require("express");
const router = express.Router();
const FollowController = require("../controllers/follow");
const check = require("../middlewares/auth");

//definir rutas

router.get("/pruebas-follow", FollowController.pruebaFollow);
router.post("/save", check.auth, FollowController.save);
router.delete("/unfollow/:id", check.auth, FollowController.unfollow);
router.get("/following{/:id}{/:page}", FollowController.following);
router.get("/followers{/:id}{/:page}", FollowController.followers);

//exportar router

module.exports = router;