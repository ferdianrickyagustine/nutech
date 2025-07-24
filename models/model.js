const pool = require("../database/config");
const { hash, compare } = require("../helpers/bcrypt");

class Model {
    // User

    static async register({ email, first_name, last_name, password }) {
        try {
            const hashedPass = hash(password)

            const query = `insert into "Users" (email, first_name, last_name, password)
                            values
                            ($1, $2, $3, $4)`

            const result = await pool.query(query, [
                email,
                first_name,
                last_name,
                hashedPass
            ])

            return true
        } catch (error) {
            throw error
        }
    }

    static async login({ email, password }) {
        try {
            const query = `select * from "Users" u 
                            where u.email = $1
                            `
            const result = await pool.query(query, [email])

            if (result.rows.length === 0 || !compare(password, result.rows[0].password)) {
                throw { name: "Unauthorized" }
            }

            const user = {
                id: result.rows[0].id,
                email: result.rows[0].email
            }
            return user
        } catch (error) {
            throw error
        }
    }

    static async findUserByEmail({ email }) {
        try {
            const query = `SELECT * FROM "Users" WHERE email = $1`
            const result = await pool.query(query, [email])

            if (result.rows.length === 0) {
                return null //nanti jadi throw unauthorized
            }
            // console.log(result.rows);

            return result.rows[0]
        } catch (error) {
            throw error
        }
    }

    static async updateProfileName({ email, first_name, last_name }) {
        try {
            const query = `
                            UPDATE "Users" 
                            SET 
                            first_name = $2,
                            last_name = $3
                            WHERE email = $1
                            RETURNING email, first_name, last_name, profile_image 
                            `
            const result = await pool.query(query, [email, first_name, last_name])

            if (result.rows.length === 0) {
                return null //nanti jadi throw unauthorized
            }

            // console.log(result.rows[0]);

            return result.rows[0]
        } catch (error) {
            throw error
        }
    }

    static async updateProfileImage({ email, imageUrl }) {
        try {
            const query = `
                            UPDATE "Users" 
                            SET profile_image = $2
                            WHERE email = $1
                            RETURNING email, first_name, last_name, profile_image
                            `
            const result = await pool.query(query, [email, imageUrl])

            if (result.rows.length === 0) {
                return null
            }

            return result.rows[0]
        } catch (error) {
            throw error
        }
    }


    // Banners

    static async viewBanners() {
        try {
            const query = `
                            SELECT banner_name, banner_image, description
                            FROM "Banners"
                            `
            const result = await pool.query(query)

            return result.rows
        } catch (error) {
            throw error
        }
    }



    // Services

    static async viewServices() {
        try {
            const query = `SELECT service_code, service_name, service_icon, service_tariff
                            FROM "Services"
                            `

            const result = await pool.query(query)

            return result.rows
        } catch (error) {
            throw error
        }
    }


    // Topup

    static async topup({ email, top_up_amount }) {
        try {
            const query = `
                            UPDATE "Users"
                            SET balance = balance + $2
                            WHERE email = $1
                            RETURNING balance
                            `

            const result = await pool.query(query, [email, top_up_amount])

            // console.log(result.rows);

            return result.rows[0]
        } catch (error) {
            throw error
        }
    }

    static async createTopupTransaction({ email, top_up_amount }) {
        try {
            const invoiceNumber = `INV${new Date().toISOString().slice(0, 10)}`
            const query = `
                            INSERT INTO "Transactions" (invoice_number, email, service_code, service_name, transaction_type, total_amount)
                            VALUES ($1, $2, $3, $4, $5, $6)
                            `
            await pool.query(query, [invoiceNumber, email, 'TOPUP', 'TOPUP', 'TOPUP', top_up_amount])

            return true
        } catch (error) {
            throw error
        }
    }

    static async transaction({ email, service_code }) {
        try {
            const invoiceNumber = `INV${new Date().toISOString().slice(0, 10)}`
            const query = `select * FROM "Services" WHERE service_code = $1`
            const serviceResult = await pool.query(query, [service_code])

            if (serviceResult.rows.length === 0) {
                throw { name: "ServiceNotFound" }
            }

            // console.log(serviceResult.rows);

            const { service_name, service_tariff } = serviceResult.rows[0]


            const userQuery = `SELECT balance FROM "Users" WHERE email = $1`
            const userResult = await pool.query(userQuery, [email])

            // console.log(userResult.rows);

            const { balance } = userResult.rows[0]

            if (balance < service_tariff) {
                throw { name: "Insufficient" }
            }

            const updateBalanceQuery = `UPDATE "Users"
                                        SET balance = balance - $1 
                                        WHERE email = $2
                                        `
            await pool.query(updateBalanceQuery, [service_tariff, email])

            const insertQuery = `
                                INSERT INTO "Transactions" (invoice_number, email, service_code, service_name, transaction_type, "total_amount")
                                VALUES ($1, $2, $3, $4, $5, $6)
                                RETURNING *
                                `
            const result = await pool.query(insertQuery, [invoiceNumber, email, service_code, service_name, 'PAYMENT', service_tariff])
            // console.log(result.rows);

            return result.rows[0]
        } catch (error) {
            throw error
        }
    }

    static async transactionHistory(email, limit, offset) {
        try {
            let query = `
                            SELECT invoice_number, transaction_type, service_name AS description, total_amount, created_on
                            FROM "Transactions"
                            WHERE email = $1
                            ORDER BY created_on DESC
                            `
            const params = [email];

            if (typeof limit !== 'undefined' && typeof offset !== 'undefined') {
                query += ` LIMIT $2 OFFSET $3`;
                params.push(limit, offset);
            }

            const result = await pool.query(query, params);
            return result.rows;
        } catch (error) {
            throw error
        }
    }
}

module.exports = Model