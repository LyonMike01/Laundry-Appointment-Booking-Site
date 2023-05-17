const { createUser } = require ("../services/createUser"),
      { userID } = require ("../services/userID"),
      { deleteUser }  = require ("../services/deleteUser"),
      { getUsers }  = require ("../services/getUsers"),
      { updateUser }  = require  ("../services/updateUser"),
      {searchMaleUser} = require("../services/searchMaleUser"),
      { coookies, verifyToken, generateToken } = require("../utils/token"),
      {loginCheck} = require ("../services/login.js")



exports.createNewUser = async (req, res, next) => {

  try {

    const newUser = await createUser(req.body);


    if (newUser) {
     
      const token = await generateToken(newUser)
       res.setHeader("x-access-token", "Bearer "+ token);  

      res.status(201)
          .cookie ("jwt", token, {
                  secure: true,
                  maxAge:  10000
                  })
          .json({
                msg: "User Created",
                data: newUser, 
                token: token
                });
      }
    else {
      throw err
    } }
  catch (err) {
    return res.status(400).json({ err, message: "OOps!!! Unable to create User" });
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


exports.getMaleUser = async (req, res, next) => {
  try {

    const key = req.params.gender;
    
    if (key != "male") {
        return res.status(400).json({
          message: "Only MALE gender can be accessed through this route",
        }); 
    }    
    else {
      const user =  await searchMaleUser(key);
      return res.status(200).json({
        message: "Male Gender Users Successfully seen",
        data: user 
      });
      }

 
  } catch (err) {
    return res.status(500).json({ err, message: err.message });
  }
};


// Login and Forget


exports.seeLogin = async (req, res, next) => {
  try {
      const {email, password } = req.body;
      const newUser = await loginCheck(email, password)
      
      if(newUser) {
      const payload = {
        id: newUser.id,
        email: newUser.email
      }
    
      const token = jwt.sign(
                       payload, 
                       secret, 
                       { expiresIn: maxAge }
                       );
      res.cookie ("jwt", token, {
                        secure: true,
                        httpOnly: true,
                        maxAge: (maxAge * 1000)
                                })

     res.render("secrets");

  } else{
    res.render("login")
  }

} catch (err) {
    console.log(err.message);
  }
};


exports.logout = async (req, res) => {
  res.cookie("jwt", "", {
      maxAge: "1"
  })
  res.render("home")
} 