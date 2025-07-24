const Model = require("../models/model");

class ServiceController {
    static async read(req, res) {
        const services = await Model.viewServices()

        res.status(200).json({
            status: 0,
            message: "Sukses",
            data: services
        })
    }
}

module.exports = ServiceController