//importar dependencias y modulos
const User = require("../models/user");
const bcrypt = require("bcrypt");
const mongoosePagination = require("mongoose-pagination");

//importar servicios
const jwt = require("../services/jwt");

//acciones de prueba
const pruebaUser = (req,res) => {
    return res.status(200).send({
        message: "mensaje enviado desde: controllers/user.js",
        usuario: req.user
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
} // fin del metodo register

const login = (req,res) => {
    //recoger parametros del body
    let params = req.body;

    if(!params.email || !params.password){
        return res.status(400).send({
            status: "error",
            message: "Faltan datos por enviar"
        });
    }

    //buscar en la bbdd si existe
    //select({"password": 0}).exec()
    User.findOne({email: params.email}).then((user) =>{
    if(!user){
    return res.status(404).json({
        status: "error",
        message: "No existe el usuario"
    });
    }
    //comprobar su contraseña
    const pwd = bcrypt.compareSync(params.password, user.password);

    if(!pwd){
        return res.status(400).send({
            status: "error",
            message: "no te has identificado correctamente"
        });
    }


    //conseguir token
    const token = jwt.createToken(user);



    //devolver datos del usuario
     return res.status(200).send({
        status: "success",
        message: "Te has identificado correctamente",
        user: {
            id: user._id,
            name: user.name,
            nick: user.nick
        },
        token
    });


    }).catch((error) =>{
        return res.status(500).json({
        status: "error",
        message: "error en la consulta"
    });
    })

    
} // fin del metodo login

const profile = (req, res) => {
    //recibir el parametro del id del usuario por la url
    const id = req.params.id;

    //consulta para sacar los datos del usuario
    User.findById(id).select({password: 0, role: 0}).exec().then((userProfile) =>{
        if(!userProfile){
            return res.status(404).send({
                status: "Error",
                message: "El usuario no existe"
            });
        }
         //devolver resultado
         //posteriormente: devolver informacion de follows
         return res.status(200).send({
            status: "success",
            user: userProfile
         });

    }).catch((error) => {
        return res.status(500).json({
        status: "error",
        message: "error en la consulta"
    });
    })   
} // fin de metodo profile

const list = async(req, res) => {
    //controlar en que pagina estamos
    let page = 1;
    if(req.params[0]){
        page = req.params[0];
    }
    page = parseInt(page);

    //consulta con mongoose paginate
    let itemsPerPage = 5;

    try{
    const users = await User.find()
            .sort('_id')
            .paginate(page, itemsPerPage);

     const total = await User.countDocuments();

      if (!users || users.length === 0) {
            return res.status(404).send({
                status: "Error",
                message: "No hay usuarios disponibles"
            });
        }

         return res.status(200).send({
            status: "success",
            users,
            page,
            itemsPerPage,
            total,
            pages: Math.ceil(total/itemsPerPage)
        });
    }catch(error){
        return res.status(500).send({
            status: "Error",
            message: "Error en la consulta"
        });
    }

    // User.find().sort('_id').paginate(page, itemsPerPage).then((users) =>{

    // if(!users){
    //      return res.status(404).send({
    //         status: "Error",
    //         message: "No hay usuarios disponibles"
    //      });
    // }
    //  const total = users.total;
    //  console.log(total)
    // //devolver resultado (posteriormente info de follows)
    // return res.status(200).send({
    //         status: "success",
    //         users,
    //         page,
    //         itemsPerPage,
    //         total,
    //         pages: false
    //      });

    // }).catch((error) => {
    //    return res.status(500).send({
    //         status: "Error",
    //         message: "Error en la consulta"
    //      });
    // }) //fin del find

    
} // fin del metodo listar

const update = async(req, res) => {
    //recoger info del usuario a actualizar
    let userIdentity = req.user;
    let userToUpdate = req.body;

    //eliminar campos sobrantes
    delete userToUpdate.iat;
    delete userToUpdate.exp;
    delete userToUpdate.role;
    delete userToUpdate.image;

    //comprobar si el usuario ya existe
    try{
const userExist = await User.find({ $or: [
        {email: userToUpdate.email.toLowerCase()},
        {nick: userToUpdate.nick.toLowerCase()}
    ]})

    if(userExist && userExist.length >=1){
         return res.status(200).send({
        status: "success",
        message: "el usuario ya existe"
    });
    }

    //cifrar la contraseña
    if(userToUpdate.password){
        let pwd = await bcrypt.hash(params.password, 10);
        userToUpdate.password = pwd;
    }
   
    //Buscar y actualizar
     return res.status(200).send({
            status: "success",
            message: "Metodo de actualizar usuarios",
            userToUpdate
         });

    }catch(error){
        return res.status(500).send({
        status: "Error",
        message: "Error en la consulta"
    });
    
    }
 

    
}

//exportar acciones
module.exports = {
    pruebaUser,
    register,
    login,
    profile,
    list,
    update
}