const crypto = require("crypto");
const {
    v4: uuidv4
} = require('uuid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const {
    mysqlConnection
} = require('../utils/mysql_connection');

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

exports.requireLogIn = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: "access denied"
        });
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if (req.profile.role == 0) {
        return res.status(403).json({ error: "admin resource! access denied" });
    }
    next();
}
