const mysql = require("mysql");
require('dotenv').config();

const connection = mysql.createConnection({
    port:process.env.DB_PORT,
    host:process.env.DB_HOST,
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE
});

connection.connect((err)=>{
    if(err){
        console.log("Connection Error");
        throw err;
    }else{
        console.log("Mysql Connected");
    }
});

module.exports = connection;