const pool = require("../config")

async function setup() {
    let queryDelete = `drop table if exists "Services"`

    let queryServices =  `create table if not exists "Services" (
                            service_code varchar not null,
                            service_name varchar not null,
                            service_icon varchar not null,
                            service_tariff varchar not null 
                            )`

    await pool.query(queryDelete)
    console.log("Successfully Delete Services table");
    
    await pool.query(queryServices)
    console.log("Successfully Create Services table");
}

module.exports = setup