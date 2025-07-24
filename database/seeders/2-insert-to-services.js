const fs = require('fs').promises
const path = require('path')
const pool = require('../config')

async function seed() {
    const filePath = path.join(__dirname, "../../data/services.json")
    const servicesJson = await fs.readFile(filePath, "utf-8")
    let servicesParsed = JSON.parse(servicesJson)
    let query = `insert into "Services" (service_code, service_name, service_icon, service_tariff) values \n`
    let services = servicesParsed.map(service => {
        return `('${service.service_code}', '${service.service_name}', '${service.service_icon}', '${service.service_tariff}')`
    }).join(", \n")

    query += services

    await pool.query(query)
    console.log("Successfully insert into Services table");
}
seed()