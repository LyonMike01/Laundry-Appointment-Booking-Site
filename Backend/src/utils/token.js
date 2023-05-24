const jwt = require('jsonwebtoken'),
        SECRET = AppConfig.JWT_SECRET,
        HOST = AppConfig.HOST


module.exports = {

    // generate jwt token with expiry date set to 1 minutes
    
    generateToken  : async (user) => {
               
        const {id, email } = user
        
        const payload = {
                id: id,
                email: email
                            }             
                          
                const token = jwt.sign(
                    payload, 
                    SECRET, 
                    { expiresIn: "1h" }
                    ); 

        return token
    },
    // expiresIn("1m")       60000
    // expiresIn("5s")       5000
     // generate email verification link when verify a newly created account
     generateEmailVerificationLink : async (user) => {
        console.log("verificationLink")
        link = jwt.sign(user, SECRET, { expiresIn: "1800000"}) //token expires in 30 minutes
        verificationLink = `${HOST}/verify/${link}`
        return verificationLink
    },

    // verify jwt => returns embeded user object if links is still active
    verifyLink: async (link) => {
        let isValid = jwt.verify(link, SECRET )
        if(isValid) return isValid
    },

    // generate password reset link for reseting user password
    generatePasswordResetLink : async (user) => {
        link = jwt.sign(user, SECRET, { expiresIn: "1800000"}) //token expires in 30 minutes
        return `${HOST}/api/resetpassword/${link}`
    },

    // generate update role reset link for updating user role
    generateUpadateResetLink : async (user) => {
        link = jwt.sign(user, SECRET, { expiresIn: "1800000"}) //token expires in 30 minutes
        verificationLink = `${HOST}update/${link}`
        return verificationLink
    },

    // generate delete role link for deleting user role
    generateDeleteRoleLink : async (user) => {
        link = jwt.sign(user, SECRET, { expiresIn: "1800000"}) //token expires in 30 minutes
        verificationLink = `${HOST}delete/${link}`
        return verificationLink
    }

}
