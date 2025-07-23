const { verifyToken } = require("../helpers/jwt")
const Model = require("../models/model")

const authentication = async (req, res, next) => {
    try {
        const { authorization } = req.headers

        if (!authorization) {
            return res.status(401).json({
                status: 108,
                message: "Token tidak tidak valid atau kadaluwarsa",
                data: null
            })
        }

        const access_token = authorization.split(" ")[1]

        const payload = verifyToken(access_token)

        if (!payload || !payload.email) {
            return res.status(401).json({
                status: 108,
                message: "Token tidak tidak valid atau kadaluwarsa",
                data: null
            })
        }

        const user = await Model.findUserByEmail({ email: payload.email })

        if (!user) {
            return res.status(401).json({
                status: 108,
                message: "Token tidak valid atau kadaluwarsa",
                data: null
            });
        }

        req.loginInfo ={
            id: user.id,
            email: user.email
        }

        next()
    } catch (error) {
        res.status(401).json({
            status: 108,
            message: "Token tidak tidak valid atau kadaluwarsa",
            data: null
        })
    }
}

module.exports = authentication