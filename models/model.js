const pool = require("../database/config");
const { hash, compare } = require("../helpers/bcrypt");

class Model {
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

            return result.rows[0]
        } catch (error) {
            throw error
        }
    }
}

module.exports = Model