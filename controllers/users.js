const crypto = require("crypto");
const {
    v4: uuidv4
} = require('uuid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const {
    mysqlConnection
} = require('../utils/mysql_connection');
const mysql_connection = require("../utils/mysql_connection");
const {
    error
} = require("console");


exports.signup = (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    let salt = uuidv4();
    let hashed_password = encryptPassword(req.body.password, salt);
    var user = {
        name: name,
        email: email,
        salt: salt,
        password: hashed_password,
        role: 0
    };
    mysqlConnection.query('INSERT INTO user SET ?', user, (error, results, fields) => {
        if (error) {
            // console.log(error);
            res.status(400).json({
                error: "user with given credentials already exists!!"
            });
        } else {
            user.salt = undefined;
            user.password = undefined;
            salt = undefined;
            hashed_password = undefined;
            // console.log("results",results);
            // console.log("fields",fields);
            res.status(200).json({
                user
            });
        }
    });
}

exports.login = (req, res) => {
    const {
        email,
        password
    } = req.body;
    const hashed_password = encryptPassword(password, uuidv4());
    // let sql = `SELECT email,password FROM user WHERE email=${email}`;
    mysqlConnection.query(`select * from user where email = ?`,
        [email], (error, results) => {
            let [user_real] = results;
            if (error || !results) {
              return  res.status(404).json({
                    email: "user with this email do not exists!!"
                });
            }
            else if (user_real.password !== encryptPassword(password, user_real.salt)) {
                // console.log("uuid: ",uuidv4());
                // console.log("pass",encryptPassword(password, uuidv4()));
               return res.status(400).json({
                    error: "password do not match!!"
                });
            }

            const token = jwt.sign({
                id: user_real.id
            }, process.env.JWT_SECRET);
            res.cookie("t", token, {expire: new Date() + 9999});
            const {id,name,email,role} = user_real;
            return res.json({
                token,
                user: {
                    id,
                    name,
                    email,
                    role
                }
            });

        });
}

exports.logout = (req, res) => {
    res.clearCookie('t').json({
        message: "logged out succesfully"
    });
}

encryptPassword = (password, salt) => {
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