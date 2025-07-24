const Model = require("../models/model")

class BannerController {
    static async read(req, res) {
        const banners = await Model.viewBanners()
        res.status(200).json({
            status: 0,
            message: "Sukses",
            data: banners
        })
    }
}

module.exports = BannerController