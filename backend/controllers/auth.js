const User=require("../models/userModel");

let functions = {
    authUser : async(req, res) => {
        const {email,password} = req.body;
        let user = await User.findOne({ email })

        if(user) {
            let matched = await bcrypt.compare(password,user.password)
            if(matched){
                
            }
        } else {
            res.status(400).json({error:"Invalid credentials"})
            throw new Error("Invalid credentials")
        }
    }
}

module.exports = functions