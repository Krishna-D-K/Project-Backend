require('dotenv').config({path: "../config.env"});
const jwt = require('jsonwebtoken');
const { Users } = require("../models");

const requireAuth = async (req, res, next) => {

    //verify authentication
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ error: "Authorization token required" });
    }
    else {
        const token = authorization.split(" ")[1];
        try {
            const { rollNo } = jwt.verify(token, process.env.JWT_SECRET, async (err, verifiedJWT)=>{
                if(err){
                    console.log(err);
                }
                else{
                    req.body.user = await Users.findOne({
                        where: {
                            rollNo: verifiedJWT.rollNo
                        }
                    })
                    next();
                }
            })
        } catch (err) {
            res.status(401).json({ error: "Request not authorized" });
        }
    }
}

module.exports = requireAuth