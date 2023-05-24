

const { User } = require ("../models/userModel");
const { checkUser } = require ("./checkUser");



const updateUser = async (value) => {

  const { id, ...others } = await value;

  const details = await checkUser(User, { id });
  if (details) {
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { ...others },
    { new: true }
  ).select("_id");

  return updatedUser;
  }
  else return false
};

const updatePassword = async (value) => {


  const { email, ...others } = await value;


  const details = await checkUser(User, { email });

  if (details) {
  const updatedUser = await User.findOneAndUpdate(
    {email: email},
    {...others},
    { new: true }
  ).select("_id");


  return updatedUser;
  }
  else return false
};

module.exports = { updateUser, updatePassword };