const { User } = require ("../models/userModel");


const userEmail = async (value) =>{

    const verify = await User.findOne({email: value});
    
    if (  !verify ) {
      return false
    }

    return {
      id: verify._id,
      email: verify.email,
      role: verify.role,
      fullName: verify.fullName,
      password: verify.password,
    }
    }

module.exports = { userEmail }

  