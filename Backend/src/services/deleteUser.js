

const { User } = require ("../models/userModel");
const { checkUser } = require ("./checkUser");

const deleteUser = async (value) => {
  
  const { id } = value;


  const user = await checkUser(User, { id });

   if (!user) {
    return false
  }

  const delete1 =  await User.deleteOne(id);

  return delete1;

};


module.exports = { deleteUser }