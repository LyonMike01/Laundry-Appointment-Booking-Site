
const { User } = require ("../models/userModel");


const createUser = async (value) => {

  const newUser = await User.create(value);
  return newUser;
};


module.exports = { createUser }

