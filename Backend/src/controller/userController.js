const { createUser } = require ("../services/createUser"),
      { userID } = require ("../services/userID"),
      { userEmail } = require ("../services/userEmail"),
      { deleteUser }  = require ("../services/deleteUser"),
      { getUsers }  = require ("../services/getUsers"),
      { updateUser, updatePassword }  = require  ("../services/updateUser"),
      
      { 
        verifyToken, 
        generateToken, 
        generatePasswordResetLink, 
        generateEmailVerificationLink, 
        generateUpadateResetLink 
      }                           = require("../utils/token"),

      { hashPassword, comparePasswords} = require("../utils/hasher"),
      {loginCheck} = require ("../services/login.js"),
      maxAge = 3600000



exports.createNewUser = async (req, res, next) => {

  try {

     const {password, confirmPassword} = req.body

     if (confirmPassword === password) {
       
      //hash password
       let hashedPassword = await hashPassword(password)
      const newUser = await createUser(req.body);

              if (newUser) {
              
                const token = await generateToken(newUser)
          //       res.setHeader("x-access-token", "Bearer "+ token);  

                res.status(201)
                    .cookie ("jwt", token, {
                            secure: true,
                            maxAge:  maxAge
                            })
                    .json({
                          msg: "User Created",
                          data: newUser
                          });
                }
                
              }
    else {
      const err = new Error("Passwords do not match")
      throw err
    } }

  catch (err) {
    return res.status(400).json({ err, message: err.message });
  }};

        
exports.updateUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const body = req.body;

    const details = {
      id,
      ...body
    };
    
    const user = await updateUser(details);
    if (user) { 
    return res.status(202).json({ msg: "User Details Updated Successfyully", data: user });
    }
    else {
      throw err
    } 
  } catch (err) {
    return res.status(404).json({ err, message: "Seems your Inputs are invalid" });
  }
};


exports.deleteUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await deleteUser(id);
    if (user) { 
    return res.status(202).json({ message: "User Deleted" });
  }     
  else {
    throw err
  }} 
  catch (err) {
    return res.status(404).json({ err, message: "User not found" });
  }
};


  
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await getUsers();
    return res.status(200).json({
       data: users 
     });
  } catch (err) {
    return res.status(400).json({ err, message: "Invalide inputs, Please Try again" });
  }
};

exports.getUserByID = async (req, res, next) => {
  try {

    const key = req.params.id;

    const user =  await userID(key);
    if (user === false) {
      return res.status(400).json({
        message: "Match ID Not Found",
       });      
     } else {

      payload = {
        id: key
    }
      const token = await generateToken(payload)
      res.setHeader("x-access-token", "Bearer "+ token);
      return res.status(202).json({
        message: "Match ID Found",
        data: user,
        token: token
       });
       }
    
    } catch (err) {
    return res.status(500).json({ msg: "Pls provide a correct User Id" });
  }};


// Login and Forget

exports.Login = async (req, res) => {
  // retrieve the email and password
  const { email, password } = req.body;

  const user = await userEmail(email);


  if (!user) {
    return res
      .status(401)
      .json({ message: `User with email ${email} does not exist.` });
    }

  // comparing password
          let hashedPassword = user.password
           const validPassword = await comparePasswords(password, hashedPassword);
            if (!validPassword) {
              return res.status(401).json({ message: "Invalid email or password" });
            }

  return res.status(200).json({
      success: true,
      message: "User login successfully"
    })
}



exports.signout = async (req, res) => {
  //clear cookies
  res.clearCookie('jwt')
}




exports.forgetPassword = async (req, res) => {

  try {

  let { email } = req.body

      // find email on the db
      let user = await userEmail(email)
      if (user) {
        console.log("here")
          const userData = {
              id: user._id,
              email: user.email
          }
          console.log(user)
          // compose password reset link data
          let mailData = {
              to: userData.email,
              subject: "Password Reset Mail",
              body: await generatePasswordResetLink(userData)
          }

          // send password reset email if email is found in database record
          console.log(mailData)
      }

      res.status(200).json({
          message: `We will send a password reset magic link to ${req.body.email} if the record exist`
      })

  } catch (err) {
      res.status(400).json({
          error: err.message
      })
  }
}




exports.resetPassword = async (req, res) => {
  try {

      //accept the password reset link from the route param
      const passwordResetLink = req.params.link

      // check the validity of the password reset link
      let userLink = await verifyLink(passwordResetLink)
      
      if (!userLink) {
          throw new Error("Link expired")
      }

      // accept new password from json body
      const { newPassword, confirmpassword } = req.body

      if (newPassword === confirmpassword) {

        let { email } = userLink

        //hash new password
        let hashedPassword = await hashPassword(newPassword)
  
        //update and save new password
        const details = {
          email,
          hashedPassword,
          ...req.body
        };
        
        let user = await updatePassword(details);  
        if (user) { 
          return res.status(202).json({ msg: "User Details Updated Successfyully", data: user });
          }
      }
        else {
          throw err
        }
  }
  catch (err) {
      res.status(400).json({
          error: err.message
      })
  }
}