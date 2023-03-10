const jwt = require("jsonwebtoken");
const auth = ( req, res, next)=>{
    // Grab token from cookie
    
    const { token } = req.cookie
    //if no token ,stop there
    if(!token ){
        res.status(403).send(`Please login first`);
    }
    //decode the token and get the id
    try {
        const decode = jwt.verify(token , 'mysecretkey')
        console.log(decode);
        req.user = decode;
    } catch (error) {
        console.log(error);
        res.status(401).send(`Invalid token`)
    }

    //query to db for that user id
    //

    return next();
}

module.exports = auth;