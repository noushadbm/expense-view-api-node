const Pool = require('pg').Pool
const pool = new Pool({
    connectionString: 'postgres://noushadbm:3cQw2nGUsxNB@ep-holy-mouse-66720231.ap-southeast-1.aws.neon.tech/neondb?options=endpoint%3Dep-holy-mouse-66720231',
    ssl: {
        rejectUnauthorized: false,
    },
});

const createUser = (name, password, email) => {
    console.log('Create user request received for username:', name);
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO users (user_name, user_password, email) VALUES ($1, $2, $3) RETURNING *', [name, password, email], (error, results) => {
            if (error) {
                //throw error
                reject(error);
            } else {
                //response.status(201).send(`User added with ID: ${results.rows[0].user_id}`)
                resolve(results.rows[0].user_id);
            }
        })
    });
}

const getUsers = () => {
    console.log('Request received for all user list.');
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users ORDER BY user_id ASC', (error, results) => {
            if (error) {
                //throw error
                reject(error);
            } else {
                //response.status(200).json(results.rows)
                resolve(results.rows);
            }
        })
    });
}

const getUserById = (id) => {
    console.log('Request received for getting user by id:', id);

    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE user_id = $1', [id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                // response.status(200).json(results.rows)
                resolve(results.rows);
            }
        })
    });
}

const deleteUser = (id) => {
    console.log('Request received for deleting user:', id);
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM users WHERE user_id = $1', [id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                // response.status(200).send(`User deleted with ID: ${id}`)
                resolve(id);
            }
        })
    });
}

const updateUser = (id, name, email) => {
    console.log('Request received for getting user:', id);

    return new Promise((resolve, reject) => {
        pool.query(
            'UPDATE users SET user_name = $1, email = $2 WHERE user_id = $3',
            [name, email, id],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    //response.status(200).send(`User modified with ID: ${id}`)
                    resolve(id);
                }
            }
        )
    });
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
}