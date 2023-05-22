const { User } = require("../models/userModel");


const userID = async (value) =>{

    const verify = await User.findOne({_id: value});
    
    if (  !verify ) {
      return false
    }

    return {
      id: verify._id,
      email: verify.email,
      role: verify.role,
      fullName: verify.fullName
    }   
    }

module.exports = { userID };
