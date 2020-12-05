const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

//Mysql connection settings
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: '',
    database:"testdb"
});

con.connect((err) => {
    if (err) throw err;
    console.log('MYSQL CONNECTED...');
});

app.get('/', (req, res) => {
    // let sql='CREATE DATABASE testdb';
    // con.query(sql,(err,result)=>{
    //     if(err) throw err;
    //     console.log(result);
    //     res.send('database created');
    // })
    res.json("Successful");
});


app.listen(process.env.PORT, () => {
    console.log(`site is on the PORT ${process.env.PORT}`);
})