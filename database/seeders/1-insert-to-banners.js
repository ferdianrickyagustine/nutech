const pool = require("../config");
const path = require("path");
const fs = require('fs').promises

async function seed() {
    const filePath = path.join(__dirname, "../../data/banners.json");
    const bannersJson = await fs.readFile(filePath, "utf-8");
    let bannersParsed = JSON.parse(bannersJson)
    let query =  `insert into "Banners" (banner_name, banner_image, description) values \n`
    let banners = bannersParsed.map(banner => {
        return `('${banner.banner_name}', '${banner.banner_image}', '${banner.description}')`
    }).join (", \n")

    query += banners

    await pool.query(query)
    console.log("Successfully insert into Banners table");
}
seed()