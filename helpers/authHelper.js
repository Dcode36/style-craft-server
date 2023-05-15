const bcryppt = require('bcrypt');


 const hashPassword = async(password) =>{
    try{
        const saltRounds = 10;
        const hashedPassword = await bcryppt.hash(password, saltRounds);
        return hashedPassword;
    } catch(error){
        console.log(error)
    }
};

 const comparePassword = async (password, hashedPassword)=>{
    return bcryppt.compare(password , hashedPassword);
}

module.exports = {hashPassword, comparePassword}