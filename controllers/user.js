const {
    mysqlConnection
} = require('../utils/mysql_connection');

exports.userById = (req, res, next, id) => {
    mysqlConnection.query("SELECT * FROM user WHERE id=?", [id], (error, results) => {
        if (error || !results) {
            console.log(error);
            return res.status(404).json({
                error: "User not found"
            });
        } else {
            // console.log(results);
            const [user] = results;
            user.password = undefined;
            user.salt = undefined;

            req.profile = user;
            next();
        }
    });
};

exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.update = (req, res) => {
    const user = req.body;
    // we must have to update email since its an unique entry
    mysqlConnection.query("update user set name=?, email=?,role=? where id = ?",
        [user.name, user.email, user.role, req.profile.id], (error, results) => {
            if (error) {
                console.log(error);
                res.status(400).json({
                    error: "update failed!!"
                });
            } else {
                res.status(200).json({
                    user: user
                });
            }
        });
};

exports.readAll = (req, res) => {
    mysqlConnection.query("SELECT * FROM user", (error, users) => {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json({
                users: users
            });
        }
    })
};