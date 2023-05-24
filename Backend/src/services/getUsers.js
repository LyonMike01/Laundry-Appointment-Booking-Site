
const { User } = require ("../models/userModel");


const getUsers = async () => {

  const usersProjection = { 
    password: false,
    confirmPassword: false,
    createdAt: false,
    updatedAt:  false,
    __v: false
};

  const getUsers = User.find({}, usersProjection)

  return getUsers
};


module.exports = { getUsers };
