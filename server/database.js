const mysql=require('mysql');
const db= mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"multivendor_ecom"
});
module.exports=db;