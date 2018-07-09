'use strict'

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var multipart = require('connect-multiparty');

function userTest(req, res){
    res.status(200).send({message: 'test users works'});
}

//Registrar usuarios
function saveUser(req, res){
    var user = new User();//nueva instancia para setear valores
    var params = req.body;//todo los datos que nos llegan por post

    if(params.name && params.surname && params.email && params.password)
    {
        //console.log(params);
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = 'ROLE_ADMIN';
        user.image = 'null';

        //Controla usuarios dupolicados
        User.find({ $or: [
            {email: user.email.toLowerCase()}
        ]}).exec((err, users)=>{

            if(err){
                return res.status(500).send({message: 'Error en la peticion de usuario'}) 
            }    
            else if(users && users.length >=1){//1 o mas usuarios encontrados con el mismo correo
                return res.status(200).send({message: 'El usuario que intenta registrar ya existe'});
            }
            else{
            //Encriptar contraseña
                bcrypt.hash(params.password, null, null, function(err, hash){
                    user.password = hash;
                    if(user.name != null & user.surname != null, user.email != null){
                        //si existe datos guardamos
                        user.save((err, userStored) => {
                            if(err)
                                res.status(500).send({message: 'Error al guardar el usuario'});
                            else if(!userStored){
                                res.status(404).send({message: 'No se ha registrado el usuario'});
                            }else{
                                res.status(200).send({user:userStored});
                            }    
                        });
                    }else{
                        res.status(200).send({message: 'Introduce todos los campos'})
                    }
                });
            }
        });
    }else{
        res.status(500).send({message: 'Es necesario llenar todos los campos'});
    }    
}

//Login
function loginUser(req, res){
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else if(!user){
            res.status(404).send({message: 'El usuario no existe'});
            
        }else{
            //si existe el user comparo pass
            bcrypt.compare(password, user.password, (err, check) => {
                if(check){
                    //devolver datos de usuario logueado
                    if(params.gethash){
                        //si existe gethash generar token y devolver
                        res.status(200).send({token: jwt.createToken(user)});
                    }else
                        res.status(200).send({user});
                    
                }else{
                    res.status(404).send({message: 'El usuario no se ha podido identificar'});
                }
            });
        }              
    });
}

//Actualizar datos de user
function updateUser(req, res){
    var userId = req.params.id;  //user que se recibe por url
    var update = req.body;

    delete update.password;

    if(userId != req.user.sub){//sera que es igual al usuario logueado
        res.status(500).send({message: 'No tienes permiso para editar datos de este usuario'});
    }
    else{
        User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdated) => {
            if(err)
                res.status(500).send({message: 'Error en la peticion'});
            else if(!userUpdated){
                res.status(404).send({message: 'No existe el usuario'});
            }
            else{
                res.status(200).send({user: userUpdated});
            }
        });
    }
}

//Subir avatar de usuario
function uploadImage(req, res){
    var userId = req.params.id;
    var file_name = "No subido";

    if(req.files){//si existe ficheros en la req
        //sacar nombre del archivo
        var file_path = req.files.image.path; //image es el campo del fichero que subiremos
        var file_split = file_path.split('\\');//convierte en un array
        var file_name = file_split[2];

        //sacar extension del archivo
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        //comprobar si el fichero tiene extension correcta
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {
                if(err)
                    res.status(500).send({message: 'Error en la peticion'});
                else if(!userUpdated)
                    res.status(404).send({message: 'No se puede actualizar el avatar del usuario'});
                else
                    res.status(200).send({user: userUpdated}); 

            });
        }

        //console.log(file_path);
    }else{
        res.status(200).send({message: 'No se ha subido ninguna imagen'});
    }
}

module.exports = {
    userTest,
    saveUser,
    loginUser,
    updateUser,
    uploadImage
}
