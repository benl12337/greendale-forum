const connection = require("./pool");
 
const queries = {

    getAllUsers: async() => {
        const { rows } = await connection.query('SELECT * FROM users');
        console.log(rows);
        return rows;
    },

    getAllMessages: async() => {
        const { rows } = await connection.query('SELECT * FROM messages LEFT JOIN users ON messages.user_id = users.user_id ORDER BY date DESC');
        console.log(rows);
        return rows;
    },

    getUserByUsername: async(username) => {
        const { rows } = await connection.query('SELECT * FROM users WHERE username = $1', [username]);
        return rows[0];
    },

    getUserById: async(userId) => {
        const { rows } = await connection.query('SELECT * FROM users WHERE user_id = $1', [userId]);
        return rows[0];
    },

    createUser: async(firstName, lastName, username, password) => {
        await connection.query("INSERT INTO users (first_name, last_name, username, admin, hash) VALUES($1, $2, $3, $4, $5)",  [firstName, lastName, username, false, password]);
    },

    createPost: async(userId, message) => {
        await connection.query("INSERT INTO messages (user_id, message, date) VALUES ($1,$2, $3)", [userId, message, new Date()]);
    },

    upgradeUser: async(userId) => {
        await connection.query("UPDATE users SET admin = true WHERE user_id=$1", [userId]);
    },

    getSession: async() => {
        const { rows } = await connection.query('SELECT * FROM session');
        return rows;
    },
}

module.exports = { queries, connection };
