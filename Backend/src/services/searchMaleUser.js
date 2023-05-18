

const { User } = require ("../models/userModel");


const searchMaleUser = async (value) => {

  const gender = await User.find({gender: value})

  if (  !gender ) {
      return false
    }
      return gender

};


module.exports = { searchMaleUser }