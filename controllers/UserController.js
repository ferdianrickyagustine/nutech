const { signToken } = require("../helpers/jwt")
const Model = require("../models/model")

class UserController {
    static async register(req, res) {
        try {
            const { email, first_name, last_name, password } = req.body

            if (!email || !first_name || !last_name || !password) {
                return res.status(400).json({
                    status: 101,
                    message: "Semua field harus diisi",
                    data: null
                })
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    status: 102,
                    message: "Paramter email tidak sesuai format",
                    data: null
                })
            }

            if (password.length <= 8) {
                return res.status(400).json({
                    status: 103,
                    message: "Password minimal 8 karakter",
                    data: null
                })
            }

            await Model.register({ email, first_name, last_name, password })

            res.status(200).json({
                status: 0,
                message: "Registrasi berhasil silahkan login",
                data: null
            })
        } catch (error) {
            // console.log(error);
            res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                return res.status(400).json({
                    status: 101,
                    message: "Semua field harus diisi",
                    data: null
                })
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    status: 102,
                    message: "Paramter email tidak sesuai format",
                    data: null
                })
            }

            const user = await Model.login({ email, password })

            // console.log(email);

            const payload = {
                id: user.id,
                email: user.email
            }
            // console.log(payload);
            
            const access_token = signToken(payload)

            res.status(200).json({
                status: 0,
                message: "Login Sukses",
                data: {
                    token: access_token
                }
            })


        } catch (error) {
            if (error.name === "Unauthorized") {
                return res.status(401).json({
                    status: 103,
                    message: "Username atau password salah",
                    data: null
                });
            }
            
            res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }
}

module.exports = UserController