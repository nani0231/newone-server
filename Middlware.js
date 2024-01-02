// const jwt = require("jsonwebtoken");

// module.exports = function (req, res, next) {
//     try {
//         let token = req.header("token")

//         if (!token) {
//             return res.status(400).json("jwt token not found")
//         }
//         let compareToken = jwt.verify(token, "jwtpassword");
//         req.user = compareToken.user;//compare req user and loggged user
//         next();
//     } catch (e) {
//         console.log(e)
//         return resizeBy.status(500).json("Internal server error")
//     }
// }
const jwt = require("jsonwebtoken");

const jwtAuth = (req, res, next) => {
    let jwtToken;
    const authHeader = req.headers["authorization"];
    if (authHeader !== undefined) {
        jwtToken = authHeader.split(" ")[1]
    }

    if (jwtToken === undefined) {
        return res.status(401).json({ message: "Token Invalid" })
    }
    else {
        jwt.verify(jwtToken, 'siva', async(error, payload) => {
            if (error) {
                console.log(error);
                return res.status(401).json({ message: "Invalid Token" })
            }
            else {
                req.id = payload.id;
                next();
            }
        });
    }
}

module.exports = jwtAuth;
