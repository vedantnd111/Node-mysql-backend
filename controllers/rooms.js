const {
    mysqlConnection
} = require('../utils/mysql_connection');

const formidable = require('formidable');
const fs = require("fs");
const _ = require('lodash');
const {
    RSA_NO_PADDING
} = require('constants');

const {
    nextTick
} = require('process');

exports.roomById = (req, res, next, id) => {
    mysqlConnection.query("SELECT * FROM room WHERE rid=?", [id], (error, results) => {
        if (error || !results) {
            console.log(error);
            return res.status(404).json({
                error: "User not found"
            });
        } else {
            const [room] = results;
            req.room = room;
            next();
        }
    })
}

exports.roomById = (req, res, next, id) => {
    mysqlConnection.query("SELECT * FROM room WHERE rid=?", [id], (error, results) => {
        if (error || !results) {
            console.log(error);
            return res.status(404).json({
                error: "User not found"
            });
        } else {
            const [room] = results;
            req.room = room;
            next();
        }
    })
}

exports.readAll = (req, res) => {
    mysqlConnection.query('SELECT rid,hostel_name,rnumber,address,owner_name,tenant,mobile_number,price FROM room', (err, results) => {
        mysqlConnection.query('SELECT * FROM room', (err, results) => {
            if (err) {
                res.status(400).json({
                    error: "there are no rooms!"
                });
            } else {
                res.status(200).json(results);
            }
        })
    });
}


exports.read = (req, res) => {
    return res.status(200).json(req.room);
}

exports.create = (req, res) => {
    let form = formidable.IncomingForm();
    form.keepExtensions = true;
    let photo;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded!!"
            });
        }
        const {
            rname,
            rnumber,
            address,
            owner_name,
            mobile_number
        } = fields;
        let data = '';
        let type = '';
        if (!rname || !rnumber || !address || !owner_name || !mobile_number) {
            return res.status(400).json({
                error: "all fields are required!!"
            });
        }
        if (files.image) {
            if (files.image.size > 1000000) {
                return res.status(403).json({
                    error: "size of photo should be less than 1 mb"
                });
            }
            data = fs.readFileSync(files.image.path);
            type = files.image.type;
        }
        room = {
            rname: rname,
            rnumber: rnumber,
            address: address,
            owner_name: owner_name,
            image: data,
            image_type: type,
            mobile_number: mobile_number
        };
        mysqlConnection.query("INSERT INTO room SET ?", room, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    error: "can not be uploaded!!"
                });
            }
            // console.log(results);
            return res.status(200).json({
                result: "room created successfully!!"
            })

        });

    });

};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        const {
            rname,
            rnumber,
            address,
            owner_name,
            mobile_number
        } = fields;
        let data = '';
        let type = '';
        if (!rname || !rnumber || !address || !owner_name || !mobile_number) {
            return res.status(400).json({
                error: "all fields are required!!"
            });
        }
        let room = req.room;
        room = _.extend(room, fields);
        if (files.image) {
            if (files.image.size > 1000000) {
                return res.status(403).json({
                    error: "size of photo should be less than 1 mb"
                });
            }

            data = fs.readFileSync(files.image.path);
            type = files.image.type;
        }
        const room1 = req.room;
        mysqlConnection.query("UPDATE room SET rname=?,rnumber=?,address=?,owner_name=?,tenant=?,image=?,mobile_number=?,image_type=? WHERE rid=?",
            [room.rname, room.rnumber, room.address, room.owner_name, room.tenant, room.image, room.mobile_number, room.image_type, room.rid], (err, results) => {
                if (err) {
                    // console.log(err);
                    return res.status(400).json({
                        error: "can not be uploaded!!"
                        // error: err
                    });
                }
                // console.log(results);
                return res.status(200).json({
                    result: "room updated successfully!!"
                })

            });

    });

}

exports.photo = (req, res) => {
    if (req.room.image) {
        res.set('Content-Type', req.room.image_type);
        return res.send(req.room.image);
    }
    next();
}
exports.removeById = (req, res) => {
    const rid = req.room.rid;
    mysqlConnection.query("delete from room where rid=?", rid, (err, results) => {
        if (err) {
            return res.status(400).json({
                error: "can not remove the room !"
            })
        } else {
            return res.status(200).json({
                result: "room removed successfully!"
            });
        }
    })
}

exports.fillTenant = (req, res) => {
    const room = req.room;
    const user = req.profile;
    room.tenant === null ? room.tenant = user.name : room.tenant = room.tenant;
    mysqlConnection.query("UPDATE room SET hostel_name=?,rnumber=?,address=?,owner_name=?,tenant=?,image=?,mobile_number=?,image_type=? WHERE rid=?", [
        room.hostel_name, room.rnumber, room.address, room.owner_name, room.tenant, room.image, room.mobile_number, room.image_type, room.rid
    ], (err, results) => {
        if (err || !results) {
            // console.log(err);
            res.status(400).json({
                error: err
            });
        } else {
            console.log(room);
            console.log(user);
            res.status(200).json(results);
        }
    });
}