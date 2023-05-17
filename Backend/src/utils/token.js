const jwt = require("jsonwebtoken"),
      maxAge = ("1h")



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
                    AppConfig.JWT_SECRET, 
                    { expiresIn: maxAge }
                    ); 

        return token
    },
    // expiresIn("1m")       60000
    // expiresIn("5s")       5000
    
    // verify jwt => returns embeded user object if links is still active
    verifyToken: async (token) => {
        let isValid = jwt.verify(token, AppConfig.JWT_SECRET )
        if(isValid){
             return isValid
        }
        else {
            return false
        }
    }
}
