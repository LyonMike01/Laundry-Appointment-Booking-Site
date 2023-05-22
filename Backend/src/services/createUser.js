
const { User } = require ("../models/userModel"),
      { hashPassword, confirmPasswords} = require("../utils/hasher")



const createUser = async (value) => {

  try {
        const password = value.password,
        confirmPassword = value.confirmPassword,
        hashedPassword = await hashPassword(password),
        hashedconfirmPassword = await hashPassword(confirmPassword),
                  user = {
                      email: value.email,
                      fullName: value.fullName,
                      password: hashedPassword,
                      confirmPassword: hashedconfirmPassword
                  },

          newUser = await User.create(user)
          newUser.save()
          return {
            id: newUser._id,
            email: newUser.email,
            role: newUser.role,
            fullName: newUser.fullName
          }
        } 
  catch (err) {
          throw new Error(err.message)
        }

};


module.exports = { createUser }
