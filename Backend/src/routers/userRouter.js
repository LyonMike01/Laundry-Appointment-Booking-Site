
const express = require("express"),
    router = express.Router(),
    { verifyToken } = require("../middleware/verifyToken")



const {
    createNewUser,
    updateUserDetails,
    deleteUserDetails,
    getAllUsers,
    getUserByID,
    Login,
    getMail,
    forgetPassword,
    resetPassword,
    verifyLink 
} = require("../controller/userController")


// user routes

router.post("/createuser", createNewUser);
router.post("/login", Login);
router.get("/forgetpassword", forgetPassword);
router.post("/forgetpassword", getMail);
router.get('/resetpassword/:link', verifyLink);
router.post('/resetpassword/:link', resetPassword);
router.put("/updateuser/:id", updateUserDetails);
router.delete("/deleteuser/:id", deleteUserDetails);
router.get("/getallusers", getAllUsers);
router.get("/getuser/:id",  getUserByID);
// router.get("/getallmaleuser/:gender", verifyToken, getMaleUser);



module.exports = router;