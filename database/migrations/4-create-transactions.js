const pool = require("../config")

async function setup() {
    let queryDelete = `drop table if exists "Transactions"`

    let queryTransactions = `create table if not exists "Transactions" (
                                invoice_number varchar,
                                service_code varchar,
                                service_name varchar,
                                transaction_type varchar,
                                total_amount int,
                                created_on TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
                            )
                            `

    await pool.query(queryDelete)
    console.log("Successfully Delete Transactions table");

    await pool.query(queryTransactions)
    console.log("Successfully Create Transactions table");
}

module.exports = setup