const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cookieParser=require('cookie-parser');
const expressValidator=require('express-validator');
const morgan=require('morgan');
const cors=require('cors');

const app = express();
const authRoutes=require('./routes/auth');
const userRoutes=require('./routes/user');
const roomRoutes=require('./routes/rooms');
const braintreeRoutes=require('./routes/braintree');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    // let sql='CREATE DATABASE testdb';
    // con.query(sql,(err,result)=>{
    //     if(err) throw err;
    //     console.log(result);
    //     res.send('database created');
    // })
    res.json("Successful");
});
app.use('/users',authRoutes);
app.use('/api',userRoutes);
app.use('/api',roomRoutes);
app.use('/api',braintreeRoutes);

app.listen(process.env.PORT, () => {
    console.log(`site is on the PORT ${process.env.PORT}`);
})