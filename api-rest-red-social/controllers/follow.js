//impoortar modelo
const Follow = require("../models/follow");
const User = require("../models/user");


//acciones de prueba
const pruebaFollow = (req,res) => {
    return res.status(200).send({
        message: "mensaje enviado desde: controllers/follow.js"
    });
}

//accion de guardar un follow (accion de seguir)
const save = async(req, res) => {
    //conseguir datos por body
    const params = req.body;

    //sacar id del usuario identificado
    const identity = req.user;

    //crear objeto con modelo follow
    let userToFollow = new Follow({
        user: identity.id,
        followed: params.followed
    });


    //guardar objeto en bbdd
    try{
    const followStored = await userToFollow.save();
    if(!followStored){
        return res.status(400).send({
        status: "error",
        message: "no se ha podido seguir al usuario!"
     });
    }

     return res.status(200).send({
        status: "succes",
        identity: req.user,
        follow: followStored
     });

    }catch(error){
        return res.status(500).send({
        status: "error",
        message: "error en la consulta"
    });
    }

    
}


//accion de borrar un follow (accion dejar de seguir)
const unfollow = (req, res) => {
    //recoger id del usuario indetificado
    const userId = req.user.id;

    //recoger el id del usuario que sigo y quiero dejar de seguir
    const followedId = req.params.id;

    //find de las coincidencias y hacer remove
    Follow.deleteOne({
        "user": userId,
        "followed": followedId
    }).then((followDeleted) => {
        if(!followDeleted){
             return res.status(400).send({
             status: "error",
             message: "no has dejado de seguir a nadie"
            });
        }

        return res.status(200).send({
            status: "success",
            message: "follow eliminado correctamente"
        });
    }).catch((error) => {
      return res.status(500).send({
      status: "error",
      message: "no has dejado de seguir a nadie"
     });
})

}


//accion de listado de usuarios que cualquier usuario esta siguiendo (siguiendo)
 const following = (req,res) => {
        //sacar el id del usuario identificado

        //comprobar si me llega el id por parametro en la url

        //comprobar si me llega la pagina, si no la pagina 1

        //usuarios por pagina quiero mostrar

        //find a follow, popular datos de los usuarios y paginar con mongoose paginate

        //sacar un array de ids de los usuarios que me siguen y los que sigo como guille    

     return res.status(200).send({
            status: "success",
            message: "listado de usuarios que estoy siguiendo"
        });
 }

//accion de listado de usuarios que siguen a cualquier otro usuario (soy seguido)
const followers = (req,res) => {
     return res.status(200).send({
            status: "success",
            message: "listado de usuarios que me siguen "
        });
 }

//exportar acciones
module.exports = {
    pruebaFollow,
    save,
    unfollow,
    following,
    followers
}