const sql = require('sql');
const Pool = require('pg').Pool
const dbUserName = process.env.DB_USER_NAME || '*****';
const dbPassword = process.env.DB_PASSWORD || '******';
const pool = new Pool({
    connectionString: `postgres://${dbUserName}:${dbPassword}@ep-holy-mouse-66720231.ap-southeast-1.aws.neon.tech/neondb?options=endpoint%3Dep-holy-mouse-66720231`,
    ssl: {
        rejectUnauthorized: false,
    },
});

let Expense = sql.define({
    name: 'user_expense_data',
    columns: [
        'metadata_id',
        'id',
        'title',
        'amount',
        'category',
        'description',
        'entry_date'
    ]
});

const insertExpenses = (expenses, metadataId) => {
    let records = expenses.map(expense => {
        let dbEntry = {};
        dbEntry.metadata_id = metadataId;
        dbEntry.id = expense.id;
        dbEntry.title = expense.title;
        dbEntry.amount = expense.amount;
        dbEntry.category = expense.category;
        dbEntry.description = expense.description;
        dbEntry.entry_date = expense.entry_date;
        return dbEntry;
    });
    console.log('DB records to insert:', records);
    let query = Expense.insert(records).returning(Expense.id).toQuery();
    return new Promise((resolve, reject) => {
        pool.query(query, (error, results) => {
            if (error) {
                //throw error
                reject(error);
            } else {
                //response.status(201).send(`User added with ID: ${results.rows[0].user_id}`)
                resolve(results);
            }
        });
    });
}

const updateMetaData = (userId, metadataId, status) => {
    console.log(`Metadata update request received for userId: ${userId}, metadataId: ${metadataId}, status: ${status}`);

    return new Promise((resolve, reject) => {
        pool.query(
            'UPDATE metadata SET status = $1, update_time = CURRENT_TIMESTAMP WHERE id = $2 and user_id = $3',
            [status, metadataId, userId],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    //console.log('metadata update result object:', results);
                    resolve(results.rowCount);
                }
            }
        );
    });

}

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
        });
    });
}

const createAuthRecord = (id, verificationCode) => {
    console.log(`Creating auth record for user id: ${id}, verification code: ${verificationCode}`);
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO auth (user_id, verification_code) VALUES ($1, $2)', [id, verificationCode], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve('DONE');
            }
        });
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

const updateAuthByName = (username, token, expiry) => {
    // expiry is in epoc time
    return new Promise((resolve, reject) => {
        pool.query('UPDATE auth AS auth SET auth_token = $1, token_expiry_time = to_timestamp($2) FROM users as users WHERE auth.user_id = users.user_id AND users.user_name = $3', [token, expiry, username], (error, results) => {
            if(error) {
                reject(error);
            } else {
                resolve('DONE');
            }
        });
    });
}

const resetAuthByName = (username) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE auth AS auth SET auth_token = null, token_expiry_time = null FROM users as users WHERE auth.user_id = users.user_id AND users.user_name = $1', [username], (error, results) => {
            if(error) {
                reject(error);
            } else {
                resolve('DONE');
            }

        });
    });
}

const getUserByName = (name) => {
    console.log('Request received for getting user by name:', name);

    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE user_name = $1', [name], (error, results) => {
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
        pool.query('DELETE FROM users USING auth WHERE users.user_id = auth.user_id and users.user_id = $1', [id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                // response.status(200).send(`User deleted with ID: ${id}`)
                resolve(id);
            }
        })
    });
}

const deleteNonReadyUserRecords = () => {
    console.log('Deleting older non-ready user records');
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM users USING auth WHERE users.user_id = auth.user_id and create_time < NOW() - INTERVAL '1 day' and status = 'INIT' ",
            [],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve('DONE');
                }
            }
        );
    });
}

const deleteNonReadyMetadata = () => {
    console.log('Deleting older non-ready metadata records');
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM metadata where create_time < NOW() - INTERVAL '1 day' and status = 'INIT' ",
            [],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve('DONE');
                }
            }
        );
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
        );
    });
}

const createMetaData = (userId) => {
    console.log('Creating meta-data entry for user:', userId);
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO metadata (user_id) VALUES ($1)  RETURNING *', [userId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.rows[0].id);
            }
        });
    });
}

const getMetadataIdForUser = (userId) => {
    console.log('Getting latest metadata id for user:', userId);
    return new Promise((resolve, reject) => {
        pool.query("SELECT * from metadata WHERE user_id = $1 AND STATUS = 'FINISHED' ORDER BY id DESC", [userId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                if (results.rows.length < 1) {
                    reject('No Data found.');
                } else {
                    resolve(results.rows[0].id);
                }
            }
        });
    });
}

const getTotalMetadataCount = (userId, metadataId) => {
    console.log(`Getting metadata count for userId: ${userId}, metadataId: ${metadataId}`);
    return new Promise((resolve, reject) => {
        pool.query("SELECT count(*) as count from user_expense_data where metadata_id = $1", [metadataId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve({ count: results.rows[0].count, metadataId: metadataId });
            }
        });
    });
}

const getMetaMasterById = (userId, metadataId) => {
    console.log(`Getting metadata for userId: ${userId}, metadataId: ${metadataId}`);
    return new Promise((resolve, reject) => {
        pool.query("SELECT * from metadata where id = $1 and user_id = $2", [metadataId, userId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.rows);
            }
        });
    });
}

module.exports = {
    getUsers,
    getUserById,
    getUserByName,
    createUser,
    updateUser,
    deleteUser,
    deleteNonReadyUserRecords,
    createAuthRecord,
    createMetaData,
    insertExpenses,
    updateMetaData,
    deleteNonReadyMetadata,
    getMetadataIdForUser,
    getMetaMasterById,
    getTotalMetadataCount,
    updateAuthByName,
    resetAuthByName,
}