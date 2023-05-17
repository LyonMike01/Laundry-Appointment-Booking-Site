
const { User } = require ("../models/userModel"),
 bcrypt = require("bcryptjs")

 
const loginCheck = async (user, pass) => {
    
  try { 
    const see = await User.findOne({ email: user});

    if (see) {
            const passW = bcrypt.compareSync(pass, see.password);

            if (passW) {
                return see
            } 
            else if(!passW) {
                console.log("Wrong Password: " + pass)
                return false
            }
        
        } else if (!see) {
              console.log("Wrong User: " + user)
            return false
        }

        } catch (err) {
            console.log(err.message)
        }


}

module.exports = { loginCheck }
