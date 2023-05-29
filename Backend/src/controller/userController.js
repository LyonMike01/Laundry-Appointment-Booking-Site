const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { createUser } = require("../services/createUser"),
  { userID } = require("../services/userID"),
  { userEmail } = require("../services/userEmail"),
  { deleteUser } = require("../services/deleteUser"),
  { getUsers } = require("../services/getUsers"),
  { updateUser, updatePassword } = require("../services/updateUser"),
  {
    verifyToken,
    generateToken,
    generatePasswordResetLink,
    generateEmailVerificationLink,
    generateUpadateResetLink,
    verifyLink,
  } = require("../utils/token"),
  { hashPassword, comparePasswords } = require("../utils/hasher"),
  { loginCheck } = require("../services/login.js"),
  maxAge = 3600000;

exports.createNewUser = async (req, res, next) => {
  try {
    const { password, confirmPassword } = req.body;

    if (confirmPassword === password) {
      const newUser = await createUser(req.body);

      if (newUser) {
        const token = await generateToken(newUser);
        //       res.setHeader("x-access-token", "Bearer "+ token);

        res
          .status(201)
          .cookie("jwt", token, {
            secure: true,
            maxAge: maxAge,
          })
          .json({
            msg: "User Created",
            data: newUser,
          });
      }
    } else {
      const err = new Error("Passwords do not match");
      throw err;
    }
  } catch (err) {
    return res.status(400).json({ err, message: err.message });
  }
};

exports.updateUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const body = req.body;

    const details = {
      id,
      ...body,
    };

    const user = await updateUser(details);
    if (user) {
      return res
        .status(202)
        .json({ msg: "User Details Updated Successfyully", data: user });
    } else {
      throw err;
    }
  } catch (err) {
    return res
      .status(404)
      .json({ err, message: "Seems your Inputs are invalid" });
  }
};

exports.deleteUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await deleteUser(id);
    if (user) {
      return res.status(202).json({ message: "User Deleted" });
    } else {
      throw err;
    }
  } catch (err) {
    return res.status(404).json({ err, message: "User not found" });
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await getUsers();

    return res.status(200).json({
      data: users,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ err, message: "Invalide inputs, Please Try again" });
  }
};

exports.getUserByID = async (req, res, next) => {
  try {
    const key = req.params.id;

    const user = await userID(key);
    if (user === false) {
      return res.status(400).json({
        message: "Match ID Not Found",
      });
    } else {
      payload = {
        id: key,
      };
      const token = await generateToken(payload);
      res.setHeader("x-access-token", "Bearer " + token);
      return res.status(202).json({
        message: "Match ID Found",
        data: user,
        token: token,
      });
    }
  } catch (err) {
    return res.status(500).json({ msg: "Pls provide a correct User Id" });
  }
};

// Login and Forget

exports.Login = async (req, res) => {
  try {
    // retrieve the email and password
    const { email, password } = req.body;

    const user = await userEmail(email);

    if (!user) {
      return res
        .status(401)
        .json({ message: `User with email ${email} does not exist.` });
    }

    // comparing password
    let hashedPassword = user.password;
    const validPassword = await comparePasswords(password, hashedPassword);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    payload = {
      emai: email,
      password: hashedPassword,
    };
    const token = await generateToken(payload);

    res.setHeader("x-access-token", "Bearer " + token);
    return res.status(200).json({
      success: true,
      message: "User login successfully",
    });
  } catch (err) {
    return res
      .status(400)
      .json({ err, message: "Invalide inputs, Please Try again" });
  }
};

exports.signout = async (req, res) => {
  //clear cookies
  res.clearCookie("jwt");
};

exports.forgetPassword = async (req, res) => {
  try {
    return res.status(200).json({
      success: "Frontend redirects to the url below for a POST request",
      message: `${AppConfig.HOST}/api/forgetpassword`,
    });
  } catch (err) {
    return res.status(404).json({ err, message: err.message });
  }
};

exports.getMail = async (req, res) => {
  let { email } = req.body;

  // find email on the db
  let user = await userEmail(email);
  if (user) {
    const userData = {
      id: user._id,
      email: user.email,
    };
    // compose password reset link data
    // let mailData = {
    //     to: userData.email,
    //     subject: "Password Reset Mail",
    //     body:
    // }
    const msg = {
      to: userData.email, // Change to your recipient
      from: "laundrybookingsite@gmail.com", // Change to your verified sender
      subject: "Reset Password",
      html: `<h1 style="color: green;">Laundry Booking</h1><div>Please click <a href=${await generatePasswordResetLink(
        userData
      )}>here</a> to reset your password</div>`,
    };
    console.log(msg)
    sgMail
      .send(msg)
      .then(() => {
        return res.json({ success: "Email sent" });
      })
      .catch((error) => {
        return res.status(400).json({ error: "Error Occurred" });
      });

    // send password reset email if email is found in database record
  } else {
    return res.status(400).json({
      error: "Not Found",
    });
  }

  // res.status(200).json({
  //     message: `We will send a password reset magic link to ${req.body.email} if the record exist`
  // })
};

exports.verifyLink = async (req, res) => {
  try {
    //accept the password reset link from the route param
    const passwordResetLink = req.params.link;

    // check the validity of the password reset link
    let userLink = await verifyLink(passwordResetLink);

    if (!userLink) {
      throw new Error("Link expired");
    }
    return res.status(200).json({
      success:
        "Frontend redirects to the url below for a POST request to reset password",
      message: `${AppConfig.HOST}/api/resetpassword/........`,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const passwordResetLink = req.params.link;

    let userLink = await verifyLink(passwordResetLink);
    let { email } = userLink;

    // accept new password from json body
    const { newPassword, confirmNewPassword } = req.body;

    if (newPassword === confirmNewPassword) {
      //hash new password
      const password = await hashPassword(newPassword),
        confirmPassword = await hashPassword(confirmNewPassword);

      //update and save new password
      const details = {
        email,
        password,
        confirmPassword,
      };

      let user = await updatePassword(details);
      if (user) {
        return res.status(202).json({
          success: "Frontend redirects user  to  login route",
          msg: "User Details Updated Successfyully",
          data: user,
        });
      }
    } else {
      throw new Error("Password does not match");
    }
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};
