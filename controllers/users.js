const crypto = require("crypto");
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const {mysqlConnection}=require('../utils/mysql_connection');


exports.signup = (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    let salt=uuidv4();
    let hashed_password = encryptPassword(req.body.password,salt);
    var user={
        name:name,
        email:email,
        salt:salt,
        password:hashed_password,
        role:0
    };
    mysqlConnection.query('INSERT INTO user SET ?',user,(error,results,fields)=>{
        if(error ){
            // console.log(error);
            res.status(400).json({error:"user with given credentials already exists!!"});
        }
        else{
            user.salt=undefined;
            user.password=undefined;
            salt=undefined;
            hashed_password=undefined;
            // console.log("results",results);
            // console.log("fields",fields);
            res.status(200).json({user});
        }
    });
}

exports.login = (req, res) => {

}

exports.logout = (req, res) => {

}

encryptPassword = (password,salt) => {
    if (!password) return "";
    try {
        return crypto.createHmac('sha1', salt)
            .update(password)
            .digest("hex");
    } catch {
        return "";
    }
}

authanticate = (plainPassword) => {

    return this.encryptPassword(plainPassword) === this.hashed_password;
}