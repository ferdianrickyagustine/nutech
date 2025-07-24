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

    static async profile(req, res) {
        try {
            const { email } = req.loginInfo

            const user = await Model.findUserByEmail({ email })

            res.status(200).json({
                status: 0,
                message: "Sukses",
                data: {
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    profile_image: user.profile_image
                }
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }

    static async updateProfileName(req, res) {
        try {
            const { email } = req.loginInfo
            const { first_name, last_name } = req.body

            const user = await Model.updateProfileName({ email, first_name, last_name })

            res.status(200).json({
                status: 0,
                message: "Update Pofile berhasil",
                data: {
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    profile_image: user.profile_image
                }
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }

    static async updateProfileImage(req, res) {
        try {
            const { email } = req.loginInfo
            const file = req.file

            if (!file) {
                return res.status(400).json({
                    status: 100,
                    message: "Gambar harus dipilih",
                    data: null
                })
            }

            const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`

            const user = await Model.updateProfileImage({ email, imageUrl })

            res.status(200).json({
                status: 0,
                message: "Update Profile Image berhasil",
                data: {
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    profile_image: user.profile_image
                }
            })
        } catch (error) {
            // console.log(error);
            res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }

    static async viewBalance(req, res) {
        try {
            const { email } = req.loginInfo

            const user = await Model.findUserByEmail({ email })

            res.status(200).json({
                status: 0,
                message: "Get Balance Berhasil",
                data: {
                    balance: user.balance
                }

            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }

    static async topup(req, res) {
        try {
            const { email } = req.loginInfo
            let { top_up_amount } = req.body
            top_up_amount = Number(top_up_amount)

            if (isNaN(top_up_amount) || top_up_amount < 0) {
                return res.status(400).json({
                    status: 102,
                    message: "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
                    data: null
                })
            }

            const user = await Model.topup({ email, top_up_amount })

            await Model.createTopupTransaction({ email, top_up_amount });

            res.status(200).json({
                status: 0,
                message: "Top Up Balance berhasil",
                data: {
                    balance: user.balance
                }
            })
        } catch (error) {
            // console.log(error);

            res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }

    static async transaction(req, res) {
        try {
            const { email } = req.loginInfo
            const { service_code } = req.body

            const transaction = await Model.transaction({ email, service_code })

            res.status(200).json({
                status: 0,
                message: "Transaksi berhasil",
                data: [
                    {
                        invoice_number: transaction.invoice_number,
                        service_code: transaction.service_code,
                        service_name: transaction.service_name,
                        transaction_type: transaction.transaction_type,
                        total_amount: transaction.total_amount,
                        created_on: transaction.created_on
                    }
                ]
            })
        } catch (error) {
            if (error.name === "ServiceNotFound") {
                return res.status(400).json({
                    status: 102,
                    message: "Service ataus Layanan tidak ditemukan",
                    data: null
                });
            }
            if (error.name === "Insufficient") {
                return res.status(400).json({
                    status: 102,
                    message: "Saldo tidak mencukupi",
                    data: null
                });
            }
            res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }

    static async transactionHistory(req, res) {
        try {
            const { email } = req.loginInfo
            let { limit, offset } = req.query

            limit = typeof limit === 'string' ? parseInt(limit) : undefined;
            offset = typeof offset === 'string' ? parseInt(offset) : 0;

            const history = await Model.transactionHistory(email, limit, offset)

            res.status(200).json({
                status: 0,
                message: "Get History Berhasil",
                data: {
                    offset: offset ?? 0,
                    limit: limit ?? history.length,
                    records: history
                }
            })
        } catch (error) {
            // console.log(error);

            res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }
}

module.exports = UserController