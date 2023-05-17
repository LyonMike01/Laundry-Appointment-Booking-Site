
const { User } = require ("../models/userModel");


const getUsers = async () => {
  const getUser = await User.find({});

  return getUser;
};


module.exports = { getUsers };
