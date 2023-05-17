const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
// self-invocation database function
(async function(){
    await mongoose.connect(AppConfig.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Database Connected 🚀")
    }).catch(err => {
        console.log(err)
    })
})();
