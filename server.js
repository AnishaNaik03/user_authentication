const express=require('express')
const mysql=require('mysql');
const path=require('path')
const app=express()

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'verify_db'
})
const publicDirectory=path.join(__dirname,'./public');
app.use(express.static(publicDirectory))
db.connect((error)=>{
    if(error){
        console.log(error)
    }else{
        console.log("MYSQL Connected...")
    }
})
app.set('view-engine','ejs')
app.use(express.urlencoded({extended:false}))
app.use(express.json());

app.use('/',require('./routes/pages'));
app.use('/auth',require('./routes/auth'));
app.listen(3000)