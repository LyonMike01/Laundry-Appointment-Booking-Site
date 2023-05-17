const { User } = require ("../models/userModel");


const userID = async (value) =>{

    const verify = await User.findOne({_id: value});
    
    if (  !verify ) {
      return false
    }
    return verify
    }

module.exports = { userID }

  