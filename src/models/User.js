// models/User.js
import { psql } from '../db.js';

class User {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.points = data.points;
    }

    static async findByEmail(email) {
        const result = await psql.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0] ? new User(result.rows[0]) : null;
    }

    static async create(userData) {
        const result = await psql.query(
            'INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
            [userData.id, userData.name, userData.email, userData.password]
        );
        return new User(result.rows[0]);
    }

    async updatePoints(points) {
        const result = await psql.query(
            'UPDATE users SET points = points + $1 WHERE id = $2 RETURNING points',
            [points, this.id]
        );
        this.points = result.rows[0].points;
        return this.points;
    }
}

export default User;