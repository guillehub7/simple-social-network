//importar dependencias y modulos
const User = require("../models/user");
const bcrypt = require("bcrypt");

//acciones de prueba
const pruebaUser = (req,res) => {
    return res.status(200).send({
        message: "mensaje enviado desde: controllers/user.js"
    });
}

//Registro de usuarios
const register = (req, res) => {
    //recoger datos de la peticion
    let params = req.body;
    //comprobar que me llegan bien (+validacion)
    if(!params.name || !params.email || !params.password || !params.nick){
        console.log("validacion minima pasada")
        return res.status(400).json({
        status: "error",
        message: "faltan datos por enviar"
    });
    }

    //control de usuarios duplicados
    User.find({ $or: [
        {email: params.email.toLowerCase()},
        {nick: params.nick.toLowerCase()}
    ]}).exec().then(async(users) =>{

    if(users && users.length >=1){
         return res.status(200).send({
        status: "success",
        message: "el usuario ya existe"
    });
    }

    //cifrar la contraseña
   let pwd = await bcrypt.hash(params.password, 10);
   params.password = pwd;

   //crear objeto del usuario
    let user_to_save = new User(params);

    //guardar usuario en la bbdd
    user_to_save.save().then((userSored) =>{
        if(!userSored){
         return res.status(500).json({
        status: "error",
        message: "error en la consulta"
    });
        }

        //devolver resultado
        return res.status(200).json({
        status: "success",
        message: "Usuario Registrado correctamente",
        user: userSored
    });


    }).catch((error)=>{
        return res.status(500).send({
        status: "error",
        message: "error al guardar el usuario"
    });
    });

    

    }).catch((error) => {
         return res.status(500).json({
        status: "error",
        message: "error en la consulta"
    });

    }) // fin del exec


    
}


//exportar acciones

module.exports = {
    pruebaUser,
    register
}