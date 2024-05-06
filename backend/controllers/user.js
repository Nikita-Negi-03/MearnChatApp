const generateToken=require("../config/generateToken");
const User=require("../models/userModel");
const bcrypt = require("bcrypt")

var functions = {
    registerUser : async(req,res)=>{
        try {
            let {name,email,password,pic} = req.body;

            if(!name || !email || !password) {
                res.status(400);
                throw new Error("please enter all the fields");
            }
            let userExists = await User.findOne({ email });
            if(userExists) {
                res.status(400).json({error:"User with this email already exists"});
                throw new Error("User with this email already exists");
            }

            let salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt)

            let user = await User.create({
                name,
                email,
                password,
                pic
            })

            if(user) {
                res.status(200).json({
                    _id: user._id,
                    name:user.name,
                    email:user.email,
                    pic:user.pic,
                    token:generateToken(user._id)
                })
            } else {
                res.status(400);
                throw new Error("Failed to create user");
            }

        } catch (error) {
            
            // console.log(error)
            res.status(400);
            throw new Error(error);
        }
    },
    login : async(req, res)=> {
        try {
            const {email,password} = req.body;
            let user = await User.findOne({ email })
    
            if(user) {
                let matched = await bcrypt.compare(password,user.password)
                if(matched){
                    res.status(200).json({
                        _id: user._id,
                        name:user.name,
                        email:user.email,
                        pic:user.pic,
                        token:generateToken(user._id)
                    })
                } else {
                    res.status(400).json({error:"Invalid password"})
                    throw new Error("Invalid password")
                }
            } else {
                res.status(400).json({error:"Invalid credentials"})
                throw new Error("Invalid credentials")
            }
        } catch (error) {
            // console.log(error)
            res.status(400);
            throw new Error(error);
        }
    },
    allUsers : async (req, res) => {
        try {
            let keyword = req.query.search
                ? {
                    $or: [
                        { name : { $regex: req.query.search, $options: "i"} },
                        { email : { $regex: req.query.search, $options: "i"} }
                    ]
                }
                :{}
            
            let users = await User.find(keyword).find({_id:{$ne: req.user._id}})

            res.send(users)
        } catch (error) {
            res.status(400);
            throw new Error(error);
        }
    }
}

module.exports= functions