const pool = require("../config");

async function setup() {
    let queryDelete = `drop table if exists "Users"`

    let queryUsers = `create table if not exists "Users" (
                        id serial primary key,
                        email varchar not null,
                        first_name varchar not null,
                        last_name varchar not null,
                        password varchar not null,
                        profile_image varchar,
                        balance int
                        )`

    await pool.query(queryDelete)
    console.log("Successfully Delete Users Table");

    await pool.query(queryUsers)
    console.log("Successfully Create Users Table")
}

module.exports = setup