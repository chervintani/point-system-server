const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const admin = require('../models/admin')
const db = "mongodb+srv://userchervin:09421630479@angular.8cpbp.mongodb.net/pointsys_db?retryWrites=true&w=majority"

mongoose.connect(db, err =>{
    if(err){
        console.error('Error!' + err)
    }else{
        console.log('Connected to mongodb')
    }
})

function verifyToken(req, res, next){
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null'){
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token, 'secretKey')
    if(!payload){
        return res.status(401).send('Unauthorized request')
    }
    req.username = payload.subject
    next()
}

router.get('/pages/dashboard',verifyToken,(req, res) =>{
    let list =[

    ]
    res.json(list)
})

router.get('/', (req,res) => {
    res.send('From API route')
})

router.post('/login',(req, res)=>{
    let adminData = req.body

    admin.findOne({username: adminData.username},(error,username)=>{
        if(error){
            console.log("ERROR ni sya: ",error)
        }else{
            if(!username){
                res.status(401).send('Invalid username')
            }else
            if(username.password !== adminData.password){
                res.status(401).send('Invalid password')
            }else{
                let payload ={subject: username._id}
                let token = jwt.sign(payload, 'secretkey')
                res.status(200).send({token})
                // res.status(200).send(username)
            }
        }
       
    
        // var jwt = nJwt.create({ id: username.id }, config.secret);
        // jwt.setExpiration(new Date().getTime() + (24*60*60*1000));
    
        // res.status(200).send({ auth: true, token: jwt.compact() });
    })
})

module.exports = router