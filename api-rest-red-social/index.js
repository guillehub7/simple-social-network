//importar dependencias
const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");

//mensaje de bienvenida
console.log("API NODE para Red Social arrancada!!");

// conexion a bbdd
connection();

//crear servidor node
const app = express();
const puerto = 3900;

//configurar el cors
app.use(cors());

//convertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//rutas de prueba
app.get("/ruta-de-prueba", (req, res)=> {
    return res.status(200).json(
        {
        "id": "1",
        "nombre": "guillermo alcaraz",
        "web": "guillealc.com"
    }
  );
})

//cargar conf rutas
const UserRoutes = require("./routes/user");
const FollowRoutes = require("./routes/follow");
const PublicationRoutes = require("./routes/publication");

app.use("/api/user", UserRoutes);
app.use("/api/follow", FollowRoutes);
app.use("/api/publication", PublicationRoutes);


//poner el servidor a escuchar peticiones http
app.listen(puerto, () => {
    console.log("Servidor de Node corriendo en el puerto: "+puerto);
});