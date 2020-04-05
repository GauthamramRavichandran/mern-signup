const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const keys = require("../../config/keys");
const axios = require("axios")
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateUpdateInput = require("../../validation/update");

// Load User model
const User = require("../../models/User");

//Create API cloud URL
const API_CLOUD_URL = 'https://'+process.env.API_SECRET+'@api.cloudinary.com/v1_1/'+process.env.CLOUD_NAME+'/resources/image/upload/'

router.post('/register', (req, res) =>{
    const {errors, isValid} = validateRegisterInput(req.body);

    if (!isValid){
        return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email}).then(user => {
        if (user) {
            return res.status(400).json({"email": "Email already exists"});
        }
        else
        {
            const newUser = new User({
                name: req.body.name,
                email:req.body.email,
                password: req.body.password
            });
            bcrypt.genSalt(10, (err,salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                })
            })
        }

    }
        )

})
router.get('/get/:id', (req, res) => {
    console.log(req.params);
    User.findById(req.params.id)
    .then( user => {res.json(user)})
    .catch( err => res.status(400).json('Error: '+err))
})
// Get the profile photo
router.get('/profile/:id', (req, res) => {
    axios.get(API_CLOUD_URL+process.env.CLOUD_PRESET+'/'+ req.params.id)
    .then(img => {
        //console.log(img);
        res.json(img.data)})
    .catch( err => res.status(400).json('Error: '+err))
})

// Delete the profile photo
router.post('/profile/:id', (req, res) => {
    axios.delete(API_CLOUD_URL, {"public_ids" : process.env.CLOUD_PRESET+'/' +req.params.id})
    .then(img => {
        //console.log(img);
        res.json(img.data)})
    .catch( err => res.status(400).json('Error: '+err))
})
router.post('/update', (req, res) =>{
    console.log(req.body);
    const {errors, isValid} = validateUpdateInput(req.body);
    
    if (!isValid){
        return res.status(400).json(errors);
    }

    /*User.findOne({email: req.body.email}).then(user => {
                    user
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));*/
    User.updateOne({email: req.body.email}, req.body).then(update => res.json(update))
    .catch(err => console.log(err))

})
router.post('/login', (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid){
        return res.status(400).json(errors);
    }
    const email = req.body.email
    const password = req.body.password
    User.findOne({email}).then(user => {
        if (!user){
            return res.status(400).json({'emailnotfound': "Email not Found"});
        }

        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch){
                const payload = {
                    id : user.id,
                    name : user.name
                };
                jwt.sign(
                    payload, 
                    keys.secretOrKey, 
                    {expiresIn : 31556926}, 
                    (err, token) => { 
                        res.json({ success: true,
                                    token: "Bearer "+ token
                    });
                });
            }
            else {
                return res.status(400).json({passwordincorrect: "Password incorrect"});
            }
        });
    });
});

module.exports = router;