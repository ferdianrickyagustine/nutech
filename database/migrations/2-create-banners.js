const pool = require("../config");

async function setup() {
    let queryDelete = `drop table if exists "Banners"`

    let queryBanners = `create table if not exists "Banners" (
                        banner_name varchar not null,
                        banner_image varchar not null,
                        description varchar not null
                        )`

    await pool.query(queryDelete)
    console.log("Successfully Delete Banners Table");    

    await pool.query(queryBanners)
    console.log("Successfully Create Banners Table");
}

module.exports = setup