

 const checkUser = async (value1, value2) => {

    const credentials = await value1.findOne({ ...value2 });
    
    if (!credentials._id || !credentials) {
      let err = new Error("User not found");
      err.status = 404;
      throw err
     }
     return true;
  };
  
  
  module.exports = { checkUser };
  