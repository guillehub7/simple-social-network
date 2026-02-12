

//acciones de prueba
const pruebaFollow = (req,res) => {
    return res.status(200).send({
        message: "mensaje enviado desde: controllers/follow.js"
    });
}

//exportar acciones

module.exports = {
    pruebaFollow
}