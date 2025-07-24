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
}

module.exports = Model